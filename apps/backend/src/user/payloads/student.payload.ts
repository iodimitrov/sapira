import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StudentPayload {
  constructor(private readonly id: string) {
    this.studentId = id;
  }

  @Field()
  studentId: string;
}
