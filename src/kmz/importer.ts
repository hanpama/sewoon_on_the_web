import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import * as child_process from 'child_process';

import { parseKml } from './kmlparser';
import { convert } from '../gltf/convert';
import { ModelObject } from '../entities/ModelObject';
import { Collection } from '../entities/Collection';


const exists = promisify(fs.exists);
const exec = promisify(child_process.exec);
const readFile = promisify(fs.readFile);

interface InsertingContext {
  filepath: string;
  collectionId: string;
}

/**
 * container 노드들은 관심 없음.
 * 패킷이 될 수 있는 애들을 모두 추려서
 * flat 하게 패킷으로 만들고
 * 이것을 packages 라고 만들어서 묶자
 *
 * 트리 구조를 순회하면서 맵에 포함되어 있으면 변환하여 인서트,
 * 그 결과를 array 에 푸시하여 반환한다.
 */
async function insertKmlDataRecursively(node: any, context: InsertingContext, packetInsertResults: string[] = []): Promise<string[]> {
  const { children, type } = node;
  // const packetsCollection = await packetsCollectionPromise;

  // let packet;
  if (type === 'Model') {
    const { latitude, longitude, altitude } = children.find((i: any) => i.type === 'Location');
    // const { x, y, z } = children.find(i => i.type === 'Scale') || {};
    const foundChild = children.find((i: any) => i.type === 'Link') || {};
    const href = foundChild && foundChild.href;

    const gltf = await convert(path.join(path.dirname(context.filepath), href));

    const modelObject = new ModelObject();
    modelObject.latitude = Number(latitude);
    modelObject.longitude = Number(longitude);
    modelObject.altitude = Number(altitude);
    modelObject.collectionId = context.collectionId;
    await modelObject.$save();
    await modelObject._attachments.put('model.glb', 'application/octet-stream', gltf.gltfBinary);

    return [...packetInsertResults, modelObject._id] as string[];
  }

  if (Array.isArray(children) && children.length > 0) {
    const childPromises = Promise.all(
      children.map(child => insertKmlDataRecursively(child, context, packetInsertResults))
    );
    const childIds = (await childPromises).reduce((result, item) => [...result, ...item], []);
    return [...packetInsertResults, ...childIds];
  }
  else {
    return packetInsertResults;
  }
}

export async function importKmzFile(collectionName: string, fp: string) {
  const basename = path.basename(fp);
  const unzipDir = `${os.tmpdir()}/${basename}`;
  const unzipCommand = `unzip -o ${fp} -d ${unzipDir}`;

  await exec(unzipCommand);

  const kmlFilePath = `${unzipDir}/doc.kml`;

  if (!(await exists(kmlFilePath))) {
    throw new Error('Invalid KMZ file(doc.kml file does not exist)');
  }

  const kmlString = (await readFile(kmlFilePath)).toString();
  const kmlData = await parseKml(kmlString);

  const collection = new Collection();
  collection.name = collectionName;
  await collection.$save();

  await insertKmlDataRecursively(kmlData, {
    filepath: kmlFilePath,
    collectionId: collection._id!,
  });

  await exec(`rm -rf ${unzipDir}`);

  return collection;
}
