import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  rating: number;

  @IsString()
  comment: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageURLs?: string[];
}
