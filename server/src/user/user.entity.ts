import { Entity , Column, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({unique: true})
  name: string;
  @Column({ default: '' })
  email?: string;
  @Column()
  password: string;
  @Column({ default: '' })
  bio?: string;
  
}