import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserResolver } from './user.resolver';
import { UserService } from './services/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '@sapira/nest-common';
import { AuthService } from './services/auth.service';
import {
  User as UserEntity,
  Teacher as TeacherEntity,
  Class as ClassEntity,
} from '@sapira/database';
import { InstitutionModule } from '../institution/institution.module';
import { TeacherService } from './services/teacher.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, TeacherEntity, ClassEntity]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        jwtConfig(configService),
    }),
    InstitutionModule,
  ],
  providers: [UserResolver, UserService, AuthService, TeacherService],
  exports: [UserService, AuthService, TeacherService],
})
export class UserModule {}
