import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Schedule as ScheduleEntity, WeekDays } from '@sapira/database';
import { Subject } from './subject.model';
import { Teacher } from './teacher.model';
import { Class } from './class.model';
import { Institution } from './institution.model';

registerEnumType(WeekDays, {
  name: 'WeekDays',
});

@ObjectType()
export class Schedule implements ScheduleEntity {
  @Field(() => ID)
  id: string;

  @Field(() => Date)
  startTime: Date;

  @Field(() => Date)
  endTime: Date;

  @Field(() => WeekDays)
  day: WeekDays;

  @Field(() => Subject)
  subject: Subject;

  @Field(() => Class)
  class: Class;

  @Field(() => [Teacher], { nullable: true })
  teachers?: Teacher[] | null;

  @Field(() => Institution)
  institution: Institution;

  @Field(() => String)
  room: string;
}
