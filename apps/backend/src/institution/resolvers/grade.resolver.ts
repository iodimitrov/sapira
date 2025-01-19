import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, GqlAuthGuard } from '@sapira/nest-common';
import { StudentGrade, User } from '@sapira/shared';
import { GradeService } from '../services/grade.service';
import { GradePayload } from '../payloads/grade.payload';
import { AddGradeInput } from '../inputs/add-grade.input';

@Resolver(() => StudentGrade)
export class GradeResolver {
  constructor(private readonly gradeService: GradeService) {}

  @Query(() => [StudentGrade])
  @UseGuards(GqlAuthGuard)
  getAllStudentGrades(
    @Args('studentId') studentId: string,
  ): Promise<StudentGrade[]> {
    return this.gradeService.findAllForOneStudent(studentId);
  }

  @Query(() => [StudentGrade])
  @UseGuards(GqlAuthGuard)
  getAllGrades(@CurrentUser() currUser: User): Promise<StudentGrade[]> {
    return this.gradeService.findAllByInstruction(currUser);
  }

  @Query(() => [StudentGrade])
  @UseGuards(GqlAuthGuard)
  getAllGradesPerClassPerSubject(
    @Args('classId') classId: string,
    @Args('subjectId') subjectId: string,
  ): Promise<StudentGrade[]> {
    return this.gradeService.findAllForOneSubject(subjectId);
  }

  @Mutation(() => GradePayload)
  @UseGuards(GqlAuthGuard)
  addGrade(
    @Args('input') input: AddGradeInput,
    @CurrentUser() user: User,
  ): Promise<GradePayload> {
    return this.gradeService.add(input, user);
  }
}
