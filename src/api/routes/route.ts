import { type FastifyRequest, type FastifyReply, type FastifySchema } from 'fastify';

import { type HttpMethod } from '../../common/http/httpMethod.js';

export interface Route {
  readonly method: HttpMethod;
  readonly url: string;
  readonly schema: FastifySchema;

  handler(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}
