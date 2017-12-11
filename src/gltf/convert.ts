import * as os from 'os';
import * as path from 'path';
import * as crypto from 'crypto';
import { promisify } from 'util'
import { exec as _exec } from 'child_process';
import { readFile as _readFile } from 'fs';

const exec = promisify(_exec);
const readFile = promisify(_readFile);

const gltfDir = path.join(os.tmpdir(), 'tga', 'gltf');

export async function convert(fp: string) {
  const fileBuffer = await readFile(fp);
  const checksum = crypto.createHash('sha224').update(fileBuffer).digest('hex');
  const outFp = `${gltfDir}/${checksum}.gltf`;

  const transformCommand = `COLLADA2GLTF-v2.0-linux/COLLADA2GLTF-bin \
    -i ${fp} \
    -o ${outFp}`;

  await exec(transformCommand);

  const gltfJsonString = (await readFile(outFp)).toString();
  return {
    originalChecksum: checksum,
    data: gltfJsonString,
  };
}
