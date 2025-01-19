import { InstitutionService } from './institution.service';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Institution as InstitutionEntity,
  Class as ClassEntity,
} from '@sapira/database';
import { DateScalar } from '@sapira/nest-common';
import { ClassService } from './class.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InstitutionEntity, ClassEntity]),
    forwardRef(() => UserModule),
  ],
  providers: [InstitutionService, ClassService, DateScalar],
  exports: [InstitutionService, ClassService],
})
export class InstitutionModule {}
