import { Field, InputType } from '@nestjs/graphql';
import { WeekDays } from '@sapira/database';

@InputType()
export class AddScheduleInput {
  @Field()
  startTime: Date;

  @Field()
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
