import { Class } from 'src/class/class.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  name: string;

  @Column('int', { name: 'class_id' })
  classId: number;

  @ManyToOne(() => Class, (class_) => class_.students, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'class_id' })
  class: Class;
}
