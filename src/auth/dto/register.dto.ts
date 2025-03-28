import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Username for the new user',
    example: 'newuser'
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Password for the new user',
    example: 'password123'
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Whether the user should have admin privileges',
    example: false,
    required: false
  })
  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;
} 