import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ClassPayload {
  constructor(private readonly id: string) {
    this.classId = id;
  }

  @Field()
  classId: string;
}
