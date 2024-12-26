import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClassModule } from './class/class.module';
import { StudentModule } from './student/student.module';
import { APP_FILTER } from '@nestjs/core';
import { NotFoundExceptionFilter } from './common/exceptions/not-found-exception.filter';
import { CustomExceptionFilter } from './common/exceptions/custom-exception.filter';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource from 'data-source';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => dataSource.options,
    }),
    ClassModule,
    StudentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter,
    },
  ],
})
export class AppModule {}
