import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  name: string;

  @Prop()
  image: string;

  @Prop()
  birthday: Date;

  @Prop()
  accountName: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  phone: string;

  @Prop()
  password: string;

  @Prop()
  refreshToken: string;

  @Prop()
  password_reset_code?: string;

  @Prop()
  password_reset_expires?: Date;

  @Prop({ unique: true, sparse: true })
  googleId?: string;

  @Prop({ unique: true, sparse: true })
  facebookId?: string;

  @Prop({ type: Types.ObjectId, ref: 'reviews' })
  cartRef: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
