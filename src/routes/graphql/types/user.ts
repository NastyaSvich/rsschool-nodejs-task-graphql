import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { GraphQLFloat, GraphQLInputObjectType } from 'graphql/index.js';
import { ProfileResponse, IProfile } from './profile.js';
import { GraphQLContext } from './graphQLContext.js';
import { IPost, PostResponse } from './post.js';

export const UserResponse = new GraphQLObjectType<IUserBase, GraphQLContext>({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    posts: {
      type: new GraphQLList(PostResponse),
      resolve: (parent: IUserBase, _, { loader }: GraphQLContext) => {
        return loader.post.load(parent.id);
      },
    },
    profile: {
      type: ProfileResponse,
      resolve: (parent: IUserBase, _, { loader }: GraphQLContext) => {
        return loader.profile.load(parent.id);
      }
    },
    subscribedToUser: {
      type: new GraphQLList(UserResponse),
      resolve: (parent: IUserBase, _, { loader }: GraphQLContext) => {
        return parent.subscribedToUser ?? loader.subscribedToUser.load(parent.id);
      }
    },
    userSubscribedTo: {
      type: new GraphQLList(UserResponse),
      resolve: (parent: IUserBase, _, { loader }: GraphQLContext) => {
        return parent.userSubscribedTo ?? loader.userSubscribedTo.load(parent.id);
      }
    },
  })
}) as unknown as GraphQLObjectType<IUserBase>;

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

export const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});

export interface IUserParent {
  id: string;
  name: string;
  balance: number;
}

export interface IUserBase {
  id: string;
  name: string;
  balance: number;
  profile: IProfile;
  posts: IPost[];
  userSubscribedTo: IUserBase[];
  subscribedToUser: IUserBase[];
}