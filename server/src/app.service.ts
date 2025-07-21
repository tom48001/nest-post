import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>
  ){
  }
  async create(data: any): Promise<User> {
    return this.userRepository.save(data);
  }
  
  async findOne(condition: any):Promise<User | null>{
    const result = await this.userRepository.findOne({where: condition});
    console.log('findOne result:', result);
    return result;
  }

  async updateProfile(userId: number, profileData: UpdateProfileDto) {
  const user = await this.userRepository.findOne({ where: { id: userId } });

  if (!user) {
    throw new Error('用戶不存在');
  }

  // 合併新的 profile 資料
  Object.assign(user, profileData);

  // 儲存至資料庫
  const updatedUser = await this.userRepository.save(user);

  // 回傳資料，去除密碼
  const { password, ...result } = updatedUser;
  return result;
  }


  
}

