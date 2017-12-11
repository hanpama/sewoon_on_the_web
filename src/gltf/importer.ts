import { Connection } from "typeorm/connection/Connection";
import { GltfModel } from '../entities/GltfModel';
import { convert } from './convert';


export async function importFromColladaFile(connection: Connection, colladaFp: string) {
  const {originalChecksum, data} = await convert(colladaFp);
  const gltfModel = new GltfModel();
  gltfModel.originalChecksum = originalChecksum;
  gltfModel.data = data;
  const result = await connection.getRepository(GltfModel).save(gltfModel);
  return result;
}
