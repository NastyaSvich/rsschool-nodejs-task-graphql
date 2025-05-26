import { PrismaClient } from "@prisma/client";
import { createLoader } from '../createLoader.js';

export type GraphQLContext = {
  prisma: PrismaClient;
  loader: ReturnType<typeof createLoader>;
};