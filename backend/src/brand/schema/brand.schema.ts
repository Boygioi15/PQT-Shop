import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, Types } from 'mongoose';

export type BrandDocument = Brand & Document;

@Schema({ timestamps: true, collection: 'brands' })
export class Brand {
  @Prop({ trim: true, required: true })
  name: string;

  @Prop({ trim: true })
  description: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
