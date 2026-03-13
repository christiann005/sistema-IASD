import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VisitDocument = Visit & Document<Types.ObjectId>;

@Schema({ timestamps: true })
export class Visit {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  address?: string;

  @Prop()
  phone?: string;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop()
  reason?: string;

  @Prop({ type: Types.ObjectId, ref: 'Group' })
  group?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const VisitSchema = SchemaFactory.createForClass(Visit);
