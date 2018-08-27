import { Model, field, Index } from 'couchrelay';
import { Collection } from './Collection';
import { ObjectType, gql, getGraphQLType } from 'girin';
import { connectionDefinitions } from 'graphql-relay';


@ObjectType.define(gql`
  type ModelObject {
    id: String!
    latitude: Float!
    longitude: Float!
    altitude: Float!
    description: String

  }
`)
export class ModelObject extends Model {
  @field('_id') id: string;
  @field() latitude: number;
  @field() longitude: number;
  @field() altitude: number;
  @field() description: string;
  @field() collectionId: string;
  @field() gltfId: string;


  async collection() {
    return Promise.resolve(this.collectionId).then(id => {
      return Collection.allDocs().getDoc(id);
    });
  }

  static byCollectionId = new Index(ModelObject, {
    ddoc: 'by-collection-id',
    name: 'index',
    index: {
      fields: ['collectionId', '_id'],
    },
  });
}

export const {
  connectionType: ModelObjectConnection,
  edgeType: ModelObjectConnectionEdge,
} = connectionDefinitions({
  nodeType: getGraphQLType(ModelObject),
});
