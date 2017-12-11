import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { GltfModel } from './GltfModel';
import { Collection } from './Collection';


@Entity()
export class ModelObject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  latitude: number;

  @Column('float')
  longitude: number;

  @Column('float')
  altitude: number;

  @ManyToOne(type => GltfModel)
  gltf: GltfModel

  @Column({ nullable: true })
  description: string;

  // @Column('simple-array')
  // tags: string;

  @ManyToOne(type => Collection)
  collection: Collection;
}
