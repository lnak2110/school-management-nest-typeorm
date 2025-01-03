import { IsString, IsNotEmpty, Length } from 'class-validator';

export class ClassNameDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  className: string;
}
