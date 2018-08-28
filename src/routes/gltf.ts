import { Request, Response } from "express";
import * as proxy from 'http-proxy';

import { ModelObject } from "../entities";
import { globalConfig } from "couchrelay";


const gltfProxy = proxy.createProxy();

export const path = '/gltf/:modelId';

export function handler(req: Request, res: Response) {
  const modelId: string = req.params.modelId;
  gltfProxy.web(req, res, {
    ignorePath: true,
    target: `${ModelObject.dbURL}/${modelId}/model.glb`,
    headers: globalConfig.headers,
  });
}
