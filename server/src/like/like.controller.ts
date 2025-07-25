import { Controller, Post, Param, UseGuards, Req, Get, ParseIntPipe } from '@nestjs/common';
import { LikeService } from './like.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':articleId')
  async toggleLike(@Param('articleId') articleId: number, @Req() req) {
    return this.likeService.toggleLike(req.user, articleId);
  }

  @Get(':articleId')
  async count(@Param('articleId') articleId: number) {
    const count = await this.likeService.countLikes(articleId);
    return { count };
  }

  @UseGuards(JwtAuthGuard)
    @Get('/articles/:id/likes')
    async getLikes(@Param('id', ParseIntPipe) articleId: number, @Req() req: any) {
    return this.likeService.getStatus(req.user.id, articleId);
    }

}