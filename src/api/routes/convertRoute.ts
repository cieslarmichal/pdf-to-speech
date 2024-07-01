import { Type } from '@sinclair/typebox';
import { type FastifyReply, type FastifyRequest } from 'fastify';
import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream';
import { promisify } from 'node:util';
import { v4 as uuid4 } from 'uuid';

import { HttpMethod } from './http/httpMethod.js';
import { type HttpRouteSchema } from './http/httpRouteSchema.js';
import { HttpStatusCode } from './http/httpStatusCode.js';
import { type Route } from './route.js';
import { type ConvertPdfToAudioAction } from '../../application/actions/convertPdfToAudioAction.js';

const streamPipeline = promisify(pipeline);

export class ConvertRoute implements Route {
  public readonly description = 'Converts a pdf file to audio format';
  public readonly method = HttpMethod.post;
  public readonly url = '/convert';
  public readonly schema: HttpRouteSchema = {
    response: {
      [HttpStatusCode.ok]: {
        description: 'Converted file successfully',
        ...Type.Object({}),
      },
      [HttpStatusCode.badRequest]: {
        description: 'Invalid file',
        ...Type.Object({
          error: Type.String(),
        }),
      },
    },
  };

  public constructor(private readonly convertPdfToAudioAction: ConvertPdfToAudioAction) {}

  public async handler(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    if (!request.isMultipart()) {
      return reply.code(HttpStatusCode.badRequest).send({ error: 'Request is not multipart.' });
    }

    const multipartFile = await request.file();

    if (!multipartFile) {
      return reply.code(HttpStatusCode.badRequest).send({ error: 'No file uploaded.' });
    }

    if (multipartFile.mimetype !== 'application/pdf') {
      return reply.code(HttpStatusCode.badRequest).send({ error: 'Invalid file type.' });
    }

    if (!multipartFile.filename.endsWith('.pdf')) {
      return reply.code(HttpStatusCode.badRequest).send({ error: 'Invalid file extension.' });
    }

    const filePath = `/tmp/${uuid4()}`;

    await streamPipeline(multipartFile.file, createWriteStream(filePath));

    const { audio } = await this.convertPdfToAudioAction.execute({ pdfPath: filePath });

    reply.code(HttpStatusCode.ok);

    return reply.send(audio);
  }
}
