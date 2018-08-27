import * as fetch from 'isomorphic-fetch';
import * as path from 'path';
import { ensureDatabaseReady } from '../src/environment';
import { setConfig, globalConfig } from 'couchrelay';
import { schema } from '../src/schema';
import { graphql } from 'graphql';
import { Collection, ModelObject } from '../src/entities';


describe('schema', () => {

  beforeEach(async () => {
    setConfig({
      user: 'test',
      password: 'verystrongpassword',
      port: 15984,
    });

    await ensureDatabaseReady();
  });

  afterEach(async () => {
    await Promise.all([
      fetch(Collection.dbURL, { method: 'DELETE', headers: globalConfig.headers }),
      fetch(ModelObject.dbURL, { method: 'DELETE', headers: globalConfig.headers })
    ]);
  });

  it('lets we upload kmz file', async () => {

    const execResult = await graphql({
      schema,
      source: `
        mutation {
          importKmz {
            id
            modelObjects {
              edges {
                node {
                  id
                  longitude
                  latitude
                  altitude
                  description
                }
              }
            }
          }
        }
      `,
      contextValue: { kmzFilePath: path.join(__dirname, 'fixture.kmz') },
    });

    expect(execResult.errors).toBeUndefined();
    expect(typeof execResult.data!.importKmz.id).toBe('string');
    expect(Array.isArray(execResult.data!.importKmz.modelObjects.edges)).toBeTruthy();
    expect(typeof execResult.data!.importKmz.modelObjects.edges[0].node.id).toBe('string');
  });
});
