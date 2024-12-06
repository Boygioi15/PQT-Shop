import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  name: string;
  thumbnailURL: string;
  description: string;
  childernId: string[];
}
