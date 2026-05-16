import { Expose } from 'class-transformer';

export class ResponsePlayerDto {
  @Expose()
  id!: number;

  @Expose()
  fifaVersion!: number;

  @Expose()
  playerId!: number;

  @Expose()
  shortName!: string;

  @Expose()
  longName!: string;

  @Expose()
  birthDate!: string;

  @Expose()
  preferredFoot!: string;

  @Expose()
  playerFaceUrl!: string;

  @Expose()
  playerPositions!: string;

  @Expose()
  valueEur?: number;

  @Expose()
  overall!: number;

  @Expose()
  potential!: number;

  @Expose()
  pace!: number;

  @Expose()
  shooting!: number;

  @Expose()
  passing!: number;

  @Expose()
  dribbling!: number;

  @Expose()
  defending!: number;

  @Expose()
  physic!: number;

  @Expose()
  clubName!: string;

  @Expose()
  nationalityName!: string;
}
