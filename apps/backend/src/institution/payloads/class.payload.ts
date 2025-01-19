import { Field, ObjectType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@ObjectType()
export class ClassPayload {
  constructor(private readonly id: string) {
    this.classId = id;
  }

  @Field()
  @IsUUID('all')
  classId: string;
}
