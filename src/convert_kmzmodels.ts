import 'reflect-metadata';

import { connectionPromise } from './connection';
import { importKmzFile } from './kmz/importer';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import * as child_process from 'child_process';

const exec = promisify(child_process.exec);
const readdir = promisify(fs.readdir);
const writeFile= promisify(fs.writeFile);

const servicePrefix = '/data';
const modelsDir = '/var/kmzmodels/';
const exportDir = '/var/export/';

connectionPromise.then(async connection => {

  await Promise.all([
    exec('mkdir -p /var/export/gltf'),
    exec('mkdir -p /var/export/czml'),
  ])

  const files = (await readdir(modelsDir)).filter(name => name.endsWith('.kmz'));;
  const collections = await Promise.all(files.map(async fn => {
    return await importKmzFile(connection, path.join(modelsDir, fn));
  }));

  await Promise.all(collections.map(async collection => {

    await Promise.all(collection.models.map(model => (
      writeFile(
        path.join(exportDir, 'gltf', `${model.gltf.id}.gltf`),
        model.gltf.data,
      )
    )));

    await writeFile(
      path.join(exportDir, 'czml', `${collection.name}.czml`),
      JSON.stringify([
        {
          "id": "document",
          "name": collection.name,
          "version": "1.0",
        },
        ...collection.models.map(
          model => ({
            id: model.id,
            position: {
              cartographicDegrees: [
                model.longitude,
                model.latitude,
                model.altitude,
              ],
            },
            model: {
              gltf: `${servicePrefix}/gltf/${model.gltf.id}.gltf`,
            },
          })
        )
      ]),
    )
  }))

}).catch(console.error);
