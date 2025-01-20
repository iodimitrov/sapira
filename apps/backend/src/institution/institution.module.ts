import { InstitutionService } from './services/institution.service';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Institution as InstitutionEntity,
  Class as ClassEntity,
  StudentGrade as StudentGradeEntity,
  Subject as SubjectEntity,
  Schedule as ScheduleEntity,
} from '@sapira/database';
import { ClassService } from './services/class.service';
import { UserModule } from '../user/user.module';
import { ClassResolver } from './resolvers/class.resolver';
import { GradeResolver } from './resolvers/grade.resolver';
import { SubjectResolver } from './resolvers/subject.resolver';
import { SubjectService } from './services/subject.service';
import { InstitutionResolver } from './resolvers/institution.resolver';
import { GradeService } from './services/grade.service';
import { ScheduleService } from './services/schedule.service';
import { ScheduleResolver } from './resolvers/schedule.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InstitutionEntity,
      ClassEntity,
      StudentGradeEntity,
      SubjectEntity,
      ScheduleEntity,
    ]),
    forwardRef(() => UserModule),
  ],
  providers: [
    ScheduleResolver,
    GradeResolver,
    SubjectResolver,
    ClassResolver,
    InstitutionResolver,
    InstitutionService,
    ClassService,
    SubjectService,
    GradeService,
    ScheduleService,
  ],
  exports: [
    InstitutionService,
    ClassService,
    SubjectService,
    GradeService,
    ScheduleService,
  ],
})
export class InstitutionModule {}
