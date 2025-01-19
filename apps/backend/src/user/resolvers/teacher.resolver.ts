import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, GqlAuthGuard } from '@sapira/nest-common';
import { Teacher, User } from '@sapira/shared';
import { TeacherPayload } from '../payloads/teacher.payload';
import { UpdateTeacherInput } from '../inputs/update-teacher.input';
import { TeacherService } from '../services/teacher.service';

@Resolver(() => Teacher)
export class TeacherResolver {
  constructor(private readonly teacherService: TeacherService) {}

  @Query(() => Teacher)
  @UseGuards(GqlAuthGuard)
  getTeacher(@Args('id') id: string): Promise<Teacher> {
    return this.teacherService.findOne(id);
  }

  @Query(() => [Teacher])
  @UseGuards(GqlAuthGuard)
  getAllTeachers(@CurrentUser() currUser: User): Promise<Teacher[]> {
    return this.teacherService.findAll(currUser);
  }

  @Query(() => [Teacher])
  @UseGuards(GqlAuthGuard)
  getAllAvailableClassTeachers(
    @CurrentUser() currUser: User,
    @Args('classId', { nullable: true }) classId?: string,
  ): Promise<Teacher[]> {
    return this.teacherService.findAvailableClassTeachers(currUser, classId);
  }

  @Mutation(() => TeacherPayload)
  @UseGuards(GqlAuthGuard)
  updateTeacher(
    @Args('input') input: UpdateTeacherInput,
  ): Promise<TeacherPayload> {
    return this.teacherService.update(input);
  }
}
