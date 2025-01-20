import { Field, ID, registerEnumType } from '@nestjs/graphql';
import {
  EducationStage,
  Institution as InstitutionEntity,
  InstitutionType,
} from '@sapira/database';
import { User } from './user.model';
import { Subject } from './subject.model';
import { Schedule } from './schedule.model';

registerEnumType(InstitutionType, {
  name: 'InstitutionType',
});

registerEnumType(EducationStage, {
  name: 'EducationStage',
});

export class Institution implements InstitutionEntity {
  @Field(() => ID)
  id: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => InstitutionType)
  type: InstitutionType;

  @Field(() => EducationStage)
  educationalStage: EducationStage;

  @Field(() => String)
  alias: string;

  @Field(() => [User], { nullable: true })
  users?: User[] | null;

  @Field(() => [Subject], { nullable: true })
  subjects?: Subject[] | null;

  @Field(() => [Schedule], { nullable: true })
  schedules?: Schedule[] | null;
}
