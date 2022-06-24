import { User } from './../common/entities/user.entity';
import { UserService } from './../users/user.service';
import { AuthDto } from './dto/auth.dto';
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Tokens } from 'src/common/types/tokens.type';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private config: ConfigService,
  ) {}

  private async validate(authDto: AuthDto): Promise<User> {
    return await this.userService.findByEmail(authDto.email);
  }

  async login(authDto: AuthDto) {
    const user = await this.validate(authDto);
    // Because they have same error message
    if (!user || !(await bcrypt.compare(authDto.password, user.password))) {
      throw new UnauthorizedException('invalid credentials!!!');
    }
    const tokens = await this.getTokens(authDto.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async getTokens(email: string): Promise<Tokens> {
    const user = await this.userService.findByEmail(email);
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          test: 'im and access token',
          id: user.id,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        {
          secret: this.config.get('auth.access_secret'),
          expiresIn: '10s',
        },
      ),
      this.jwtService.signAsync(
        {
          id: user.id,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        {
          secret: this.config.get('auth.refresh_secret'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
  async updateRtHash(userId: number, rt: string): Promise<void> {
    await this.userService.updateRt(userId, rt);
  }

  async logout(employeeId: number): Promise<boolean> {
    await this.userService.updateRtToNULL(employeeId);
    return true;
  }
  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await this.userService.findByIdRt(userId);
    if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');

    const rtMatches = await bcrypt.compare(rt, user.hashedRt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }
}
