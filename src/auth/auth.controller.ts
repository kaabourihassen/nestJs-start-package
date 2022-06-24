import { GetCurrentUser } from './../common/decorators/get-current-user.decorator';
import { AuthDto } from './dto/auth.dto';
import {
  Body,
  Controller,
  HttpCode,
  Post,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RtGuard } from 'src/common/guards/rt.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() authDto: AuthDto) {
    return await this.authService.login(authDto);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetCurrentUserId() employeeId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return await this.authService.refreshTokens(employeeId, refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUserId() employeeId: number) {
    return await this.authService.logout(employeeId);
  }
}
