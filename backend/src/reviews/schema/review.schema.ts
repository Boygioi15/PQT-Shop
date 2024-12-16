import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userRef: Types.ObjectId;

  @Prop({ type: Number, required: true })
  rating: number;

  @Prop({ type: String, required: true })
  comment: string;

  @Prop({ type: [String], required: false })
  imageURLs?: string[];

  @Prop({ type: String, required: false })
  productResponse?: string;

  @Prop({ type: [String], required: false })
  users_like?: string[];

  @Prop({ type: Boolean, default: false })
  isEdited: boolean;

  @Prop({ type: Boolean, default: false })
  isResponded: boolean;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
