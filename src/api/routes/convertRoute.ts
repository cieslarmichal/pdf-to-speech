import { type FastifyReply, type FastifyRequest } from 'fastify';
import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream';
import { promisify } from 'node:util';
import { v4 as uuid4 } from 'uuid';

import { type Route } from './route.js';
import { HttpMethod } from '../../common/http/httpMethod.js';
import { HttpStatusCode } from '../../common/http/httpStatusCode.js';
import { type Logger } from '../../common/logger/logger.js';

const streamPipeline = promisify(pipeline);

export class ConvertRoute implements Route {
  public readonly method = HttpMethod.post;
  public readonly url = '/convert';
  public readonly schema = {};

  public constructor(private readonly logger: Logger) {}

  public async handler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    if (!request.isMultipart()) {
      reply.code(HttpStatusCode.badRequest).send({ error: 'Request is not multipart.' });

      return;
    }

    const multipartFile = await request.file();

    if (!multipartFile) {
      reply.code(HttpStatusCode.badRequest).send({ error: 'No file uploaded.' });

      return;
    }

    const filePath = `/tmp/${uuid4}`;

    await streamPipeline(multipartFile.file, createWriteStream(filePath));

    reply.send({ filePath });
  }
}
