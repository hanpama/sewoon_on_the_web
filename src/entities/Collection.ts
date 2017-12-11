import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ModelObject } from './ModelObject';

@Entity()
export class Collection {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(type => ModelObject, modelObject => modelObject.collection)
  models: ModelObject[];

}
