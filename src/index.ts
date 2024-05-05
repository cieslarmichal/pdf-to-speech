import { Application } from './application.js';

const finalCleanup = async (): Promise<void> => {
  await application?.stop();

  process.exitCode = 1;
};

const finalErrorHandler = async (error: unknown): Promise<void> => {
  console.error({
    message: 'Application error.',
    error,
  });

  await finalCleanup();
};

process.on('unhandledRejection', finalErrorHandler);

process.on('uncaughtException', finalErrorHandler);

process.on('SIGINT', finalCleanup);

process.on('SIGTERM', finalCleanup);

let application: Application | undefined;

try {
  application = new Application();

  await application.start();
} catch (error) {
  await finalErrorHandler(error);
}
