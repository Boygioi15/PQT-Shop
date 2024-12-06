import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true, collection: 'categories' })
export class Category {
  @Prop({ trim: true, required: true })
  name: string;

  @Prop()
  thumbnailURL: string;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'categories' })
  childernId: ObjectId[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
