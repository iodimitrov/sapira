import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Message, User } from '@sapira/shared';
import { MessageService } from '../services/message.service';
import { CurrentUser, GqlAuthGuard } from '@sapira/nest-common';
import { UseGuards } from '@nestjs/common';
import { MessagesByCriteriaInput } from '../inputs/messages-by-criteria.input';
import { MessagePayload } from '../payloads/message.payload';
import { AddMessageInput } from '../inputs/add-message.input';
import { UpdateMessageInput } from '../inputs/update-message.input';

@Resolver(() => Message)
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @Query(() => Message)
  @UseGuards(GqlAuthGuard)
  getMessage(@Args('id') id: string): Promise<Message> {
    return this.messageService.findOne(id);
  }

  @Query(() => [Message])
  @UseGuards(GqlAuthGuard)
  getAllMessages(@CurrentUser() currUser: User): Promise<Message[]> {
    return this.messageService.findAll(currUser);
  }

  @Query(() => [Message])
  @UseGuards(GqlAuthGuard)
  getAllMessagesByCriteria(
    @CurrentUser() currUser: User,
    @Args('input') input: MessagesByCriteriaInput,
  ): Promise<Message[]> {
    return this.messageService.findByCriteria(currUser, input);
  }

  @Mutation(() => MessagePayload)
  @UseGuards(GqlAuthGuard)
  addMessage(
    @Args('input') input: AddMessageInput,
    @CurrentUser() currUser: User,
  ): Promise<MessagePayload> {
    return this.messageService.add(input, currUser);
  }

  @Mutation(() => MessagePayload)
  @UseGuards(GqlAuthGuard)
  updateMessage(
    @Args('input') input: UpdateMessageInput,
    @CurrentUser() currUser: User,
  ): Promise<MessagePayload> {
    return this.messageService.update(input, currUser);
  }

  @Mutation(() => MessagePayload)
  @UseGuards(GqlAuthGuard)
  removeMessage(@Args('id') id: string): Promise<MessagePayload> {
    return this.messageService.remove(id);
  }
}
