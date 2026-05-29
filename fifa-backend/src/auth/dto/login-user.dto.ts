import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  IsEmail,
  MaxLength,
  Matches,
} from 'class-validator';

@ApiSchema({ name: 'LoginRequest' })
export class LoginUserDto {
  @ApiProperty({
    description: "User's email address for login.",
    example: 'matias@gmail.com',
  })
  @IsString()
  @IsEmail()
  email!: string;

  @ApiProperty({
    description:
      'User password. Must be 6-50 characters and include an uppercase letter, a lowercase letter, and a number.',
    example: 'Matias1234',
    minLength: 6,
    maxLength: 50,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password!: string;
}
