import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserResolver } from './resolvers/user.resolver';
import { UserService } from './services/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '@sapira/nest-common';
import { AuthService } from './services/auth.service';
import {
  User as UserEntity,
  Teacher as TeacherEntity,
  Class as ClassEntity,
  Student as StudentEntity,
  Parent as ParentEntity,
} from '@sapira/database';
import { InstitutionModule } from '../institution/institution.module';
import { TeacherService } from './services/teacher.service';
import { StudentService } from './services/student.service';
import { ParentService } from './services/parent.service';
import { TeacherResolver } from './resolvers/teacher.resolver';
import { ParentResolver } from './resolvers/parent.resolver';
import { StudentResolver } from './resolvers/student.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      TeacherEntity,
      ClassEntity,
      StudentEntity,
      ParentEntity,
    ]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        jwtConfig(configService),
    }),
    InstitutionModule,
  ],
  providers: [
    TeacherResolver,
    UserResolver,
    ParentResolver,
    StudentResolver,
    UserService,
    AuthService,
    TeacherService,
    StudentService,
    ParentService,
  ],
  exports: [
    UserService,
    AuthService,
    TeacherService,
    StudentService,
    ParentService,
  ],
})
export class UserModule {}
