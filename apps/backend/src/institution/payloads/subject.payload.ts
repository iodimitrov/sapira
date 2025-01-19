import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SubjectPayload {
  constructor(private readonly id: string) {
    this.subjectId = id;
  }

  @Field()
  subjectId: string;
}
