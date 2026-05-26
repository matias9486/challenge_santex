import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    select: false,
  })
  password!: string;

  @Column({
    name: 'full_name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  fullName!: string;

  @Column({
    name: 'is_active',
    type: 'bool',
    nullable: false,
    default: true,
  })
  isActived!: boolean;

  @Column({
    type: 'simple-array',
    nullable: false,
  })
  roles: string[] = ['user'];
}
