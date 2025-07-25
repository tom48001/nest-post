import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Unique } from 'typeorm';
import { User } from '../user/user.entity';
import { Article } from '../article/article.entity';

@Entity('likes')
@Unique(['user', 'article'])
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.id)
  user: User;

  @ManyToOne(() => Article, article => article.likes, { onDelete: 'CASCADE' })
  article: Article;

  @CreateDateColumn()
  createdAt: Date;
}
