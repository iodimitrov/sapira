import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Class as ClassEntity, TokenStatus } from '@sapira/database';
import { Institution } from './institution.model';
import { Teacher } from './teacher.model';
import { Subject } from './subject.model';
import { Schedule } from './schedule.model';
import { Message } from './message.model';

registerEnumType(TokenStatus, {
  name: 'TokenStatus',
});

@ObjectType()
export class Class implements ClassEntity {
  @Field(() => ID)
  id: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Institution)
  institution: Institution;

  @Field(() => Int)
  startYear: number;

  @Field(() => Int)
  endYear: number;

  @Field(() => Int)
  totalStudentCount: number;

  @Field(() => Teacher, { nullable: true })
  teacher?: Teacher | null;

  @Field(() => String)
  letter: string;

  @Field(() => Int)
  number: number;

  @Field(() => String)
  token: string;

  @Field(() => TokenStatus)
  tokenStatus: TokenStatus;

  @Field(() => [Schedule])
  schedules: Schedule[];

  @Field(() => [Subject])
  subjects: Subject[];

  @Field(() => [Message])
  messages: Message[];
}
