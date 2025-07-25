import { Controller, Post, Body, UseGuards, Req, Param, Get, ParseIntPipe } from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':articleId')
  async addComment(
    @Param('articleId') articleId: number,
    @Body('content') content: string,
    @Req() req
  ) {
    return this.commentService.addComment(req.user, articleId, content);
  }

  @Get(':articleId')
  async getComments(@Param('articleId') articleId: number) {
    return this.commentService.getComments(articleId);
  }

  @UseGuards(JwtAuthGuard)
    @Post('/articles/:id/comments')
        async createComment(
        @Param('id', ParseIntPipe) articleId: number,
        @Body('content') content: string,
        @Req() req: any
        ) {
            return this.commentService.create(req.user.id, articleId, content);
        }  

  
}