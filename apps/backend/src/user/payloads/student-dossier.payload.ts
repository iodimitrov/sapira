import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StudentDossierPayload {
  constructor(private readonly id: string) {
    this.studentDossierId = id;
  }

  @Field()
  studentDossierId: string;
}
