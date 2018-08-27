import * as os from 'os';
import * as path from 'path';
import * as crypto from 'crypto';
import { promisify } from 'util'
import { exec as _exec } from 'child_process';
import { readFile as _readFile } from 'fs';
import { collada2GltfBinary } from '../environment';

const exec = promisify(_exec);
const readFile = promisify(_readFile);

const gltfDir = path.join(os.tmpdir(), 'tga', 'gltf');

export async function convert(fp: string) {
  const fileBuffer = await readFile(fp);
  const checksum = crypto.createHash('md5').update(fileBuffer).digest('hex');
  const outFp = `${gltfDir}/${checksum}.glb`;

  const transformCommand = `${collada2GltfBinary} \
    -b \
    -i ${fp} \
    -o ${outFp}`;

  await exec(transformCommand);

  const gltfBinary = await readFile(outFp);
  return {
    checksum,
    gltfBinary,
  };
}
