import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any) {
    this.logger.error(error); //uso de logs
    // Validamos si es un error lanzado directamente por la base de datos
    if (error instanceof QueryFailedError) {
      const dbError = error.driverError;

      // 1. Error de llave duplicada (Si añades índices únicos) (1062)
      if (dbError.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException(
          'Email is already registered',
        );
      }

      // 2. Error de dato demasiado largo (Truncation) (1406)
      if (dbError.code === 'ER_DATA_TOO_LONG') {
        throw new BadRequestException(
          'One of the fields exceeds the allowed character limit.',
        );
      }

      // 3. Error de valores nulos obligatorios (1048)
      if (dbError.code === 'ER_BAD_NULL_ERROR') {
        throw new BadRequestException(
          'Mandatory fields required by the database are missing.',
        );
      }

      // 4. Formato de fecha o datos incorrectos (1292)
      if (dbError.code === 'ER_TRUNCATED_WRONG_VALUE') {
        throw new BadRequestException(
          'Incorrect data format (check the dates or numbers).',
        );
      }
    }

    // Si es un error desconocido, lanzamos un 500 estándar
    throw new InternalServerErrorException('Unexpected error. Check the logs.');
  }
}
