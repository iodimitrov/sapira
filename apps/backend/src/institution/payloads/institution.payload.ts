import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class InstitutionPayload {
  constructor(private readonly id: string) {
    this.institutionId = id;
  }

  @Field()
  institutionId: string;
}
