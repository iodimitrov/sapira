import { Field, ID, Int, registerEnumType } from '@nestjs/graphql';
import { ContractType, Teacher as TeacherEntity } from '@sapira/database';
import { User } from './user.model';
import { Subject } from './subject.model';
import { Schedule } from './schedule.model';

registerEnumType(ContractType, {
  name: 'ContractType',
});

export class Teacher implements TeacherEntity {
  @Field(() => ID)
  id: string;

  @Field(() => User)
  user: User;

  @Field({ nullable: true })
  education?: string;

  @Field(() => Int, { nullable: true })
  yearsExperience?: number;

  @Field(() => ContractType, { nullable: true })
  contractType?: ContractType;

  @Field()
  token: string;

  @Field(() => [Subject], { nullable: true })
  subjects?: Subject[];

  @Field(() => [Schedule], { nullable: true })
  schedules?: Schedule[];
}
