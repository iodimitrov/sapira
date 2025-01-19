import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GradePayload {
  constructor(private readonly id: string) {
    this.gradeId = id;
  }

  @Field()
  gradeId: string;
}
