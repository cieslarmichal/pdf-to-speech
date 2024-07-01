import { type FastifyRequest, type FastifyReply } from 'fastify';

import { type HttpMethod } from '../../common/http/httpMethod.js';
import { type HttpRouteSchema } from '../../common/http/httpRouteSchema.js';

export interface Route {
  readonly description: string;
  readonly method: HttpMethod;
  readonly url: string;
  readonly schema: HttpRouteSchema;

  handler(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
}
