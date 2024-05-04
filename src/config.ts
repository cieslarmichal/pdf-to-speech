import { type Static, Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import config from 'config';

import { LogLevel } from './common/logger/logLevel.js';

const configSchema = Type.Object({
  server: Type.Object({
    host: Type.String({ minLength: 1 }),
    port: Type.Number({
      minimum: 1,
      maximum: 65535,
    }),
  }),
  logLevel: Type.Enum(LogLevel),
});

export type Config = Static<typeof configSchema>;

export class ConfigFactory {
  public static create(): Config {
    return Value.Decode(configSchema, config);
  }
}
