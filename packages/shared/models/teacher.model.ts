import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ContractType, Teacher as TeacherEntity } from '@sapira/database';
import { User } from './user.model';
import { Subject } from './subject.model';
import { Schedule } from './schedule.model';

registerEnumType(ContractType, {
  name: 'ContractType',
});

@ObjectType()
export class Teacher implements TeacherEntity {
  @Field(() => ID)
  id: string;

  @Field(() => User)
  user: User;

  @Field(() => String, { nullable: true })
  education?: string | null;

  @Field(() => Int, { nullable: true })
  yearsExperience?: number | null;

  @Field(() => ContractType, { nullable: true })
  contractType?: ContractType | null;

  @Field(() => String)
  token: string;

  @Field(() => [Subject], { nullable: true })
  subjects?: Subject[] | null;

  @Field(() => [Schedule], { nullable: true })
  schedules?: Schedule[] | null;
}
