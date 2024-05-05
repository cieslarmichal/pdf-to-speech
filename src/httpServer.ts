import { fastifyCors } from '@fastify/cors';
import { fastifyHelmet } from '@fastify/helmet';
import { fastifyMultipart } from '@fastify/multipart';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { fastify, type FastifyInstance } from 'fastify';

import { BaseError } from './common/errors/baseError.js';
import { InputNotValidError } from './common/errors/inputNotValidError.js';
import { HttpStatusCode } from './common/http/httpStatusCode.js';
import { type Logger } from './common/logger/logger.js';
import { type Config } from './config.js';

export class HttpServer {
  private readonly fastifyServer: FastifyInstance;

  public constructor(
    private readonly logger: Logger,
    private readonly config: Config,
  ) {
    this.fastifyServer = fastify({ bodyLimit: 10 * 1024 * 1024 }).withTypeProvider<TypeBoxTypeProvider>();
  }

  public async start(): Promise<void> {
    const { host, port } = this.config.server;

    this.setupErrorHandler();

    await this.initSwagger();

    await this.fastifyServer.register(fastifyMultipart);

    await this.fastifyServer.register(fastifyHelmet);

    await this.fastifyServer.register(fastifyCors, {
      origin: '*',
      methods: '*',
      allowedHeaders: '*',
    });

    this.fastifyServer.get('/health', async (request, reply): Promise<void> => {
      reply.send({ healthy: true });
    });

    await this.fastifyServer.listen({
      port,
      host,
    });

    this.logger.info({
      message: 'HTTP Server started.',
      port,
      host,
    });
  }

  public async stop(): Promise<void> {
    await this.fastifyServer.close();

    this.logger.info({ message: 'HTTP Server stopped.' });
  }

  private setupErrorHandler(): void {
    this.fastifyServer.setErrorHandler((error, request, reply): void => {
      const formattedError = {
        name: error.name,
        message: error.message,
        ...(error instanceof BaseError ? { ...error.context } : undefined),
      };

      if (error instanceof InputNotValidError) {
        reply.status(HttpStatusCode.badRequest).send(formattedError);
      } else {
        reply.status(HttpStatusCode.internalServerError).send(formattedError);
      }

      this.logger.error({
        message: 'HTTP server error.',
        error,
        endpoint: `${request.method} ${request.url}`,
        statusCode: reply.statusCode,
      });
    });
  }

  private async initSwagger(): Promise<void> {
    await this.fastifyServer.register(fastifySwagger, {
      openapi: {
        info: {
          title: 'PDF to Speech API',
          version: '1.0.0',
        },
      },
    });

    await this.fastifyServer.register(fastifySwaggerUi, {
      routePrefix: '/api/docs',
      uiConfig: {
        defaultModelRendering: 'model',
        defaultModelsExpandDepth: 3,
        defaultModelExpandDepth: 3,
      },
      staticCSP: true,
    });
  }
}