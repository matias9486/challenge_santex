import { ResponsePlayerDto } from './response-player.dto';

export class PaginationMetaDto {
  totalItems!: number;

  itemCount!: number;

  itemsPerPage!: number;

  totalPages!: number;

  currentPage!: number;
}

export class PaginatedPlayersDto {
  data: ResponsePlayerDto[];
  meta: PaginationMetaDto;

  constructor(data: ResponsePlayerDto[], meta: PaginationMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
