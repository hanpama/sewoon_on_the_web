import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class GltfModel {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  originalChecksum: string;

  @Column()
  data: string;

};
