import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Class } from './class.entity';
import { ErrorCodes } from 'src/common/exceptions/error-codes.enum';
import { DataSource, ILike, QueryFailedError } from 'typeorm';
import { CustomException } from 'src/common/exceptions/custom-exception';

@Injectable()
export class ClassService {
  constructor(private dataSource: DataSource) {}

  async create(createClassDto: CreateClassDto): Promise<Class> {
    const classFound = await this.findOneByName(createClassDto.name);
    if (classFound) {
      throw new CustomException(
        ErrorCodes.CONFLICT,
        'Class name already exists',
        {
          field: 'name',
          value: createClassDto.name,
        },
      );
    }

    const result = await this.dataSource.manager.insert(Class, createClassDto);
    const classCreated = await this.findOne(result.identifiers[0].id);
    return classCreated;
  }

  async findAll(): Promise<Class[]> {
    const classes = await this.dataSource.manager.find(Class, {
      order: { id: 'ASC' },
      relations: ['students'],
    });
    return classes.map((c) => ({ ...c, studentsCount: c.students.length }));
  }

  async findByName(keyword: string): Promise<Class[]> {
    const classes = await this.dataSource.manager.find(Class, {
      where: { name: ILike(`%${keyword}%`) },
      relations: ['students'],
      order: { name: 'ASC' },
    });
    return classes.map((c) => ({ ...c, studentsCount: c.students.length }));
  }

  async findOne(id: number, field: string = 'id'): Promise<Class> {
    const classFound = await this.dataSource.manager.findOne(Class, {
      where: { id },
      relations: ['students'],
    });
    if (!classFound) {
      throw new CustomException(ErrorCodes.NOT_FOUND, 'Class not found', {
        field,
        value: id,
      });
    }
    return classFound;
  }

  async findOneByName(name: string): Promise<Class> {
    return await this.dataSource.manager.findOne(Class, {
      where: { name: ILike(name) },
    });
  }

  async update(updateClassDto: UpdateClassDto): Promise<Class> {
    const { id } = updateClassDto;
    const classToUpdate = await this.findOne(id);
    const classFound = await this.findOneByName(updateClassDto.name);
    if (classFound && classFound.id !== classToUpdate.id) {
      throw new CustomException(
        ErrorCodes.CONFLICT,
        'Class name already exists',
        {
          field: 'name',
          value: updateClassDto.name,
        },
      );
    }

    const result = await this.dataSource.manager.update(
      Class,
      id,
      updateClassDto,
    );
    const classUpdated = await this.findOne(id);
    return classUpdated;
  }

  async remove(id: number): Promise<Class> {
    const classFound = await this.findOne(id);
    if (classFound.students.length > 0) {
      throw new CustomException(
        ErrorCodes.BAD_REQUEST_INPUT,
        'Class cannot be removed because it has students',
        { field: 'id', value: id },
      );
    }
    await this.dataSource.manager.delete(Class, id);
    return classFound;
  }
}
