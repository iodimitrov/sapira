import { GenerateUserTokenPayload } from '../payloads/generate-user-token.payload';
import { GenerateUserTokenInput } from '../inputs/generate-user-token.input';
import { UpdateUserStatusInput } from '../inputs/update-user-status.input';
import { Args, Mutation, Query, Resolver, Context } from '@nestjs/graphql';
import { UpdateUserInput } from '../inputs/update-user.input';
import { CurrentUser, GqlAuthGuard } from '@sapira/nest-common';
import { AddUserInput } from '../inputs/add-user.input';
import { UserPayload } from '../payloads/user.payload';
import { AuthService } from '../services/auth.service';
import { LoginInput } from '../inputs/login.input';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../services/user.service';
import { UseGuards } from '@nestjs/common';
import { User, Token } from '@sapira/shared';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private authService: AuthService,
  ) {}

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async getUser(@Args('id') id: string): Promise<User> {
    const user = await this.userService.findOne(id);
    user.password = '';
    return user;
  }

  @Query(() => [User])
  @UseGuards(GqlAuthGuard)
  async getAllUsers(@CurrentUser() currUser: User): Promise<User[]> {
    const users = await this.userService.findAll(currUser);

    return users.map((user) => {
      user.password = '';
      return user;
    });
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async getProfile(@CurrentUser() currUser: User) {
    const user = await this.userService.findOne(currUser.id);
    user.password = '';

    return user;
  }

  @Query(() => Boolean)
  checkRefreshToken(@Context() ctx) {
    return this.authService.verifyToken(ctx.req.cookies.refreshToken);
  }

  @Query(() => User)
  async login(@Args('input') input: LoginInput, @Context() ctx) {
    const tokens = await this.authService.login(input);

    ctx.res.cookie('refreshToken', tokens.refreshToken, {
      maxAge:
        this.configService.getOrThrow<number>('JWT_REFRESH_EXPIRES_IN') * 1000,
      httpOnly: true,
    });
    ctx.res.cookie('accessToken', tokens.accessToken, {
      maxAge:
        this.configService.getOrThrow<number>('JWT_REFRESH_EXPIRES_IN') * 1000,
      httpOnly: true,
    });

    return this.userService.findOne(input.email);
  }

  @Query(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async logout(@Context() ctx) {
    ctx.res.clearCookie('accessToken');
    ctx.res.clearCookie('refreshToken');

    return true;
  }

  @Query(() => Token)
  async token(@Context() ctx) {
    const accessToken = await this.authService.regenerateToken(
      ctx.req.cookies.refreshToken,
    );

    ctx.res.cookie('accessToken', accessToken, {
      maxAge:
        this.configService.getOrThrow<number>('JWT_ACCESS_EXPIRES_IN') * 1000,
      httpOnly: true,
    });

    return {
      accessToken,
    };
  }

  @Query(() => GenerateUserTokenPayload)
  @UseGuards(GqlAuthGuard)
  generateUserToken(
    @Args('input') input: GenerateUserTokenInput,
    @CurrentUser() currUser: User,
  ) {
    return this.userService.generateUserToken(currUser, input);
  }

  @Mutation(() => UserPayload)
  register(@Args('input') input: AddUserInput): Promise<UserPayload> {
    return this.userService.add(input);
  }

  @Mutation(() => UserPayload)
  @UseGuards(GqlAuthGuard)
  updateUser(
    @Args('input') input: UpdateUserInput,
    @CurrentUser() currUser: User,
  ): Promise<UserPayload> {
    return this.userService.update(input, currUser);
  }

  @Mutation(() => UserPayload)
  @UseGuards(GqlAuthGuard)
  updateUserStatus(
    @Args('input') input: UpdateUserStatusInput,
  ): Promise<UserPayload> {
    return this.userService.updateStatus(input);
  }

  @Mutation(() => UserPayload)
  @UseGuards(GqlAuthGuard)
  removeUser(@Args('id') id: string): Promise<UserPayload> {
    return this.userService.remove(id);
  }
}
