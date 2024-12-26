import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCodes } from './error-codes.enum';

export type DataException = {
  field: string;
  value: unknown;
};
const ErrorStatusMap: { [key in ErrorCodes]: number } = {
  [ErrorCodes.BAD_REQUEST_INPUT]: HttpStatus.BAD_REQUEST,
  [ErrorCodes.UNAUTHORIZED]: HttpStatus.UNAUTHORIZED,
  [ErrorCodes.FORBIDDEN]: HttpStatus.FORBIDDEN,
  [ErrorCodes.NOT_FOUND]: HttpStatus.NOT_FOUND,
  [ErrorCodes.CONFLICT]: HttpStatus.CONFLICT,
  [ErrorCodes.SERVER_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
};
export class CustomException extends HttpException {
  constructor(
    public errorCode: ErrorCodes = ErrorCodes.SERVER_ERROR,
    public devMessage: string = 'Server error',
    public data: DataException | {} = {},
  ) {
    super(
      {
        errorCode,
        devMessage,
        data,
      },
      ErrorStatusMap[errorCode] || ErrorStatusMap[ErrorCodes.SERVER_ERROR],
    );
  }
}
