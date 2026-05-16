import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { ResponsePlayerDto } from './dto/response-player.dto';

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
      let player: Player = this.playerRepository.create(createPlayerDto);
      player = await this.playerRepository.save(player);
      return plainToInstance(ResponsePlayerDto, player, {
        excludeExtraneousValues: true,
      });
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

  async update(id: number, updatePlayerDto: UpdatePlayerDto) {
    // Verificamos si el objeto tiene llaves. Al ser opcionales podria enviar nada
    //omito los lanzamientos de excepciones del try para que no sean capturadas por el bloque de bd
    if (Object.keys(updatePlayerDto).length === 0) {
      throw new BadRequestException(
        'You must provide at least one field to update',
      );
    }

    let player: Player | undefined;

    try {
      player = await this.playerRepository.preload({
        id: id,
        ...updatePlayerDto,
      });
    } catch (error) {
      this.handleDBExceptions(error);
    }

    if (!player) throw new NotFoundException(`Player with id ${id} not found`);

    try {
      player = await this.playerRepository.save(player);
      // Mapea automáticamente la entidad al DTO de respuesta de forma masiva
      return plainToInstance(ResponsePlayerDto, player, {
        excludeExtraneousValues: true,
      });
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
    throw new InternalServerErrorException('Unexpected error. Check the logs.');
  }
}
