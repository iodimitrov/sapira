import { Field, ObjectType } from '@nestjs/graphql';
import { File, StudentDossier } from '@sapira/shared';

@ObjectType()
export class FindOneStudentDossierPayload {
  constructor(
    private readonly inputDossiers: StudentDossier[],
    private readonly inputFiles: File[],
  ) {
    this.studentDossiers = inputDossiers;
    this.files = inputFiles;
  }

  @Field(() => [StudentDossier])
  studentDossiers: StudentDossier[];

  @Field(() => [File])
  files: File[];
}
