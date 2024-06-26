/* eslint-disable @typescript-eslint/naming-convention */

import { fastifyCors } from '@fastify/cors';
import { fastifyHelmet } from '@fastify/helmet';
import { fastifyMultipart } from '@fastify/multipart';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { type FastifyReply, fastify, type FastifyInstance } from 'fastify';
import { type FastifySchemaValidationError } from 'fastify/types/schema.js';

import { ConvertRoute } from './api/routes/convertRoute.js';
import { HealthRoute } from './api/routes/healthRoute.js';
import { HttpStatusCode } from './api/routes/http/httpStatusCode.js';
import { ConvertPdfToAudioAction } from './application/actions/convertPdfToAudioAction.js';
import { PdfParserService } from './application/services/pdfService/pdfParserService.js';
import { TextToSpeechServiceFactory } from './application/services/textToSpeechService/textToSpeechServiceFactory.js';
import { BaseError } from './common/errors/baseError.js';
import { InputNotValidError } from './common/errors/inputNotValidError.js';
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

    this.fastifyServer.addHook('onRequest', (request, _reply, done) => {
      this.logger.info({
        message: 'HTTP request received.',
        endpoint: `${request.method} ${request.url}`,
      });

      done();
    });

    this.fastifyServer.addHook('onSend', (request, reply, _payload, done) => {
      if (request.url.startsWith('/api/v1/docs')) {
        done();

        return;
      }

      this.logger.info({
        message: 'HTTP response sent.',
        endpoint: `${request.method} ${request.url}`,
        statusCode: reply.statusCode,
      });

      done();
    });

    const textToSpeechService = TextToSpeechServiceFactory.create({ apiKey: this.config.elevenlabs.apiKey });

    const pdfParserService = new PdfParserService();

    const convertPdfToAudioAction = new ConvertPdfToAudioAction(pdfParserService, textToSpeechService, this.logger);

    const routes = [new HealthRoute(), new ConvertRoute(convertPdfToAudioAction)];

    routes.forEach((route): void => {
      this.fastifyServer.route({
        method: route.method,
        url: `/api/v1${route.url}`,
        handler: route.handler.bind(route),
        schema: {
          description: route.description,
          ...route.schema,
        },
      });
    });

    await this.fastifyServer.listen({
      port,
      host,
    });

    this.logger.info({
      message: 'HTTP server started.',
      host,
      port,
    });
  }

  public async stop(): Promise<void> {
    await this.fastifyServer.close();
  }

  private setupErrorHandler(): void {
    this.fastifyServer.setSchemaErrorFormatter((errors, dataVar) => {
      const { instancePath, message } = errors[0] as FastifySchemaValidationError;

      return new InputNotValidError({
        reason: `${dataVar}${instancePath} ${message}`,
        value: undefined,
      });
    });

    this.fastifyServer.setErrorHandler((error, request, reply): FastifyReply => {
      const responseError = {
        name: error.name,
        message: error.message,
        ...(error instanceof BaseError ? { ...error.context } : undefined),
      };

      if (error instanceof InputNotValidError) {
        reply.status(HttpStatusCode.badRequest);
      } else {
        reply.status(HttpStatusCode.internalServerError);
      }

      const debugError = {
        ...responseError,
        stack: error.stack,
        cause: error.cause,
      };

      this.logger.error({
        message: 'HTTP server error.',
        error: debugError,
        endpoint: `${request.method} ${request.url}`,
        statusCode: reply.statusCode,
      });

      return reply.send(responseError);
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
      routePrefix: '/api/v1/docs',
      uiConfig: {
        defaultModelRendering: 'model',
        defaultModelsExpandDepth: 3,
        defaultModelExpandDepth: 3,
      },
      staticCSP: true,
    });
  }
}
