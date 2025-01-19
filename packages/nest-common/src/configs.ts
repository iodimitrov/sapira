import { ConfigService } from '@nestjs/config';

export const jwtConfig = (configService: ConfigService) => ({
  secret: configService.getOrThrow<string>('JWT_SECRET'),
  signOptions: {
    expiresIn: `${configService.getOrThrow<string>('JWT_ACCESS_EXPIRES_IN')}s`,
  },
});
