import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, GqlAuthGuard } from '@sapira/nest-common';
import { Student, User } from '@sapira/shared';
import { StudentPayload } from '../payloads/student.payload';
import { UpdateStudentRecordInput } from '../inputs/update-student-record.input';
import { GetStudentTokenPayload } from '../payloads/get-student-token.payload';
import { StudentService } from '../services/student.service';
import { UpdateStudentInput } from '../inputs/update-student.input';

@Resolver(() => Student)
export class StudentResolver {
  constructor(private readonly studentService: StudentService) {}

  @Query(() => Student)
  @UseGuards(GqlAuthGuard)
  getStudent(@Args('id') id: string): Promise<Student> {
    return this.studentService.findOne(id);
  }

  @Query(() => [Student])
  @UseGuards(GqlAuthGuard)
  async getAllStudents(@CurrentUser() currUser: User): Promise<Student[]> {
    return this.studentService.findAll(currUser);
  }

  @Query(() => GetStudentTokenPayload)
  @UseGuards(GqlAuthGuard)
  getStudentToken(
    @CurrentUser() currUser: User,
  ): Promise<GetStudentTokenPayload> {
    return this.studentService.getToken(currUser);
  }

  @Mutation(() => StudentPayload)
  @UseGuards(GqlAuthGuard)
  updateStudent(
    @Args('input') input: UpdateStudentInput,
  ): Promise<StudentPayload> {
    return this.studentService.update(input);
  }

  @Mutation(() => StudentPayload)
  @UseGuards(GqlAuthGuard)
  updateStudentRecord(
    @Args('input') input: UpdateStudentRecordInput,
  ): Promise<StudentPayload> {
    return this.studentService.updateRecord(input);
  }
}
