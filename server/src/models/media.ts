import { Column, Generated, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Company } from './company';
import { Creator } from './creator';
import { Series } from './series';
import { Category } from '../../../types/graphql/generated';

export abstract class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({ type: 'enum', enum: Category })
  category: Category;

  @Column()
  title: string;

  @Column({ nullable: true, default: null })
  subtitle: string;

  @ManyToMany(() => Creator, { eager: true, cascade: true })
  @JoinTable()
  creators: Creator[];

  @ManyToMany(() => Series, { eager: true, cascade: true })
  @JoinTable()
  series: Series[];

  @ManyToOne(() => Company, { eager: true, cascade: true })
  publisher: Company;

  @Column()
  publishedAt: Date;
}
