import { type Logger } from './common/logger/logger.js';
import { LoggerFactory } from './common/logger/loggerFactory.js';
import { ConfigFactory } from './config.js';
import { HttpServer } from './httpServer.js';

export class Application {
  private logger: Logger | undefined;
  private httpServer: HttpServer | undefined;

  public async start(): Promise<void> {
    const config = ConfigFactory.create();

    this.logger = LoggerFactory.create({ logLevel: config.logLevel });

    this.httpServer = new HttpServer(this.logger, config);

    this.logger.info({ message: 'Application started.' });
  }

  public async stop(): Promise<void> {
    await this.httpServer?.stop();

    this.logger?.info({ message: 'Application stopped.' });
  }
}
