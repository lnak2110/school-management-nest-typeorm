import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  UsePipes,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { CustomExceptionFilter } from 'src/common/exceptions/custom-exception.filter';
import { CustomValidationPipe } from 'src/common/pipes/custom-validation.pipe';
import { createResponse } from 'src/common/utils/response.util';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { NameDto } from 'src/common/dto/name.dto';
import { IdDto } from 'src/common/dto/id.dto';

@Controller('classes')
@UseFilters(CustomExceptionFilter)
@UseGuards(RoleGuard)
@Roles('principal')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post()
  @UsePipes(CustomValidationPipe)
  async create(@Body() createClassDto: CreateClassDto) {
    try {
      const data = await this.classService.create(createClassDto);
      return createResponse(HttpStatus.CREATED, 'Class created', data);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @Roles('teacher')
  async findAll() {
    try {
      const data = await this.classService.findAll();
      return createResponse(HttpStatus.OK, 'Classes found', data);
    } catch (error) {
      throw error;
    }
  }

  @Get('name') // ?keyword=
  @Roles('teacher')
  async findByName(@Query(new CustomValidationPipe()) query: NameDto) {
    try {
      const data = await this.classService.findByName(query.keyword);
      return createResponse(HttpStatus.OK, 'Classes found', data);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @Roles('teacher')
  @UsePipes(CustomValidationPipe)
  async findOne(@Param() { id }: IdParamDto) {
    try {
      const data = await this.classService.findOne(id);
      return createResponse(HttpStatus.OK, 'Class found', data);
    } catch (error) {
      throw error;
    }
  }

  @Patch()
  @UsePipes(CustomValidationPipe)
  async update(@Body() updateClassDto: UpdateClassDto) {
    try {
      const data = await this.classService.update(updateClassDto);
      return createResponse(HttpStatus.OK, 'Class updated', data);
    } catch (error) {
      throw error;
    }
  }

  @Delete()
  @UsePipes(CustomValidationPipe)
  async remove(@Body() { id }: IdDto) {
    try {
      const data = await this.classService.remove(id);
      return createResponse(HttpStatus.OK, 'Class removed', data);
    } catch (error) {
      throw error;
    }
  }
}
