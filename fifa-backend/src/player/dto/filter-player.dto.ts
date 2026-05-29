import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class FilterPlayerDto {
  // --- Paginación ---
  @ApiProperty({
    default: 1,
    description: 'Page number to retrieve',
    required: false,
  })
  @IsOptional()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    default: 10,
    description: 'How many items to retrieve per page',
    required: false,
  })
  @IsOptional()
  @IsPositive()
  limit?: number = 10;

  // --- Filtros ---
  @ApiProperty({
    description: 'Player Name to filter by',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Club Name to filter by',
    required: false,
  })
  @IsOptional()
  @IsString()
  club?: string;

  @ApiProperty({
    description: 'Position to filter by',
    required: false,
  })
  @IsOptional()
  @IsString()
  position?: string;
}
