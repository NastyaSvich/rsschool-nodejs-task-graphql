import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType, GraphQLResolveInfo,
} from 'graphql';
import { MemberType, MemberTypeIdEnum } from './types/memberType.js';
import { GraphQLContext } from './types/graphQLContext.js';
import { UUIDType } from './types/uuid.js';
import { PostResponse } from './types/post.js';
import { ProfileResponse } from './types/profile.js';
import { UserResponse } from './types/user.js';
import { FieldsByTypeName, parseResolveInfo } from 'graphql-parse-resolve-info';

export const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: (_: unknown, __: unknown, { prisma }: GraphQLContext) => {
        return prisma.memberType.findMany();
      }
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
      type: new GraphQLList(ProfileResponse),
      resolve: (_, __, { prisma }: GraphQLContext) => {
        return prisma.profile.findMany();
      }
    },
    profile: {
      type: ProfileResponse,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: (_, { id }: { id: string }, { prisma }: GraphQLContext) => {
        return prisma.profile.findUnique({ where: { id } });
      }
    },

    users: {
      type: new GraphQLList(UserResponse),
      resolve: (_, __, { prisma }: GraphQLContext, info: GraphQLResolveInfo) => {
        const parsedInfo = parseResolveInfo(info);
        const fields = parsedInfo?.fieldsByTypeName.User as FieldsByTypeName['User'];

        const include = {
          subscribedToUser: !!fields.subscribedToUser,
          userSubscribedTo: !!fields.userSubscribedTo
        };

        return prisma.user.findMany({ include });
      }
    },
    user: {
      type: UserResponse,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: (_, { id }: { id: string }, { prisma }: GraphQLContext) => {
        return prisma.user.findUnique({ where: { id } });
      }
    },
  },
});