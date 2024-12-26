import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { ClassModule } from 'src/class/class.module';

@Module({
  imports: [ClassModule],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
