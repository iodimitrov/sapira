import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { jwtConfig } from '../configs';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        jwtConfig(configService),
    }),
    PassportModule,
  ],
  providers: [JwtStrategy],
  exports: [PassportModule],
})
export class BaseAuthModule {}
