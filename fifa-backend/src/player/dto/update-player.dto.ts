//import { OmitType, PartialType } from '@nestjs/mapped-types';

import { ApiSchema, OmitType, PartialType } from '@nestjs/swagger'; //Para documentar DTO que extienden de Partial o usan OmitType, debo importar desde swagger
import { CreatePlayerDto } from './create-player.dto';

@ApiSchema({ name: 'UpdatePlayerRequest' })
export class UpdatePlayerDto extends PartialType(
  // OmitType: Toma el CreatePlayerDto original y remueve por completo las propiedades especificadas.
  // Esto previene que dichos campos sean procesados dentro de la envoltura de PartialType.
  OmitType(CreatePlayerDto, ['fifaVersion', 'playerId'] as const),
) {
  // fifaVersion y playerId, no quiero modificarlo por eso lo omití y no agregué como obligatorio acá
  // 2. Redefinición manual: Al declarar una propiedad fuera del PartialType, no se convertirá en opcional.
  // Podemos exigir explícitamente de nuevo sus validaciones estrictas para las peticiones de actualización.
  /*
  @IsNumber()
  @Min(15)
  fifaVersion!: number;
  */
}
