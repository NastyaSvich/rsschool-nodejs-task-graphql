import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { GraphQLFloat, GraphQLInputObjectType } from 'graphql/index.js';
import { ProfileResponse, IProfile } from './profile.js';
import { GraphQLContext } from './graphQLContext.js';
import { IPost, PostResponse } from './post.js';

export const UserResponse = new GraphQLObjectType<IUserBase, GraphQLContext>({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    posts: {
      type: new GraphQLList(PostResponse),
      resolve: (parent: IUserParent, _, { prisma }: GraphQLContext) => {
        return prisma.post.findMany({ where: { authorId: parent.id } });
      },
    },
    profile: {
      type: ProfileResponse,
      resolve: (parent: IUserParent, _, { prisma }: GraphQLContext) => {
        return prisma.profile.findUnique({ where: { userId: parent.id } });
      }
    },
    subscribedToUser: {
      type: new GraphQLList(UserResponse),
      resolve: (parent: IUserParent, _, { prisma }: GraphQLContext) => {
        return prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: parent.id,
              },
            },
          },
        });
      }
    },
    userSubscribedTo: {
      type: new GraphQLList(UserResponse),
      resolve: (parent: IUserParent, _, { prisma }: GraphQLContext) => {
        return prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: parent.id,
              },
            },
          },
        });
      },
    }
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