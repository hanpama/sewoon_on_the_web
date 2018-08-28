import { Model, field } from 'couchrelay';
import { ObjectType, gql } from 'girin';

import { ModelObject, ModelObjectConnection } from './ModelObject';
import { HOST, APP_PORT } from '../environment';


@ObjectType.define(gql`
  type Collection {
    id: String!
    name: String!
    czml: String!
    modelObjects: ${() => ModelObjectConnection}
  }
`)
export class Collection extends Model {

  @field('_id') id: string;
  @field() name: string;
  // @field() ownerId: string;
  czml() {
    return `${HOST}:${APP_PORT}/czml/${this.id}`;
  }

  modelObjects(connectionArgs?: any) {
    const { _id } = this;
    // console.log(this);
    return ModelObject.byCollectionId
      .getConnection({ selectors: [{ collectionId: _id }] })
      .exec(connectionArgs);
  }
}
