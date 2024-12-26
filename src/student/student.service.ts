import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './student.entity';
import { ClassService } from 'src/class/class.service';
import { ErrorCodes } from 'src/common/exceptions/error-codes.enum';
import { DataSource, ILike } from 'typeorm';
import { CustomException } from 'src/common/exceptions/custom-exception';

@Injectable()
export class StudentService {
  constructor(
    private dataSource: DataSource,
    private readonly classService: ClassService,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const studentFound = await this.findOneByName(createStudentDto.name);
    if (studentFound) {
      throw new CustomException(
        ErrorCodes.CONFLICT,
        'Student name already exists',
        { field: 'name', value: createStudentDto.name },
      );
    }
    await this.classService.findOne(createStudentDto.classId);

    const result = await this.dataSource.manager.insert(
      Student,
      createStudentDto,
    );
    const studentCreated = await this.findOne(result.identifiers[0].id);
    return studentCreated;
  }

  async findAll(): Promise<Student[]> {
    return await this.dataSource.manager.find(Student, {
      relations: ['class'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Student> {
    const studentFound = await this.dataSource.manager.findOneBy(Student, {
      id,
    });
    if (!studentFound) {
      throw new CustomException(ErrorCodes.NOT_FOUND, 'Student not found', {
        field: 'id',
        value: id,
      });
    }
    return studentFound;
  }

  async findByName(keyword: string): Promise<Student[]> {
    return await this.dataSource.manager.find(Student, {
      where: { name: ILike(`%${keyword}%`) },
      relations: ['class'],
      order: { name: 'ASC' },
    });
  }

  async findOneByName(name: string): Promise<Student> {
    return await this.dataSource.manager.findOneBy(Student, { name });
  }

  async findByClassName(className: string): Promise<Student[]> {
    const classFound = await this.classService.findOneByName(className);
    if (!classFound) {
      throw new CustomException(ErrorCodes.NOT_FOUND, 'Class not found', {
        field: 'className',
        value: className,
      });
    }
    const classId = classFound.id;
    return await this.dataSource.manager.find(Student, {
      where: { classId },
      relations: ['class'],
      order: { name: 'ASC' },
    });
  }

  async update(updateStudentDto: UpdateStudentDto): Promise<Student> {
    const studentToUpdate = await this.findOne(updateStudentDto.id);
    if (updateStudentDto?.classId) {
      await this.classService.findOne(updateStudentDto.classId);
    }
    if (updateStudentDto?.name) {
      const studentFound = await this.findOneByName(updateStudentDto.name);
      if (studentFound && studentFound.id !== studentToUpdate.id) {
        throw new CustomException(
          ErrorCodes.CONFLICT,
          'Student name already exists',
          { field: 'name', value: updateStudentDto.name },
        );
      }
    }

    await this.dataSource.manager.update(
      Student,
      updateStudentDto.id,
      updateStudentDto,
    );
    const studentUpdated = await this.findOne(updateStudentDto.id);
    return studentUpdated;
  }

  async remove(id: number): Promise<Student> {
    const studentFound = await this.findOne(id);
    await this.dataSource.manager.delete(Student, id);
    return studentFound;
  }
}
