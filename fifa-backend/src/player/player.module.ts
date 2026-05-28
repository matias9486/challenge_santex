import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [PlayerController],
  providers: [PlayerService],
  imports: [TypeOrmModule.forFeature([Player]), AuthModule],
  exports: [PlayerService], //exportado para que lo use el seedService
})
export class PlayerModule {}
