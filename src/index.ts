import { Application } from './application.js';

const finalErrorHandler = async (error: unknown): Promise<void> => {
  console.error({
    message: 'Application error.',
    error,
  });

  await application?.stop();

  process.exitCode = 1;
};

process.on('unhandledRejection', finalErrorHandler);

process.on('uncaughtException', finalErrorHandler);

process.on('SIGINT', finalErrorHandler);

process.on('SIGTERM', finalErrorHandler);

let application: Application | undefined;

try {
  application = new Application();

  await application.start();
} catch (error) {
  await finalErrorHandler(error);
} finally {
  await application?.stop();
}
