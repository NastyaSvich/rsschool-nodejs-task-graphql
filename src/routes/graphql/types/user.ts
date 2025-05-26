import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { GraphQLFloat } from 'graphql/index.js';
import { Profile, IProfile } from './profile.js';
import { GraphQLContext } from './graphQLContext.js';
import { IPost, PostResponse } from './post.js';

export const User = new GraphQLObjectType<IUserBase, GraphQLContext>({
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
      type: Profile,
      resolve: (parent: IUserParent, _, { prisma }: GraphQLContext) => {
        return prisma.profile.findUnique({ where: { userId: parent.id } });
      }
    },
    subscribedToUser: {
      type: new GraphQLList(User),
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
      type: new GraphQLList(User),
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