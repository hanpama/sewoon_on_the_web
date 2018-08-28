import { Request, Response } from "express";
import * as invariant from 'invariant';

import { Collection } from "../entities";

export const path = '/czml/:collectionId';

export async function handler(req: Request, res: Response) {
  const collectionId: string = req.params.collectionId;
  invariant(collectionId, 'Field collectionId id is required');

  const collection = await Collection.allDocs().getDoc(collectionId) as Collection;
  invariant(collection, `No Collection found: ${collectionId}`);

  const modelObjects = await collection.modelObjects();

  res.write(JSON.stringify([
    {
      "id": "document",
      "name": collection.name,
      "version": "1.0",
    },
    ...modelObjects.edges.map(
      ({ node: model }) => ({
        id: model.id,
        position: {
          cartographicDegrees: [
            model.longitude,
            model.latitude,
            model.altitude,
          ],
        },
        model: {
          gltf: `/gltf/${model.id}`,
        },
      })
    )
  ]));
  res.end();
}