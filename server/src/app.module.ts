import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
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
      entities: [User],
      synchronize: true,
    }),
    UserModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    })
  ]
})
export class AppModule {}
