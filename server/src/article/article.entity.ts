import { Entity , Column, PrimaryColumn, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn} from "typeorm";
import { User } from '../user/user.entity';
import { Comment } from '../comment/comment.entity';
import { Like } from '../like/like.entity';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @ManyToOne(() => User, (user) => user.id)
  author: User;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  publishedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

//   @OneToMany(() => EditHistory, edit => edit.article)
//   editHistories: EditHistory[];

  @OneToMany(() => Comment, comment => comment.article)
  comments: Comment[];

  @OneToMany(() => Like, like => like.article)
  likes: Like[];
}
