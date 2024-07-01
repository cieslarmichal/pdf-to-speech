import { type Static, Type } from '@sinclair/typebox';
import { Value, TransformDecodeCheckError } from '@sinclair/typebox/value';
import config from 'config';

import { ConfigurationError } from './common/errors/configurationError.js';
import { LogLevel } from './common/logger/logLevel.js';

const configSchema = Type.Object({
  application: Type.Object({
    name: Type.String({ minLength: 1 }),
  }),
  server: Type.Object({
    host: Type.String({ minLength: 1 }),
    port: Type.Number({
      minimum: 1,
      maximum: 65535,
    }),
  }),
  logLevel: Type.Enum(LogLevel),
  elevenlabs: Type.Object({
    apiKey: Type.String({ minLength: 1 }),
  }),
});

export type Config = Static<typeof configSchema>;

export class ConfigFactory {
  public static create(): Config {
    try {
      return Value.Decode(configSchema, config);
    } catch (error) {
      if (error instanceof TransformDecodeCheckError) {
        throw new ConfigurationError({ ...error.error });
      }

      throw error;
    }
  }
}
