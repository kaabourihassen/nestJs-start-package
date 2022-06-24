import { User } from './../common/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { RessouceNotFoundException } from 'src/common/filters/ressourceNotFound';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email },
      select: ['password', 'id', 'role', 'firstName', 'lastName'],
    });
    if (user == undefined) {
      throw new RessouceNotFoundException('employee not found');
    }
    return user;
  }

  async updateRt(employeeId: number, rt: string) {
    const user = await this.findOneById(employeeId);
    if (!user) {
      throw new RessouceNotFoundException('employee not found');
    }
    user.hashedRt = await bcrypt.hash(rt, 10);
    return this.userRepository.save(user);
  }

  async updateRtToNULL(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new RessouceNotFoundException('employee not found');
    }
    user.hashedRt = null;
    return this.userRepository.save(user);
  }

  async findByIdRt(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['email', 'hashedRt'],
    });
    if (!user) {
      throw new RessouceNotFoundException('user not found');
    }
    return user;
  }

  async findOneById(id: number) {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) {
      throw new RessouceNotFoundException('user not found!');
    }
    return user;
  }
}
