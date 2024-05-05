import { type FastifyReply, type FastifyRequest } from 'fastify';

import { type Route } from './route.js';
import { HttpMethod } from '../../common/http/httpMethod.js';

export class HealthRoute implements Route {
  public readonly method = HttpMethod.get;
  public readonly url = '/health';
  public readonly schema = {};

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public async handler(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    reply.send({ healthy: true });
  }
}
