import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { Article } from '../article/article.entity';
import { User } from '../user/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(Article) private articleRepo: Repository<Article>,
    @InjectRepository(User) private userRepo: Repository<User>
  ) {}

  async addComment(user: User, articleId: number, content: string) {
    const article = await this.articleRepo.findOneBy({ id: articleId });
    if (!article) throw new Error('Article not found');

    const comment = this.commentRepo.create({ content, author: user, article });
    return this.commentRepo.save(comment);
  }

  async getComments(articleId: number) {
    return this.commentRepo.find({
      where: { article: { id: articleId } },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByArticleId(articleId: number): Promise<Comment[]> {
    return this.commentRepo.find({
      where: { article: { id: articleId } },
      relations: ['author'],
      order: { createdAt: 'DESC' }
    });
  }

  async create(userId: number, articleId: number, content: string) {
    const user = await this.userRepo.findOneByOrFail({ id: userId });
    const article = await this.articleRepo.findOneByOrFail({ id: articleId });

    const comment = this.commentRepo.create({
      content,
      author: user,
      article,
    });

    return this.commentRepo.save(comment);
  }


}