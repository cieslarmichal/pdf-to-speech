import { LoggerFactory } from './common/logger/loggerFactory.js';
import { type Config } from './config.js';

export class Application {
  public constructor(private readonly config: Config) {}

  public async start(): Promise<void> {
    const logger = LoggerFactory.create({ logLevel: this.config.logLevel });

    logger.info({ message: 'Starting application...' });
  }
}
