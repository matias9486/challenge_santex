import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { QueryFailedError, Repository, SelectQueryBuilder } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { ResponsePlayerDto } from './dto/response-player.dto';
import { FilterPlayerDto } from './dto/filter-player.dto';
import {
  PaginatedPlayersDto,
  PaginationMetaDto,
} from './dto/paginated-player.dto';
import { Workbook } from 'exceljs';
import { User } from 'src/auth/entities/user.entity';

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

  async create(createPlayerDto: CreatePlayerDto, user: User) {
    try {
      let player: Player = this.playerRepository.create({
        ...createPlayerDto,
        user: user,
      });
      player = await this.playerRepository.save(player);
      return plainToInstance(ResponsePlayerDto, player, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(filterDto: FilterPlayerDto) {
    const { page = 1, limit = 10 } = filterDto;
    const skip = (page - 1) * limit;

    //filtro dinamico
    const queryBuilder = this.getFilteredPlayersQuery(filterDto);

    queryBuilder.skip(skip).take(limit);

    let items: Player[] = [];
    let total: number = 0;
    try {
      [items, total] = await queryBuilder.getManyAndCount();
    } catch (error) {
      this.handleDBExceptions(error);
    }

    const mappedPlayers: ResponsePlayerDto[] = items.map((item) =>
      plainToInstance(ResponsePlayerDto, item, {
        excludeExtraneousValues: true,
      }),
    );

    const meta: PaginationMetaDto = {
      totalItems: total,
      itemCount: items.length,
      itemsPerPage: limit,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };

    return new PaginatedPlayersDto(mappedPlayers, meta);
  }

  //Método para convertir lista de jugadores a csv
  async getCsvBuffer(filterDto: FilterPlayerDto) {
    //filtro dinámico
    const queryBuilder = this.getFilteredPlayersQuery(filterDto);
    //jugadores filtrados
    let players;
    try {
      players = await queryBuilder.getMany();
    } catch (error) {
      this.handleDBExceptions(error);
    }

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Jugadores');

    // Definimos las columnas para que el CSV sea legible
    worksheet.columns = [
      { header: 'Id', key: 'id', width: 10 },

      { header: 'Jugador Id Fifa', key: 'playerId', width: 10 },
      { header: 'Version Fifa', key: 'fifaVersion', width: 10 },

      { header: 'Nacionalidad', key: 'nationalityName', width: 25 },
      { header: 'Nombre Corto', key: 'shortName', width: 15 },
      { header: 'Nombre Completo', key: 'longName', width: 35 },
      { header: 'Fecha Nacimiento', key: 'birthDate', width: 10 },

      { header: 'Pie Dominante', key: 'preferredFoot', width: 10 },
      { header: 'Imagen Url', key: 'playerFaceUrl', width: 20 },
      { header: 'Posiciones', key: 'playerPositions', width: 35 },
      { header: 'Valor Euros', key: 'valueEur', width: 20 },

      { header: 'Club', key: 'clubName', width: 25 },

      { header: 'Media', key: 'overall', width: 10 },
      { header: 'Potencial', key: 'potential', width: 15 },
      { header: 'Ritmo', key: 'pace', width: 15 },
      { header: 'Tiro', key: 'shooting', width: 15 },
      { header: 'Pase', key: 'passing', width: 15 },
      { header: 'Regate', key: 'dribbling', width: 15 },
      { header: 'Defensa', key: 'defending', width: 15 },
      { header: 'Físico', key: 'physic', width: 15 },
    ];

    // Añadimos los datos
    worksheet.addRows(players);

    // Escribimos a un buffer (formato CSV)
    const buffer = await workbook.csv.writeBuffer();
    return buffer as unknown as Buffer;
  }

  async findOne(id: number) {
    let player: Player | null = null;
    try {
      player = await this.playerRepository.findOneBy({
        id: id,
      });
    } catch (error) {
      this.handleDBExceptions(error);
    }

    if (!player) throw new NotFoundException(`Player with id ${id} not found`);

    return plainToInstance(ResponsePlayerDto, player, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: number, updatePlayerDto: UpdatePlayerDto, user: User) {
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
      player.user = user;
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
        throw new BadRequestException(
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

  //Método para generar el filtro dinámico
  private getFilteredPlayersQuery(
    filterDto: FilterPlayerDto,
  ): SelectQueryBuilder<Player> {
    const { name, club, position } = filterDto;

    const queryBuilder: SelectQueryBuilder<Player> =
      this.playerRepository.createQueryBuilder('player');

    // Filtros dinámicos
    if (name) {
      queryBuilder.andWhere('player.long_name LIKE :name', {
        name: `%${name}%`,
      });
    }

    if (club) {
      queryBuilder.andWhere('player.club_name LIKE :club', {
        club: `%${club}%`,
      });
    }

    if (position) {
      queryBuilder.andWhere('player.player_positions LIKE :pos', {
        pos: `%${position}%`,
      });
    }

    return queryBuilder;
  }
}
