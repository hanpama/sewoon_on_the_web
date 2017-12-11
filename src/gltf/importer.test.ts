import * as path from 'path';
import { importFromColladaFile } from './importer';

import { connectionPromise } from '../connection';

test('test importing', async () => {
  const connection = await connectionPromise;
  const result = await importFromColladaFile(connection, path.join(__dirname, 'fixtures', 'model.dae'));
  console.log(result);
});

