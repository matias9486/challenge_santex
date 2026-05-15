import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { PlayerModule } from 'src/player/player.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [PlayerModule],
})
export class SeedModule {}
