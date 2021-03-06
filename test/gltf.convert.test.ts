import * as path from 'path';
import { convert } from '../src/gltf/convert';


describe('collada-gltf conversion', () => {
  test('collada conversion', async () => {
    const result = await convert(path.join(__dirname, 'fixtures', 'model.dae'));
    expect(result.gltfBinary).toBeInstanceOf(Buffer);
  });
});
