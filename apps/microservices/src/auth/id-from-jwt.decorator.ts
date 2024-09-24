import { createParamDecorator, Logger } from '@nestjs/common';

export const IdFromJwt = createParamDecorator((_data, req) => {
  return req.user as string;
});
