// otp-log.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OtpEmailDocument = OtpEmail & Document;

@Schema({
  timestamps: true,
  collection: 'OtpEmail',
})
export class OtpEmail {
  @Prop({ required: true })
  otp: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({
    type: Date,
    default: Date.now,
    expires: 120,
  })
  expireAt: Date;
}

export const OtpEmailSchema = SchemaFactory.createForClass(OtpEmail);
