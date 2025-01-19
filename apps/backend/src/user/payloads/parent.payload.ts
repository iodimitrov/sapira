import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ParentPayload {
  constructor(private readonly id: string) {
    this.parentId = id;
  }

  @Field()
  parentId: string;
}
