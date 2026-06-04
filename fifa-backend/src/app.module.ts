import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerModule } from './player/player.module';
import { SeedModule } from './seed/seed.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASENAME'),
        autoLoadEntities: true, //Permite que cada entidad que definas en tus módulos (ej. users.entity.ts) se registre automáticamente sin tener que listarlas manualmente aquí
        synchronize: true,
        dropSchema: false,
      }),
    }),
    PlayerModule,
    SeedModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
