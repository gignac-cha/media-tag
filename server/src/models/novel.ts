import { Column, Entity } from 'typeorm';
import { Media } from './media';

@Entity({ name: 'novels' })
export class Novel extends Media {
  @Column()
  volume: string;

  @Column()
  page: number;

  @Column()
  ISBN: string;
}
