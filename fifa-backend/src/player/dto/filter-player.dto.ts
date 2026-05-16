import { IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class FilterPlayerDto {
  // --- Paginación ---
  @IsOptional()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsPositive()
  limit?: number = 10;

  // --- Filtros ---
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  club?: string;

  @IsOptional()
  @IsString()
  position?: string;
}
