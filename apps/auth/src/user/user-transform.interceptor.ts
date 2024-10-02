import { UserEntity } from '@app/common';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformUserInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(({ password, createdAt, role, ...user }: User): UserEntity => {
        return { ...user };
      }),
    );
  }
}
