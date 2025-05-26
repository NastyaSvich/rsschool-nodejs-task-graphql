import {GraphQLNonNull, GraphQLObjectType, GraphQLString} from 'graphql';
import {UUIDType} from "./uuid.js";

export const PostRequest = new GraphQLObjectType({
    name: 'PostRequest',
    fields: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
    },
});

export const PostResponse = new GraphQLObjectType({
  name: 'PostResponse',
  fields: {
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
});

export interface IPost {
  id: string;
  title: string;
  content: string;
}
