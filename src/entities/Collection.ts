import { Model, field } from 'couchrelay';
import { ObjectType, gql } from 'girin';

import { ModelObject, ModelObjectConnection } from './ModelObject';


@ObjectType.define(gql`
  type Collection {
    id: String!
    name: String!
    modelObjects: ${() => ModelObjectConnection}
  }
`)
export class Collection extends Model {

  @field('_id') id: string;
  @field() name: string;
  // @field() ownerId: string;

  modelObjects(connectionArgs: any) {
    const { _id } = this;
    console.log(this);
    return ModelObject.byCollectionId
      .getConnection({ selectors: [{ collectionId: _id }] })
      .exec(connectionArgs);
  }
}
