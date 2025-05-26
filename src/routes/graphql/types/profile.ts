import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberTypeIdEnumTS, MemberType, MemberTypeIdEnum } from './memberType.js';
import { GraphQLContext } from './graphQLContext.js';

export const Profile = new GraphQLObjectType({
  name: 'Profile',
  fields: {
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeIdEnum) },
    memberType: {
      type: MemberType,
      resolve: (parent: IProfile, _, { prisma }: GraphQLContext) => {
       return prisma.memberType.findUnique({ where: { id: parent.memberTypeId } });
      },
    }
  },
});

export interface IProfile {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  userId: string;
  memberTypeId: MemberTypeIdEnumTS;
}