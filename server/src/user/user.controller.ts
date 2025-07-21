import { BadRequestException, Body, Controller, Get, Post, Put, Res , Req, UnauthorizedException} from '@nestjs/common';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('/api')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService
  ) {}

  @Post('/register')
  async register(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string
  ){
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userService.create({
      name,
      email,
      password: hashedPassword
    })

    const {password: _, ...userWithoutPassword} = user;
    return userWithoutPassword;
  }

  @Post('/login')
  async login(
    @Body('name') name: string,
    @Body('password') password: string,
    @Res({passthrough: true}) response: Response
  ){
    const user = await this.userService.findOne({name});

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if(!await bcrypt.compare(password, user.password)){
      throw new BadRequestException('Invalid credentials');
    }

    const jwt = await this.jwtService.signAsync({id: user.id});

    response.cookie('jwt', jwt, {httpOnly: true,});

    return {
      message: 'Login successful'
    }
  }

  @Get('/user')
  async user(@Req() request: Request){
    try{
      const cookies = request.cookies['jwt'];
      const data = await this.jwtService.verifyAsync(cookies);
      if (!data) {
        throw new UnauthorizedException('Invalid token');
      }

      const user = await this.userService.findOne({id: data['id']});
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      const {password: _, ...userWithoutPassword} = user;

      return userWithoutPassword;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
    
  }

  @Post('/logout')
  async logout(@Res({passthrough: true}) response: Response) {
    response.clearCookie('jwt');
    return {
      message: 'Logout successful'
    }
  }

  @Get('/profile')
  async getProfile(@Req() request: Request) {
    const cookies = request.cookies['jwt'];
    if (!cookies) {
      throw new UnauthorizedException('未登入');
    }

    const data = await this.jwtService.verifyAsync(cookies);
    const user = await this.userService.findOne({ id: data['id'] });
    
    if (!user) {
      throw new UnauthorizedException('用戶不存在');
    }

    // 返回個人資料，排除密碼
    const { password, ...profile } = user;
    return profile;
  }

  // 新增：更新個人資料
  @Put('/profile')
  async updateProfile(
    @Body() profileData: UpdateProfileDto,
    @Req() request: Request
  ) {
    const cookies = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookies);
    const userId = await this.userService.findOne({id: data['id']});
    
    if (!userId) {
      throw new UnauthorizedException('未登入');
    }

    try {
      const updatedProfile = await this.userService.updateProfile(userId.id, profileData);
      console.log('更新後的個人資料:', updatedProfile);
      return {
        message: '個人資料更新成功',
        profile: updatedProfile
      };
    } catch (error) {
      console.error('更新個人資料失敗:', error);
      throw new UnauthorizedException('更新失敗');
    }
  }

}
