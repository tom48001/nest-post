import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { LessThanOrEqual, Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { User } from '../user/user.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepo: Repository<Article>,
  ) {}

  async create(user: User, dto: CreateArticleDto) {
    const article = this.articleRepo.create({
      ...dto,
      publishedAt: dto.publishedAt || new Date(),
      tags: dto.tags || [],
      author: user,
    });

    return this.articleRepo.save(article);
  }

  async findAllPublished(): Promise<Article[]> {
    return this.articleRepo.find({
      where: {
        publishedAt: LessThanOrEqual(new Date())
      },
      relations: ['author'], // 取得作者資料
      order: {
        publishedAt: 'DESC'
      }
    });
  }

  async findOne(id: number): Promise<Article> {
  const article = await this.articleRepo.findOne({
    where: { id },
    relations: ['author', 'tags'],
  });
  if (!article) throw new NotFoundException('Article not found');
  return article;
}
}
