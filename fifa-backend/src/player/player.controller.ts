import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Query,
  Res,
} from '@nestjs/common';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { FilterPlayerDto } from './dto/filter-player.dto';
import * as express from 'express';
import { Auth } from 'src/auth/decorators';

@Controller('players')
@Auth() //cualquier acceso al controlador debe autenticarse
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playerService.create(createPlayerDto);
  }

  @Get()
  findAll(@Query() filterPlayerDto: FilterPlayerDto) {
    return this.playerService.findAll(filterPlayerDto);
  }

  @Get('download')
  async download(
    @Query() filterDto: FilterPlayerDto,
    @Res() res: express.Response,
  ) {
    //Generamos el buffer
    const buffer = await this.playerService.getCsvBuffer(filterDto);

    // Crea el prefijo BOM para UTF-8
    const bom = Buffer.from('\uFEFF');
    const finalBuffer = Buffer.concat([bom, buffer]);

    // 3. Configuramos cabeceras para descarga de archivo
    res.set({
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="jugadores.csv"',
      'Content-Length': finalBuffer.length,
    });

    // 4. Enviamos el buffer y cerramos la respuesta
    res.status(200).send(finalBuffer);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.playerService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ) {
    return this.playerService.update(id, updatePlayerDto);
  }
}
