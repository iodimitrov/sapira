import {
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { LoginInput } from '../inputs/login.input';
import { Token } from '@sapira/shared';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.userService.findOneByEmail(email);
    if (user) {
      if (await bcrypt.compare(pass, user.password)) {
        const refreshToken = this.jwtService.sign(
          { sub: user.id },
          {
            expiresIn: `${this.configService.get<number>(
              'JWT_REFRESH_EXPIRES_IN',
            )}s`,
          },
        );
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return { ...result, refreshToken };
      }
      throw new BadRequestException('Invalid password');
    } else {
      throw new NotFoundException('Not found');
    }
  }

  async regenerateToken(refreshToken: string) {
    if (this.verifyToken(refreshToken)) {
      const decodedRefreshToken = this.jwtService.decode(refreshToken);
      return this.jwtService.sign({ sub: decodedRefreshToken.sub });
    } else {
      throw new UnauthorizedException('Refresh token expired');
    }
  }

  verifyToken(refreshToken: string): boolean {
    try {
      this.jwtService.verify(
        refreshToken,
        this.configService.get<JwtVerifyOptions>('JWT_SECRET'),
      );
      return true;
    } catch {
      return false;
    }
  }

  async login(input: LoginInput): Promise<Token> {
    const result = await this.validateUser(input.email, input.password);
    return {
      accessToken: this.jwtService.sign({ sub: result.id }),
      refreshToken: result.refreshToken,
    };
  }
}
