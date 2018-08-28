import * as path from 'path';
import { initModels } from './entities/init';
import { authenticate, setConfig } from 'couchrelay';


setConfig({
  user: 'test',
  password: 'verystrongpassword',
  port: 15984,
});

export async function ensureDatabaseReady(){
  await authenticate();
  await initModels();
};

export const collada2GltfBinary = path.join(__dirname, '..', 'COLLADA2GLTF-v2.1.3', process.platform, 'COLLADA2GLTF-bin');
