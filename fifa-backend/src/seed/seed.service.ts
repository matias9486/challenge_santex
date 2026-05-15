import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { Player } from 'src/player/entities/player.entity';
import { PlayerService } from 'src/player/player.service';

@Injectable()
export class SeedService {
  constructor(private readonly playerService: PlayerService) {}

  async executeSeed() {
    const csv = require('csv-parser');
    const fs = require('fs');

    const BATCH_SIZE = 1000;
    let batch: Partial<Player>[] = [];
    const filePath = join(
      process.cwd(),
      'src',
      'seed',
      'data',
      'male_players.csv',
    );

    const stream = fs.createReadStream(filePath).pipe(csv());

    return new Promise((resolve, reject) => {
      stream.on('data', async (row) => {
        batch.push(this.mapCsvToDto(row));

        if (batch.length >= BATCH_SIZE) {
          stream.pause(); // Pausamos la lectura del archivo

          const toInsert = [...batch];
          batch = []; // Limpiamos el lote actual inmediatamente

          try {
            await this.playerService.createMany(toInsert);
            console.log(`Insertados ${toInsert.length} registros...`);
            stream.resume(); // Reanudamos la lectura cuando la DB termine
          } catch (err) {
            stream.destroy(); // Frenamos todo si hay error de DB
            reject(err);
          }
        }
      });

      stream.on('end', async () => {
        // Insertamos el remanente (lo que no llegÃ³ a 1000)
        if (batch.length > 0) {
          await this.playerService.createMany(batch);
        }
        resolve({ message: 'Seed finalizado con Ã©xito' });
      });

      stream.on('error', (err) => reject(err));
    });
  }

  private mapCsvToDto(row: any): Partial<Player> {
    // 1. Clonamos todas las propiedades que coinciden (short_name, age, etc.)
    const player: Partial<Player> = Object.assign({}, row);

    // 2. Convertimos las fechas (ya vienen en yyyy-mm-dd, asÃ­ que el constructor de Date las toma directo)    
    if (row.dob) player.birthDate = new Date(row.dob);

    //Admitiremos solo una posiciÃ³n por lo que tomaremos la primera del array
    player.playerPositions = row.player_positions?.split(',')[0] ?? 'N/A';

    // 4. Aseguramos que los nÃºmeros sean Numbers y no Strings
    player.playerId = Number(row.player_id);

    player.shortName = row.short_name;
    player.longName = row.long_name;

    player.preferredFoot = row.preferred_foot;
    player.playerFaceUrl = row.player_face_url;

    player.valueEur = Number(row.value_eur ?? 0);
    player.overall = Number(row.overall ?? 0);
    player.potential = Number(row.potential ?? 0);
    player.pace = Number(row.pace ?? 0);
    player.shooting = Number(row.shooting ?? 0);
    player.passing = Number(row.passing ?? 0);
    player.dribbling = Number(row.dribbling ?? 0);
    player.defending = Number(row.defending ?? 0);
    player.physic = Number(row.physic ?? 0);

    player.fifaVersion = Number(row.fifa_version ?? 0);

    player.clubName = row.club_name ?? 'Unknown';
    player.nationalityName = row.nationality_name ?? 'Unknown';
    return player;
  }
}
