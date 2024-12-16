import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class UpdateReviewDto {
  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageURLs?: string[];
}
