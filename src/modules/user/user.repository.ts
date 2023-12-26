import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  findOneByUsername(username: string) {
    return this.userRepository.findOne({
      where: {
        username,
      },
    });
  }
  save(username: string, password: string) {
    return this.userRepository.save({
      username,
      password,
    });
  }
}
