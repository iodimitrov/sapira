import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConfig } from '@sapira/database';
import { UserModule } from './user/user.module';
import { InstitutionModule } from './institution/institution.module';
import { BaseAuthModule } from '@sapira/nest-common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => getConfig(),
    }),
    BaseAuthModule,
    InstitutionModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
