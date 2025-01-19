import { InstitutionService } from './institution.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Institution as InstitutionEntity,
  Class as ClassEntity,
} from '@sapira/database';
import { DateScalar } from '@sapira/nest-common';
import { ClassService } from './class.service';

@Module({
  imports: [TypeOrmModule.forFeature([InstitutionEntity, ClassEntity])],
  providers: [InstitutionService, ClassService, DateScalar],
  exports: [InstitutionService, ClassService],
})
export class InstitutionModule {}
