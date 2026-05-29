import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: 'UserAuthenticatedResponse' })
export class AuthenticatedUserDto {
  @ApiProperty({
    description: 'Unique identifier of the user.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Full name of the user.',
    example: 'Matias Alancay',
  })
  fullName!: string;

  @ApiProperty({
    description: 'List of roles assigned to the user (used for authorization Guards).',
    example: ['user', 'admin'],
  })
  roles!: string[]; // Para los Guards!

  @ApiProperty({
    description: 'JWT authentication token.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token!: string;
}
