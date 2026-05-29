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
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponsePlayerDto } from './dto/response-player.dto';
import { ErrorResponse } from 'src/common/decorators/error-response.decorators';
import { PaginatedPlayersDto } from './dto/paginated-player.dto';

@ApiTags('Players')
@ApiBearerAuth() // Indica que este endpoint o controller requiere token (ej. JWT)
@Controller('players')
@Auth() //cualquier acceso al controlador debe autenticarse
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new player',
    description: 'Register a player and link it to the authenticated user.',
  })
  @ApiResponse({
    status: 201,
    description: 'Player created',
    type: ResponsePlayerDto,
  })
  @ErrorResponse()
  create(@Body() createPlayerDto: CreatePlayerDto, @GetUser() user: User) {
    return this.playerService.create(createPlayerDto, user);
  }

  @Get()
  @ApiOperation({
    summary: 'Get the Player List',
    description:
      'It obtains player pagination to which search filters can be applied.',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of players retrieved successfully.',
    type: PaginatedPlayersDto,
  })
  @ErrorResponse()
  findAll(@Query() filterPlayerDto: FilterPlayerDto) {
    return this.playerService.findAll(filterPlayerDto);
  }

  @Get('download')
  @ApiOperation({
    summary: 'Download players as CSV',
    description:
      'Generates and downloads a CSV file containing the players filtered by the provided criteria.',
  })
  @ApiProduces('text/csv') // Indica que este endpoint responde estrictamente con un CSV
  @ApiOkResponse({
    description: 'The CSV file has been successfully generated and downloaded.',
    schema: {
      type: 'string',
      format: 'binary', // Esto le dice a Swagger que es un archivo descargable
    },
    headers: {
      'Content-Type': {
        schema: { type: 'string', example: 'text/csv; charset=utf-8' },
      },
      'Content-Disposition': {
        schema: {
          type: 'string',
          example: 'attachment; filename="jugadores.csv"',
        },
      },
    },
  })
  @ErrorResponse()
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
  @ApiOperation({
    summary: 'Get a Player by Id',
    description: 'It obtains player by Id.',
  })
  @ApiResponse({
    status: 200,
    description: 'Player with id retrieved successfully.',
    type: ResponsePlayerDto,
  })
  @ErrorResponse()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.playerService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a Player by Id',
    description: 'It updates a player by Id.',
  })
  @ApiResponse({
    status: 200,
    description: 'Player with id updated successfully.',
    type: ResponsePlayerDto,
  })
  @ErrorResponse()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlayerDto: UpdatePlayerDto,
    @GetUser() user: User,
  ) {
    return this.playerService.update(id, updatePlayerDto, user);
  }
}
