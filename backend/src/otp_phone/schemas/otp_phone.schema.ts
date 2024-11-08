// otp-log.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OtpPhoneDocument = OtpPhone & Document;

@Schema({
  timestamps: true,
  collection: 'OtpPhone',
})
export class OtpPhone {
  @Prop({ required: true })
  otp: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({
    type: Date,
    default: Date.now,
    expires: 120,
  })
  expireAt: Date;
}

export const OtpPhoneSchema = SchemaFactory.createForClass(OtpPhone);
