import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, schema } from "./schemas.js";
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { createLoader } from './createLoader.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
        404: Type.Null(),
      },
    },

    async handler(req) {
      const document = parse(req.body.query);

      const validationErrors = validate(schema, document, [depthLimit(5)]);

      if (validationErrors.length > 0) {
        return {
          errors: validationErrors,
        };
      }

      return graphql({
        schema,
        source: req.body.query,
        variableValues: req.body.variables,
        contextValue: {
          prisma,
          loader: createLoader(prisma)
        }
      });
    },
  });
};

export default plugin;
