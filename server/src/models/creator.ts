import { Column, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';
import { Job } from './types';

@Entity({ name: 'creators' })
export class Creator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Generated('uuid')
  uuid: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: Job,
    array: true,
    default: [],
  })
  jobs: Job[];
}
