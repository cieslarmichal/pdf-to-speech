import { StatusCodes } from 'http-status-codes';

export enum HttpStatusCode {
  ok = StatusCodes.OK,
  badRequest = StatusCodes.BAD_REQUEST,
  unprocessableEntity = StatusCodes.UNPROCESSABLE_ENTITY,
  internalServerError = StatusCodes.INTERNAL_SERVER_ERROR,
}
