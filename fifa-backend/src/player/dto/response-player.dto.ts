import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

@ApiSchema({ name: 'PlayerResponse' })
export class ResponsePlayerDto {
  @ApiProperty({
    example: 1,
    description: 'Player ID',
    uniqueItems: true,
  })
  @Expose()
  id!: number;

  @ApiProperty({
    example: 15,
    description: 'Fifa Version',
  })
  @Expose()
  fifaVersion!: number;

  @ApiProperty({
    example: 158023,
    description: 'Fifa Player ID. Same Fifa Player ID for different versions',
  })
  @Expose()
  playerId!: number;

  @ApiProperty({
    example: 'L. Messi',
    description: 'Player Short Name',
  })
  @Expose()
  shortName!: string;

  @ApiProperty({
    example: 'Lionel Andrés Messi Cuccittini',
    description: 'Player Long Name',
  })
  @Expose()
  longName!: string;

  @ApiProperty({
    example: '1987-06-23',
    description: 'Player Birth Date',
  })
  @Expose()
  birthDate!: string;

  @ApiProperty({
    example: 'Left',
    description: 'Player Preffered Foot',
  })
  @Expose()
  preferredFoot!: string;

  @ApiProperty({
    example: 'https://cdn.sofifa.net/players/158/023/15_120.png',
    description: 'Player Image Url',
  })
  @Expose()
  playerFaceUrl!: string;

  @ApiProperty({
    example: 'CF',
    description: 'Player Position',
  })
  @Expose()
  playerPositions!: string;

  @ApiProperty({
    example: 100500000,
    description: 'Player Value in Euros',
  })
  @Expose()
  valueEur?: number;

  @ApiProperty({
    example: 93,
    description: 'Player Overall Rating',
  })
  @Expose()
  overall!: number;

  @ApiProperty({
    example: 95,
    description: 'Player Potential Rating',
  })
  @Expose()
  potential!: number;

  @ApiProperty({
    example: 93,
    description: 'Player Pace Rating',
  })
  @Expose()
  pace!: number;

  @ApiProperty({
    example: 89,
    description: 'Player Shooting Rating',
  })
  @Expose()
  shooting!: number;

  @ApiProperty({
    example: 86,
    description: 'Player Passing Rating',
  })
  @Expose()
  passing!: number;

  @ApiProperty({
    example: 96,
    description: 'Player Dribbling Rating',
  })
  @Expose()
  dribbling!: number;

  @ApiProperty({
    example: 27,
    description: 'Player Defending Rating',
  })
  @Expose()
  defending!: number;

  @ApiProperty({
    example: 63,
    description: 'Player Physic Rating',
  })
  @Expose()
  physic!: number;

  @ApiProperty({
    example: 'FC Barcelona',
    description: 'Player Club Name',
  })
  @Expose()
  clubName!: string;

  @ApiProperty({
    example: 'Argentina',
    description: 'Player Nationality Name',
  })
  @Expose()
  nationalityName!: string;
}
