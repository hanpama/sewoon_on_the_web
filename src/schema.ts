import * as path from 'path';

import { GraphQLSchema } from "graphql";
import { ObjectType, gql, getGraphQLType } from "girin";
import * as invariant from 'invariant';

import { Collection } from "./entities";
import { importKmzFile } from "./kmz/importer";


interface importKMZContext {
  kmzFilePath?: string;
}

@ObjectType.define(gql`
  type Mutation {
    importKmz: ${() => Collection}!
  }
`)
export class Mutation {
  static importKmz(_source: null, args: {}, context: importKMZContext) {
    invariant(context.kmzFilePath, 'Require kmzFilePath');
    const kmzFilePath: string = context.kmzFilePath!;
    const collectionName = path.basename(kmzFilePath).split('.')[0];
    // console.log(collectionName, kmzFilePath);
    return importKmzFile(collectionName, kmzFilePath);
  }
}


@ObjectType.define(gql`
  type Query {
    collection(id: String!): ${() => Collection}!
  }
`)
export class Query {
  static collection(_source: null, args: { id: string }, context: any) {
    console.log(context);
    return Collection.allDocs().getDoc(args.id);
  }
}

export const schema = new GraphQLSchema({
  query: getGraphQLType(Query),
  mutation: getGraphQLType(Mutation),
});
