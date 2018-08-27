import { Collection } from "./Collection";
import { ModelObject } from "./ModelObject";


export async function initModels() {
  await Promise.all([
    Collection.init(),
    ModelObject.init(),
  ]);
  await Promise.all([
    ModelObject.byCollectionId.init(),
  ]);
}
