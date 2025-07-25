import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Controller('/api/articles')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  @Post('/post')
  async create(@Body() dto: CreateArticleDto, @Req() req) {
    const jwt = req.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(jwt);
    const user = await this.userService.findOne({ id: data['id'] });

    if (!user) {
      throw new Error('用戶未登入');
    }

    const article = await this.articleService.create(user, dto);
    return {
      message: '文章發表成功',
      article,
    };
  }

  @Get()
    async findAllPublished() {
    return this.articleService.findAllPublished();
    }

  @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.articleService.findOne(id);
    }
}
