import * as path from 'path';
import { convert } from '../src/gltf/convert';


test('collada conversion', async () => {
  const result = await convert(path.join(__dirname, 'fixtures', 'model.dae'));

  expect(typeof result.data).toBe('string');
  expect(typeof result.originalChecksum).toBe('string');

});

