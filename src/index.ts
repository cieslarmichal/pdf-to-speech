import { Application } from './application.js';
import { BaseError } from './common/errors/baseError.js';

const finalCleanup = async (): Promise<void> => {
  await application?.stop();

  process.exitCode = 1;
};

const finalErrorHandler = async (error: unknown): Promise<void> => {
  let formattedError = error;

  if (error instanceof Error) {
    formattedError = {
      name: error.name,
      message: error.message,
      ...(error instanceof BaseError ? { ...error.context } : undefined),
    };
  }

  console.error({
    message: 'Application error.',
    error: formattedError,
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
