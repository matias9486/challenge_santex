import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';

export const GetUser = createParamDecorator(
  //data, como es personalizado, yo defino el tipo. Podria ser de otro tipo como un array
  (data: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<{ user: User }>();
    const user = request.user;
    if (!user) throw new InternalServerErrorException('User not found');

    //usa propiedad computada para devolver el atributo indicado con data.
    return !data ? user : user[data as keyof User];
  },
);
