import { BadRequestException, Body, Controller, Get, Post, Res , Req, UnauthorizedException} from '@nestjs/common';
import { UserService } from './app.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';

@Controller('/api')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService
  ) {}

  @Post('/register')
  async register(
    @Body('name') name: string,
    @Body('password') password: string
  ){
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userService.create({
      name,
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
}
