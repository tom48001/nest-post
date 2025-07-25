import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './like.entity';
import { Article } from '../article/article.entity';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Like, Article])],
  providers: [LikeService],
  controllers: [LikeController],
})
export class LikeModule {}