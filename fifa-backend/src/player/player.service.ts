import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlayerService {
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
      // Es buena prÃ¡ctica capturar errores de integridad (duplicados, etc.)
      console.error('Error en inserciÃ³n masiva:', error.message);
      throw new InternalServerErrorException(
        'Error en inserciÃ³n masiva:',
        error.message,
      );
    }
  }

  create(createPlayerDto: CreatePlayerDto) {
    return 'This action adds a new player';
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
}
