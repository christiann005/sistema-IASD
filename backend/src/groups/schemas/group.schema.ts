import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GroupDocument = Group & Document<Types.ObjectId>;

@Schema({ timestamps: true })
export class Group {
  @Prop({ required: true })
  name: string;

  @Prop()
  address?: string;

  @Prop()
  hostName?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  leader: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  members: Types.ObjectId[];

  @Prop({
    type: [
      {
        date: { type: Date, required: true },
        count: { type: Number, required: true },
      },
    ],
    default: [],
  })
  attendances: { date: Date; count: number }[];
}

export const GroupSchema = SchemaFactory.createForClass(Group);
