import { Application } from './application.js';
import { ConfigFactory } from './config.js';

const finalErrorHandler = async (error: Error): Promise<void> => {
  console.error({
    message: 'Application error.',
    error,
  });

  if (application) {
    await application.stop();
  }

  process.exitCode = 1;
};

process.on('unhandledRejection', finalErrorHandler);

process.on('uncaughtException', finalErrorHandler);

process.on('SIGINT', finalErrorHandler);

process.on('SIGTERM', finalErrorHandler);

let application: Application | undefined;

try {
  const config = ConfigFactory.create();

  application = new Application(config);

  await application.start();
} catch (error) {
  console.error(error);

  process.exit(1);
} finally {
}
