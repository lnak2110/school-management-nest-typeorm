import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { createResponse } from 'src/common/utils/response.util';
import { CustomExceptionFilter } from 'src/common/exceptions/custom-exception.filter';
import { CustomValidationPipe } from 'src/common/pipes/custom-validation.pipe';
import { FindStudentByClassDto } from './dto/find-student-by-class.dto';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { FindByNameDto } from 'src/common/dto/find-by-name.dto';
import { IdDto } from 'src/common/dto/id.dto';

@Controller('students')
@UseFilters(CustomExceptionFilter)
@UseGuards(RoleGuard)
@Roles('teacher')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  async create(
    @Body(new CustomValidationPipe()) createStudentDto: CreateStudentDto,
  ) {
    try {
      const data = await this.studentService.create(createStudentDto);
      return createResponse(HttpStatus.CREATED, 'Student created', data);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @Roles('principal')
  async findAll() {
    try {
      const data = await this.studentService.findAll();
      return createResponse(HttpStatus.OK, 'Students found', data);
    } catch (error) {
      throw error;
    }
  }

  @Get('name') // ?keyword=
  @Roles('principal')
  async findByName(@Query(new CustomValidationPipe()) query: FindByNameDto) {
    try {
      const data = await this.studentService.findByName(query.keyword);
      return createResponse(HttpStatus.OK, 'Students found', data);
    } catch (error) {
      throw error;
    }
  }

  @Get('class/:className')
  @Roles('principal')
  async findByClass(@Param() param: FindStudentByClassDto) {
    try {
      const data = await this.studentService.findByClassName(param.className);
      return createResponse(HttpStatus.OK, 'Students found', data);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @Roles('principal')
  async findOne(@Param(CustomValidationPipe) param: IdParamDto) {
    try {
      const data = await this.studentService.findOne(param.id);
      return createResponse(HttpStatus.OK, 'Student found', data);
    } catch (error) {
      throw error;
    }
  }

  @Patch()
  async update(@Body(CustomValidationPipe) updateStudentDto: UpdateStudentDto) {
    try {
      const data = await this.studentService.update(updateStudentDto);
      return createResponse(HttpStatus.OK, 'Student updated', data);
    } catch (error) {
      throw error;
    }
  }

  @Delete()
  async remove(@Body(CustomValidationPipe) { id }: IdDto) {
    try {
      const data = await this.studentService.remove(id);
      return createResponse(HttpStatus.OK, 'Student removed', data);
    } catch (error) {
      throw error;
    }
  }
}
