import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: any): Promise<User> {
    return this.userRepository.save(data);
  }

  async findOne(condition: any): Promise<User | null> {
    return this.userRepository.findOne({ where: condition });
  }

  async updateProfile(userId: number, profileData: UpdateProfileDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('用戶不存在');
    Object.assign(user, profileData);
    const updatedUser = await this.userRepository.save(user);
    const { password, ...result } = updatedUser;
    return result;
  }
}
