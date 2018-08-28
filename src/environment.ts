import * as path from 'path';
import * as os from 'os';
import { initModels } from './entities/init';
import { authenticate, setConfig } from 'couchrelay';
import { mkdirSync } from 'fs';


export const HOST = 'http://localhost';
export const APP_PORT = 4000;

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

export const kmzTempUploadPath = path.join(os.tmpdir(), 'tmpkmz');

try {
  mkdirSync(kmzTempUploadPath);
} catch(e) {
  // pass
}
