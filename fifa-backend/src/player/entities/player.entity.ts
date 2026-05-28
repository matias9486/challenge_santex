import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id!: number;

  // FIFA_DATA
  @Column({ name: 'fifa_version', type: 'int', nullable: false })
  fifaVersion!: number;

  @Column({ name: 'player_id', type: 'int', nullable: false })
  playerId!: number;

  // PLAYER_DATA
  @Column({
    name: 'short_name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  shortName!: string;

  @Column({
    name: 'long_name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  longName!: string;

  @Column({ name: 'birth_date', type: 'date' })
  birthDate!: Date; //dob, nombre original

  @Column({
    name: 'preferred_foot',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  preferredFoot!: string;

  @Column({
    name: 'player_face_url',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  playerFaceUrl!: string;

  @Column({ name: 'player_positions', type: 'varchar' })
  playerPositions!: string;

  @Column({ name: 'value_eur', type: 'float', nullable: false })
  valueEur?: number;

  // SKILL_DATA
  @Column({ type: 'int', nullable: false })
  overall!: number;

  @Column({ type: 'int', nullable: false })
  potential!: number;

  @Column({ type: 'int', nullable: false })
  pace!: number;

  @Column({ type: 'int', nullable: false })
  shooting!: number;

  @Column({ type: 'int', nullable: false })
  passing!: number;

  @Column({ type: 'int', nullable: false })
  dribbling!: number;

  @Column({ type: 'int', nullable: false })
  defending!: number;

  @Column({ type: 'int', nullable: false })
  physic!: number;

  // TEAM_DATA
  @Column({
    name: 'club_name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  clubName!: string;

  @Column({
    name: 'nationality_name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  nationalityName!: string;

  //Relaciones
  @ManyToOne(() => User, (user) => user.player, { eager: true })
  user!: User;
}
