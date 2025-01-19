import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, GqlAuthGuard } from '@sapira/nest-common';
import { Class, User } from '@sapira/shared';
import { ClassPayload } from '../payloads/class.payload';
import { UpdateClassInput } from '../inputs/update-class.input';
import { AddClassInput } from '../inputs/add-class.input';
import { ClassService } from '../services/class.service';

@Resolver(() => Class)
export class ClassResolver {
  constructor(private readonly classService: ClassService) {}

  @Query(() => Class)
  @UseGuards(GqlAuthGuard)
  getClass(@Args('id') id: string): Promise<Class> {
    return this.classService.findOne(id);
  }

  @Query(() => [Class])
  @UseGuards(GqlAuthGuard)
  getAllClasses(@CurrentUser() currUser: User): Promise<Class[]> {
    return this.classService.findAll(currUser);
  }

  @Mutation(() => ClassPayload)
  @UseGuards(GqlAuthGuard)
  addClass(
    @Args('input') input: AddClassInput,
    @CurrentUser() currUser: User,
  ): Promise<ClassPayload> {
    return this.classService.add(input, currUser);
  }

  @Mutation(() => ClassPayload)
  @UseGuards(GqlAuthGuard)
  updateClass(@Args('input') input: UpdateClassInput): Promise<ClassPayload> {
    return this.classService.update(input);
  }

  @Mutation(() => ClassPayload)
  @UseGuards(GqlAuthGuard)
  removeClass(@Args('id') id: string): Promise<ClassPayload> {
    return this.classService.remove(id);
  }
}
