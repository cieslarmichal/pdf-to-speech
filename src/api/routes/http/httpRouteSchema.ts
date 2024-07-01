import { type HttpStatusCode } from './httpStatusCode.js';

export interface HttpRouteSchema {
  readonly response: {
    [code in HttpStatusCode]?: {
      readonly description: string;
      readonly [schemaKey: string]: unknown;
    };
  };
}
