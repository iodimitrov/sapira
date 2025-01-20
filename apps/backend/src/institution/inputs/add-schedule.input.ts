import { Field, InputType } from '@nestjs/graphql';
import { WeekDays } from '@sapira/database';

@InputType()
export class AddScheduleInput {
  @Field(() => Date)
  startTime: Date;

  @Field(() => Date)
  endTime: Date;

  @Field(() => WeekDays)
  day: WeekDays;

  @Field()
  subjectId: string;

  @Field()
  classId: string;

  @Field(() => [String], { nullable: true })
  teachersIds?: string[];

  @Field()
  room: string;
}
