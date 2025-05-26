import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { CreatePostInput, ChangePostInput, IPost, PostResponse } from './types/post.js';
import { GraphQLContext } from './types/graphQLContext.js';
import { UUIDType } from './types/uuid.js';
import { ChangeProfileInput, CreateProfileInput, IProfile, ProfileResponse } from './types/profile.js';
import { ChangeUserInput, CreateUserInput, IUserParent, UserResponse } from './types/user.js';

export const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createPost: {
      type: PostResponse,
      args: {
        dto: { type: CreatePostInput },
      },
      resolve: (_, { dto }: { dto: IPost }, { prisma }: GraphQLContext) => {
        return prisma.post.create({ data: dto });
      },
    },
    changePost: {
      type: PostResponse,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInput) },
      },
      resolve: (
        _,
        { id, dto }: { id: string; dto: Omit<IPost, 'id' | 'authorId'> },
        { prisma }: GraphQLContext,
      ) => {
        return prisma.post.update({ where: { id }, data: dto });
      },
    },
    deletePost: {
      type: GraphQLString,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }: { id: string }, { prisma }: GraphQLContext) => {
        await prisma.post.delete({ where: { id } });
        return null;
      },
    },

    createProfile: {
      type: ProfileResponse,
      args: {
        dto: { type: CreateProfileInput },
      },
      resolve: (_, { dto }: { dto: IProfile }, { prisma }: GraphQLContext) => {
        return prisma.profile.create({ data: dto });
      },
    },
    changeProfile: {
      type: ProfileResponse,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) },
      },
      resolve: (
        _,
        { id, dto }: { id: string; dto: Omit<IProfile, 'id' | 'userId'> },
        { prisma }: GraphQLContext,
      ) => {
        return prisma.profile.update({ where: { id }, data: dto });
      },
    },
    deleteProfile: {
      type: GraphQLString,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }: { id: string }, { prisma }: GraphQLContext) => {
        await prisma.profile.delete({ where: { id } });
        return null;
      },
    },

    createUser: {
      type: UserResponse,
      args: {
        dto: { type: CreateUserInput },
      },
      resolve: (
        _,
        { dto }: { dto: Omit<IUserParent, 'id'> },
        { prisma }: GraphQLContext,
      ) => {
        return prisma.user.create({ data: dto });
      },
    },
    changeUser: {
      type: UserResponse,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInput) },
      },
      resolve: (
        _,
        { id, dto }: { id: string; dto: Omit<IUserParent, 'id'> },
        { prisma }: GraphQLContext,
      ) => {
        return prisma.user.update({ where: { id }, data: dto });
      },
    },
    deleteUser: {
      type: GraphQLString,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }: { id: string }, { prisma }: GraphQLContext) => {
        await prisma.user.delete({ where: { id } });
        return null;
      },
    },

    subscribeTo: {
      type: GraphQLString,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _,
        { userId, authorId }: { userId: string; authorId: string },
        { prisma }: GraphQLContext,
      ) => {
        await prisma.subscribersOnAuthors.create({
          data: {
            subscriberId: userId,
            authorId,
          },
        });

        return null;
      },
    },
    unsubscribeFrom: {
      type: GraphQLString,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _,
        { userId, authorId }: { userId: string; authorId: string },
        { prisma }: GraphQLContext,
      ) => {
        await prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: userId,
              authorId,
            },
          },
        });

        return null;
      },
    },
  },
});