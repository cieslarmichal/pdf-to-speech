import { Application } from './application.js';
import { ConfigFactory } from './config.js';

let application: Application | undefined;

try {
  const config = ConfigFactory.create();

  application = new Application(config);

  await application.start();
} catch (error) {
  console.error(error);

  process.exit(1);
}
