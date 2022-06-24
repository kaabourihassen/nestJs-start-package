import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  access_secret: process.env.AUTH_JWT_ACCESS_SECRET,
  expires: process.env.AUTH_JWT_TOKEN_EXPIRES_IN,
  refresh_secret: process.env.AUTH_JWT_REFRESH_SECRET,
}));
