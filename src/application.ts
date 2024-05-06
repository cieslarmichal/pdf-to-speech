import { LoggerFactory } from './common/logger/loggerFactory.js';
import { ConfigFactory } from './config.js';
import { HttpServer } from './httpServer.js';

export class Application {
  private httpServer: HttpServer;

  public constructor() {
    const config = ConfigFactory.create();

    const logger = LoggerFactory.create({
      logLevel: config.logLevel,
      applicationName: config.application.name,
    });

    this.httpServer = new HttpServer(logger, config);
  }

  public async start(): Promise<void> {
    await this.httpServer.start();
  }

  public async stop(): Promise<void> {
    await this.httpServer?.stop();
  }
}
