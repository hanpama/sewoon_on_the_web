import { createConnection, Connection } from "typeorm";
import { Collection, GltfModel, ModelObject } from './entities'

export let connection: Connection;

export const connectionPromise = createConnection({
  name: "example",
  type: "sqlite",
  database: "temp/sqlitedb.db",
  synchronize: true,
  // logging: true,
  entities: [Collection, GltfModel, ModelObject],
});

connectionPromise.then(conn => { connection = conn; });
