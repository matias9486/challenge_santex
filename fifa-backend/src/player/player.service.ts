import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { QueryFailedError, Repository } from 'typeorm';

@Injectable()
export class PlayerService {
  private readonly logger = new Logger('PlayerService');
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  async createMany(batch: Partial<Player>[]) {
    try {
      // .insert() es ideal para seeds porque no necesita recuperar
      // la entidad de la DB antes de guardar (performance pura).
      return await this.playerRepository.insert(batch);
    } catch (error) {
      // Es buena práctica capturar errores de integridad (duplicados, etc.)
      console.error('Error en inserción masiva:', error.message);
      throw new InternalServerErrorException(
        'Error en inserción masiva:',
        error.message,
      );
    }
  }

  async create(createPlayerDto: CreatePlayerDto) {
    try {
      const player = this.playerRepository.create(createPlayerDto);
      await this.playerRepository.save(player);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll() {
    return `This action returns all player`;
  }

  findOne(id: number) {
    return `This action returns a #${id} player`;
  }

  update(id: number, updatePlayerDto: UpdatePlayerDto) {
    return `This action updates a #${id} player`;
  }

  remove(id: number) {
    return `This action removes a #${id} player`;
  }

  private handleDBExceptions(error: any) {
    this.logger.error(error); //uso de logs
    // Validamos si es un error lanzado directamente por la base de datos
    if (error instanceof QueryFailedError) {
      const dbError = error.driverError;

      // 1. Error de llave duplicada (Si añades índices únicos) (1062)
      if (dbError.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          'The player already exists for this version of FIFA.',
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
    throw new InternalServerErrorException(
      'Unexpected error saving player. Check the logs.',
    );
  }
}
