import { Request, Response, Express } from "express";
import * as multer from 'multer';

import { kmzTempUploadPath } from "../environment";
import { schema } from '../schema';
import { graphql } from 'graphql';


const upload = multer({ dest: kmzTempUploadPath });

export const pathname = '/importKmz';

export async function handler(req: Request, res: Response) {
  const kmzFilePath: string = req.file.path;
  const importResult = await graphql({ schema, contextValue: { kmzFilePath },  source: `
    mutation {
      importKmz {
        id
        modelObjects {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  `});
  res.write(JSON.stringify(importResult));
  res.end();
}

export function load(app: Express, prefix: string = '') {
  app.put(prefix.concat(pathname), upload.single('kmzfile'), handler);
}
