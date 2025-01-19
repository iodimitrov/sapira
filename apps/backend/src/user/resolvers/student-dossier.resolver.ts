import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StudentDossier, User } from '@sapira/shared';
import { StudentDossierService } from '../services/student-dossier.service';
import { FindOneStudentDossierPayload } from '../payloads/find-one-student-dossier.payload';
import { CurrentUser, GqlAuthGuard } from '@sapira/nest-common';
import { UseGuards } from '@nestjs/common';
import { StudentDossierPayload } from '../payloads/student-dossier.payload';
import { AddStudentDossierInput } from '../inputs/add-student-dossier.input';

@Resolver(() => StudentDossier)
export class StudentDossierResolver {
  constructor(private readonly studentDossierService: StudentDossierService) {}

  @Query(() => FindOneStudentDossierPayload)
  @UseGuards(GqlAuthGuard)
  getStudentDossier(
    @Args('studentId') studentId: string,
  ): Promise<FindOneStudentDossierPayload> {
    return this.studentDossierService.findOne(studentId);
  }

  @Query(() => [StudentDossier])
  @UseGuards(GqlAuthGuard)
  getAllStudentDossiers(
    @CurrentUser() currUser: User,
  ): Promise<StudentDossier[]> {
    return this.studentDossierService.findAll(currUser);
  }

  @Mutation(() => StudentDossierPayload)
  @UseGuards(GqlAuthGuard)
  addStudentDossier(
    @Args('input')
    input: AddStudentDossierInput,
    @CurrentUser() currUser: User,
  ): Promise<StudentDossierPayload> {
    return this.studentDossierService.add(input, currUser);
  }
}
