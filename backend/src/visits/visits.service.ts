import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';
import { Visit, VisitDocument } from './schemas/visit.schema';

@Injectable()
export class VisitsService {
  constructor(
    @InjectModel(Visit.name) private readonly visitModel: Model<VisitDocument>,
  ) {}

  async create(dto: CreateVisitDto, createdBy: string) {
    const created = await this.visitModel.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      address: dto.address,
      phone: dto.phone,
      date: new Date(dto.date),
      reason: dto.reason,
      group: dto.group ? new Types.ObjectId(dto.group) : undefined,
      createdBy: new Types.ObjectId(createdBy),
    });
    return created.toObject();
  }

  async findAll() {
    return this.visitModel
      .find()
      .populate('createdBy', 'name email')
      .populate('group', 'name')
      .sort({ date: -1 })
      .lean();
  }

  async findById(id: string) {
    const visit = await this.visitModel
      .findById(id)
      .populate('createdBy', 'name email')
      .populate('group', 'name')
      .lean();
    if (!visit) {
      throw new NotFoundException('Visita no encontrada');
    }
    return visit;
  }

  async update(id: string, dto: UpdateVisitDto) {
    const update: Partial<Visit> = {
      firstName: dto.firstName,
      lastName: dto.lastName,
      address: dto.address,
      phone: dto.phone,
      reason: dto.reason,
    };

    if (dto.date) {
      update.date = new Date(dto.date);
    }
    if (dto.group) {
      update.group = new Types.ObjectId(dto.group);
    }

    const visit = await this.visitModel
      .findByIdAndUpdate(id, update, { new: true })
      .lean();
    if (!visit) {
      throw new NotFoundException('Visita no encontrada');
    }
    return visit;
  }

  async remove(id: string) {
    const result = await this.visitModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Visita no encontrada');
    }
  }
}
