import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorResponse } from 'src/common/decorators/error-response.decorators';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @ApiOperation({
    summary: 'Execute database seed',
    description: 'This endpoint generates a default user and loads players from a CSV file into the database.',
  })
  @ApiResponse({
    status: 200,
    description: 'Seed executed successfully.',
  })
  @ErrorResponse()
  seed() {
    return this.seedService.executeSeed();
  }
}
