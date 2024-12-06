import { Type } from '@nestjs/common';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';

export type CartDocument = Cart & Document;

@Schema()
export class CartItem {
  constructor(
    productID: string,
    productTypeID: string,
    productTypeDetailID: string,
    quantity: number,
  ) {
    this.productRef = new Types.ObjectId(productID);
    this.product_typeRef = new Types.ObjectId(productTypeID);
    this.product_type_detailRef = new Types.ObjectId(productTypeDetailID);
    this.quantity = quantity;
  }
  @Prop({ type: Types.ObjectId, unique: true, auto: true })
  _id: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'products', required: true })
  productRef: Types.ObjectId;
  @Prop({ type: Types.ObjectId, required: true })
  product_typeRef: Types.ObjectId;
  @Prop({ type: Types.ObjectId, required: true })
  product_type_detailRef: Types.ObjectId;
  @Prop({ required: true })
  quantity: number;
}

@Schema({ collection: 'carts' })
export class Cart {
  @Prop({ type: [CartItem], default: [] })
  items: CartItem[];
  @Prop({ type: Date, default: Date.now, expireAfterSeconds: 20 })
  expireDate?: Date;
}
export const CartsSchema = SchemaFactory.createForClass(Cart);
