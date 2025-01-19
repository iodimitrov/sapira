import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SchedulePayload {
  constructor(private readonly id: string) {
    this.scheduleId = id;
  }

  @Field()
  scheduleId: string;
}
