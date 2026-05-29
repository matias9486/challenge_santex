import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { Auth, GetUser } from './decorators';
import { User } from './entities/user.entity';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUserDto } from './dto/authenticated-user.dto';
import { ErrorResponse } from 'src/common/decorators/error-response.decorators';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Create an user',
    description: 'Register a new user.',
  })
  @ApiResponse({
    status: 201,
    description: 'User created',
    type: AuthenticatedUserDto,
  })
  @ErrorResponse()
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK) //Al ser post sino especifíco el código http, mostrará 201.
  @ApiOperation({
    summary: 'Login user',
    description: 'Login user.',
  })
  @ApiResponse({
    status: 200,
    description: 'The user logged in successfully.',
    type: AuthenticatedUserDto,
  })
  @ErrorResponse()
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Validate auth session status',
    description: 'Validates the current authentication token and returns the authenticated user data if valid.',
  })
  @ApiResponse({
    status: 200,
    description: 'Authentication session is valid. User data retrieved successfully.',
    type: AuthenticatedUserDto,
  })
  @ErrorResponse()
  @Auth()
  checkStatus(@GetUser() user: User) {
    return this.authService.checkStatus(user);
  }
}
