import { Field, ID, registerEnumType } from '@nestjs/graphql';
import { Schedule as ScheduleEntity, WeekDays } from '@sapira/database';
import { Subject } from './subject.model';
import { Teacher } from './teacher.model';
import { Class } from './class.model';
import { Institution } from './institution.model';

registerEnumType(WeekDays, {
  name: 'WeekDays',
});

export class Schedule implements ScheduleEntity {
  @Field(() => ID)
  id: string;

  @Field()
  startTime: Date;

  @Field()
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

  @Field()
  room: string;
}
