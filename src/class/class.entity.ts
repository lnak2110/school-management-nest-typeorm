import { Student } from 'src/student/student.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  name: string;

  @OneToMany(() => Student, (student) => student.class)
  students: Student[];
}
