import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TeacherPayload {
  constructor(private readonly id: string) {
    this.teacherId = id;
  }

  @Field()
  teacherId: string;
}
