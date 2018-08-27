import * as path from 'path';
import { initModels } from './entities/init';
import { setConfig, authenticate } from 'couchrelay';


export async function ensureDatabaseReady(){
  await authenticate();
  await initModels();
};

export const collada2GltfBinary = path.join(__dirname, '..', 'COLLADA2GLTF-v2.1.3', process.platform, 'COLLADA2GLTF-bin');
