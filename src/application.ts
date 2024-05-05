import { type Logger } from './common/logger/logger.js';
import { LoggerFactory } from './common/logger/loggerFactory.js';
import { type Config, ConfigFactory } from './config.js';

export class Application {
  private config: Config | undefined;
  private logger: Logger | undefined;

  public async start(): Promise<void> {
    this.config = ConfigFactory.create();

    this.logger = LoggerFactory.create({ logLevel: this.config.logLevel });

    this.logger.info({ message: 'Application started.' });
  }

  public async stop(): Promise<void> {
    this.logger?.info({ message: 'Application stopped.' });
  }
}
