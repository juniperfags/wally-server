import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 25, unique: true })
  username: string;

  @Column({ nullable: false, length: 25 })
  password: string;
}
