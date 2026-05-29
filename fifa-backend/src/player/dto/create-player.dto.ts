import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { PreferredFoot } from '../enums/preffered-foot.enum';
import { PlayerPositions } from '../enums/player-positions.enum';

@ApiSchema({ name: 'CreatePlayerRequest' })
export class CreatePlayerDto {
  @ApiProperty({
    example: 15,
    description: 'Fifa Version',
    minimum: 15,
    type: 'number',
  })
  @IsNumber()
  @Min(15)
  fifaVersion!: number;

  @ApiProperty({
    example: 158023,
    description: 'Fifa Player ID. Same Fifa Player ID for different versions',
    minimum: 1,
    type: 'number',
  })
  @IsNumber()
  @Min(1)
  playerId!: number;

  @ApiProperty({
    example: 'L. Messi',
    description: 'Player Short Name',
    minLength: 1,
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  shortName!: string;

  @ApiProperty({
    example: 'Lionel Andrés Messi Cuccittini',
    description: 'Player Long Name',
    minLength: 1,
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  longName!: string;

  @ApiProperty({
    example: '1987-06-23',
    description: 'Player Birth Date',
    minLength: 10,
    type: 'string',
  })
  @IsDateString()
  birthDate!: string;

  @ApiProperty({
    description: 'Player Preffered Foot',
    enum: PreferredFoot,
    example: PreferredFoot.LEFT,
  })
  @IsNotEmpty()
  @IsEnum(PreferredFoot)
  preferredFoot!: PreferredFoot;

  @ApiProperty({
    example: 'https://cdn.sofifa.net/players/158/023/15_120.png',
    description: 'Player Image Url',
    minLength: 1,
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  playerFaceUrl!: string;

  @ApiProperty({
    description: 'The tactical position of the player',
    enum: PlayerPositions,
    example: PlayerPositions.CF,
  })
  @IsNotEmpty()
  @IsEnum(PlayerPositions)
  playerPositions!: PlayerPositions;

  @ApiProperty({
    example: 100500000,
    description: 'Player Value in Euros',
    minimum: 0,
    type: 'number',
  })
  @IsNumber()
  @Min(0)
  valueEur?: number;

  @ApiProperty({
    example: 93,
    description: 'Player Overall Rating',
    minimum: 1,
    maximum: 99,
    type: 'number',
  })
  @IsNumber()
  @Min(1)
  @Max(99)
  overall!: number;

  @ApiProperty({
    example: 95,
    description: 'Player Potential Rating',
    minimum: 1,
    maximum: 99,
    type: 'number',
  })
  @IsNumber()
  @Min(1)
  @Max(99)
  potential!: number;

  @ApiProperty({
    example: 93,
    description: 'Player Pace Rating',
    minimum: 1,
    maximum: 99,
    type: 'number',
  })
  @IsNumber()
  @Min(1)
  @Max(99)
  pace!: number;

  @ApiProperty({
    example: 89,
    description: 'Player Shooting Rating',
    minimum: 1,
    maximum: 99,
    type: 'number',
  })
  @IsNumber()
  @Min(1)
  @Max(99)
  shooting!: number;

  @ApiProperty({
    example: 86,
    description: 'Player Passing Rating',
    minimum: 1,
    maximum: 99,
    type: 'number',
  })
  @IsNumber()
  @Min(1)
  @Max(99)
  passing!: number;

  @ApiProperty({
    example: 96,
    description: 'Player Dribbling Rating',
    minimum: 1,
    maximum: 99,
    type: 'number',
  })
  @IsNumber()
  @Min(1)
  @Max(99)
  dribbling!: number;

  @ApiProperty({
    example: 27,
    description: 'Player Defending Rating',
    minimum: 1,
    maximum: 99,
    type: 'number',
  })
  @IsNumber()
  @Min(1)
  @Max(99)
  defending!: number;

  @ApiProperty({
    example: 63,
    description: 'Player Physic Rating',
    minimum: 1,
    maximum: 99,
    type: 'number',
  })
  @IsNumber()
  @Min(1)
  @Max(99)
  physic!: number;

  @ApiProperty({
    example: 'FC Barcelona',
    description: 'Player Club Name',
    minLength: 1,
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  clubName!: string;

  @ApiProperty({
    example: 'Argentina',
    description: 'Player Nationality Name',
    minLength: 1,
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  nationalityName!: string;
}
