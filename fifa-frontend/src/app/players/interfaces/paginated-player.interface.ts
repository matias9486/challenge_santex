import { Player } from "./player.interface";

export interface PaginationMeta {
  totalItems: number;

  itemCount: number;

  itemsPerPage: number;

  totalPages: number;

  currentPage: number;
}

export interface PaginatedPlayers {
  data: Player[];
  meta: PaginationMeta;
}