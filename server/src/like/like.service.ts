import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './like.entity';
import { Article } from '../article/article.entity';
import { User } from '../user/user.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like) private likeRepo: Repository<Like>,
    @InjectRepository(Article) private articleRepo: Repository<Article>
  ) {}

  async toggleLike(user: User, articleId: number) {
    const article = await this.articleRepo.findOneBy({ id: articleId });
    if (!article) throw new Error('Article not found');

    const existing = await this.likeRepo.findOne({
      where: { user: { id: user.id }, article: { id: articleId } },
    });

    if (existing) {
      await this.likeRepo.remove(existing);
      return { liked: false };
    } else {
      const like = this.likeRepo.create({ user, article });
      await this.likeRepo.save(like);
      return { liked: true };
    }
  }

  async countLikes(articleId: number) {
    return this.likeRepo.count({ where: { article: { id: articleId } } });
  }

  async getStatus(userId: number, articleId: number) {
    const count = await this.likeRepo.count({ where: { article: { id: articleId } } });
    const liked = await this.likeRepo.findOne({
      where: { article: { id: articleId }, user: { id: userId } }
    });
    return { liked: !!liked, count };
  }

}