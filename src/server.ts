import { ensureDatabaseReady } from './environment';

import { ApolloServer } from 'apollo-server-express';
import { schema } from './schema';
import * as express from 'express';
import { czml, gltf } from './routes';


async function main() {


  await ensureDatabaseReady();

  const app = express();
  const server = new ApolloServer({ schema });

  app.get(czml.path, czml.handler);
  app.get(gltf.path, gltf.handler);

  server.applyMiddleware({ app, path: '/graphql' }); // app is from an existing express app

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

main();
