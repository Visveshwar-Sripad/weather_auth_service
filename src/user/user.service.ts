import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  createUser(userDto: UserDto): Promise<User> {
    const user: User = new User();
    user.username = userDto.username;
    user.email = userDto.email;
    user.password = userDto.password;
    return this.userRepository.save(user);
  }

  async login(
    username: string,
    password: string,
  ): Promise<HttpException | string> {
    const user = await this.userRepository.findOneBy({ username });
    if (user === null || (user !== null && user.password !== password)) {
      throw new HttpException(
        'Invalid username or password',
        HttpStatus.FORBIDDEN,
      );
    }
    return 'Login successful';
  }
}
