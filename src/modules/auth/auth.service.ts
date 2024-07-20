// auth.service.ts
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '@/modules/users/users.service';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { User } from '@/modules/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(username);
    if (!user) {
      throw new UnauthorizedException('User email not found');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Password incorrect');
    } else {
      const { ...result } = user;
      return result;
    }
  }

  async login(user: User) {
    const payload = { user: user, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }

  async validateUserByJwt(payload: any) {
    return { userId: payload.sub, user: payload.user };
  }

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const user = await this.userService.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return { id: user.id, email: user.email };
  }
}
