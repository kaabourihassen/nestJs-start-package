import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayloadWithRt } from 'src/common/types/jwtPayloadWithRt.type';


@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth.refresh_secret'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any): Promise<JwtPayloadWithRt> {
    const refreshToken = await req
      ?.get('authorization')
      ?.replace('Bearer', '')
      .trim();
    if (!refreshToken) throw new UnauthorizedException('Refresh token malformed');
    return {
      ...payload,
      refreshToken,
    };
  }
}