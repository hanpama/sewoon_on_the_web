import { ensureDatabaseReady, APP_PORT, HOST } from './environment';

import { ApolloServer } from 'apollo-server-express';
import { schema } from './schema';
import * as express from 'express';
import { czml, gltf, kmz } from './routes';
import { Server } from 'http';


function main() {
  return new Promise<Server>(async (resolve, _reject) => {

    await ensureDatabaseReady();

    const app = express();
    const apolloServer = new ApolloServer({ schema });

    czml.load(app);
    gltf.load(app);
    kmz.load(app);

    apolloServer.applyMiddleware({ app, path: '/graphql' }); // app is from an existing express app

    const server = app.listen({ port: APP_PORT }, () => {
      console.log(`🚀 Server ready at ${HOST}:${APP_PORT}${apolloServer.graphqlPath}`);
      resolve(server);
    });
  });
}

export const appReady = main();
