import { InstitutionService } from './services/institution.service';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Institution as InstitutionEntity,
  Class as ClassEntity,
} from '@sapira/database';
import { DateScalar } from '@sapira/nest-common';
import { ClassService } from './services/class.service';
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
