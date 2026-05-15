import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreatePlayerDto {
  @IsNumber()
  @Min(15)
  fifaVersion!: number;

  @IsNumber()
  @Min(1)
  playerId!: number;

  @IsString()
  @IsNotEmpty()
  shortName!: string;

  @IsString()
  @IsNotEmpty()
  longName!: string;

  @IsDateString()
  birthDate!: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['Left', 'Right', 'Both'])
  preferredFoot!: string;

  //@IsUrl()
  @IsString()
  @IsNotEmpty()
  playerFaceUrl!: string;

  @IsString()
  @IsIn([
    'GK',
    'CB',
    'LB',
    'RB',
    'LWB',
    'RWB',
    'CDM',
    'CM',
    'CAM',
    'LM',
    'RM',
    'ST',
    'CF',
    'LW',
    'RW',
  ])
  playerPositions!: string;

  @IsNumber()
  @Min(0)
  valueEur?: number;

  @IsNumber()
  @Min(1)
  @Max(99)
  overall!: number;

  @IsNumber()
  @Min(1)
  @Max(99)
  potential!: number;

  @IsNumber()
  @Min(1)
  @Max(99)
  pace!: number;

  @IsNumber()
  @Min(1)
  @Max(99)
  shooting!: number;

  @IsNumber()
  @Min(1)
  @Max(99)
  passing!: number;

  @IsNumber()
  @Min(1)
  @Max(99)
  dribbling!: number;

  @IsNumber()
  @Min(1)
  @Max(99)
  defending!: number;

  @IsNumber()
  @Min(1)
  @Max(99)
  physic!: number;

  @IsString()
  @IsNotEmpty()
  clubName!: string;

  @IsString()
  @IsNotEmpty()
  nationalityName!: string;
}
