import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { ArticleModule } from './article/article.module';
import { Article } from './article/article.entity';
import { CommentModule } from './comment/comment.module';
import { Comment } from './comment/comment.entity';
import { LikeModule } from './like/like.module';
import { Like } from './like/like.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants, dbPassword } from '../constants';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: dbPassword.password,
      database: 'nest',
      entities: [User, Article, Comment, Like],
      synchronize: true,
    }),
    UserModule,
    ArticleModule,
    CommentModule,
    LikeModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    })
  ]
})
export class AppModule {}
