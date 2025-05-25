import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { MemberType, MemberTypeIdEnum } from './types/memberType.js';
import { GraphQLContext } from './types/graphQLContext.js';
import { UUIDType } from './types/uuid.js';
import { PostResponse } from './types/post.js';
import { Profile } from './types/profile.js';
import { User } from './types/user.js';

export const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: (_: unknown, __: unknown, { prisma }: GraphQLContext) => {
        return prisma.memberType.findMany();
      },
    },
    memberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
      },
      resolve: (_, { id }: { id: string }, { prisma }: GraphQLContext) => {
        return prisma.memberType.findUnique({ where: { id } });
      }
    },

    posts: {
      type: new GraphQLList(PostResponse),
      resolve: (_, __, { prisma }: GraphQLContext) => {
        return prisma.post.findMany();
      }
    },
    post: {
      type: PostResponse,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: (_, { id }: { id: string }, { prisma }: GraphQLContext) => {
        return prisma.post.findUnique({ where: { id } });
      }
    },

    profiles: {
      type: new GraphQLList(Profile),
      resolve: (_, __, { prisma }: GraphQLContext) => {
        return prisma.profile.findMany();
      }
    },
    profile: {
      type: Profile,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: (_, { id }: { id: string }, { prisma }: GraphQLContext) => {
        return prisma.profile.findUnique({ where: { id } });
      }
    },

    users: {
      type: new GraphQLList(User),
      resolve: (_, __, { prisma }: GraphQLContext) => {
        return prisma.user.findMany();
      }
    },
    user: {
      type: User,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: (_, { id }: { id: string }, { prisma }: GraphQLContext) => {
        return prisma.user.findUnique({ where: { id } });
      }
    },
  },
});