import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { ResponsePlayerDto } from './response-player.dto';

@ApiSchema({ name: 'PaginationMeta' })
export class PaginationMetaDto {
  @ApiProperty({
    type: Number,
    description: 'The total number of items available across all pages',
    example: 1,
  })
  totalItems!: number;

  @ApiProperty({
    type: Number,
    description: 'The number of items in the current page response',
    example: 1,
  })
  itemCount!: number;

  @ApiProperty({
    type: Number,
    description: 'The maximum number of items requested per page',
    example: 10,
  })
  itemsPerPage!: number;

  @ApiProperty({
    type: Number,
    description: 'The total amount of pages based on totalItems and itemsPerPage',
    example: 1,
  })
  totalPages!: number;

  @ApiProperty({
    type: Number,
    description: 'The current active page number',
    example: 1,
  })
  currentPage!: number;
}

@ApiSchema({ name: 'PaginatedPlayers' })
export class PaginatedPlayersDto {
  @ApiProperty({
    type: [ResponsePlayerDto], // Especifica el DTO dentro de un arreglo
    description: 'The list of players corresponding to the requested page',
  })
  data: ResponsePlayerDto[];

  @ApiProperty({
    type: PaginationMetaDto, // Referencia al DTO de los metadatos
    description: 'Pagination metadata details',
  })
  meta: PaginationMetaDto;

  constructor(data: ResponsePlayerDto[], meta: PaginationMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
