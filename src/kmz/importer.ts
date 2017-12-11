import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import * as child_process from 'child_process';

import { parseKml } from './kmlparser';
import { importFromColladaFile } from '../gltf/importer';
import { ModelObject } from '../entities/ModelObject';
import { Collection } from '../entities/Collection';
import { Connection } from 'typeorm/connection/Connection';


const exists = promisify(fs.exists);
const exec = promisify(child_process.exec);
const readFile = promisify(fs.readFile);


const unzipDir = path.join(os.tmpdir(), 'tga', 'unzip');
// const unzipDir = path.join(tmpdir, 'unzip');

/**
 * container 노드들은 관심 없음.
 * 패킷이 될 수 있는 애들을 모두 추려서
 * flat 하게 패킷으로 만들고
 * 이것을 packages 라고 만들어서 묶자
 *
 * 트리 구조를 순회하면서 맵에 포함되어 있으면 변환하여 인서트,
 * 그 결과를 array 에 푸시하여 반환한다.
 */
async function insertKmlDataRecursively(node: any, context: any, packetInsertResults: ModelObject[] = []): Promise<ModelObject[]> {
  const { children, type } = node;
  // const packetsCollection = await packetsCollectionPromise;

  // let packet;
  if (type === 'Model') {
    const { latitude, longitude, altitude } = children.find((i: any) => i.type === 'Location');
    // const { x, y, z } = children.find(i => i.type === 'Scale') || {};
    const foundChild = children.find((i: any) => i.type === 'Link') || {};
    const href = foundChild && foundChild.href;

    const connection: Connection = context.connection;

    const gltf = await importFromColladaFile(
      connection,
      path.join(path.dirname(context.filepath), href)
    );

    const modelObject = new ModelObject();
    modelObject.latitude = Number(latitude);
    modelObject.longitude = Number(longitude);
    modelObject.altitude = Number(altitude);
    modelObject.gltf = gltf;

    const savedModelObject = await connection
      .getRepository(ModelObject)
      .save(modelObject);;

    return [...packetInsertResults,  savedModelObject] as any;
  }

  if (Array.isArray(children) && children.length > 0) {
    const childPromises = Promise.all(
      children.map(child =>
        insertKmlDataRecursively(child, context, packetInsertResults)
      )
    );
    const childIds = (await childPromises).reduce((result, item) => [...result, ...item], []);
    return [...packetInsertResults, ...childIds];
  }
  else {
    return packetInsertResults;
  }

}

export async function importKmzFile(connection: Connection, fp: string) {
  const basename = path.basename(fp);
  const unzipCommand = `mkdir -p ${unzipDir}/${basename} && \
    unzip ${fp} -d ${unzipDir}/${basename}`;

  await exec(unzipCommand);

  const kmlFilePath = `${unzipDir}/${basename}/doc.kml`;

  if (!(await exists(kmlFilePath))) {
    throw new Error('Invalid KMZ file(doc.kml file does not exist)');
  }

  const kmlString = (await readFile(kmlFilePath)).toString();
  const kmlData = await parseKml(kmlString);
  // const packagesCollection = await packagesCollectionPromise;

  // kml 을 읽고 패킷을 데이터베이스에 입력, 그 결과 id 를 가져와서..
  const modelObjects = await insertKmlDataRecursively(kmlData, {
    filepath: kmlFilePath,
    connection,
  });
  // package 를 하나 만들어서 패킷 목록을 집어넣음
  const collection = new Collection();
  collection.name = path.basename(fp).split('.')[0];
  collection.models = modelObjects;
  const newCollection = await connection.getRepository(Collection).save(collection);

  return newCollection;
}


module.exports = {
  importKmzFile,
};


