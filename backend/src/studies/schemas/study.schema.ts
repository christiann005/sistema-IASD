import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StudyDocument = Study & Document<Types.ObjectId>;

@Schema({ timestamps: true })
export class Study {
  @Prop({ required: true })
  lesson: string;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: Types.ObjectId, ref: 'Group' })
  group?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  leader: Types.ObjectId;

  @Prop()
  decisions?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const StudySchema = SchemaFactory.createForClass(Study);
