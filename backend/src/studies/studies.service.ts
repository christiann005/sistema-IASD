import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateStudyDto } from './dto/create-study.dto';
import { UpdateStudyDto } from './dto/update-study.dto';
import { Study, StudyDocument } from './schemas/study.schema';

@Injectable()
export class StudiesService {
  constructor(
    @InjectModel(Study.name) private readonly studyModel: Model<StudyDocument>,
  ) {}

  async create(dto: CreateStudyDto, createdBy: string) {
    const created = await this.studyModel.create({
      lesson: dto.lesson,
      date: new Date(dto.date),
      group: dto.group ? new Types.ObjectId(dto.group) : undefined,
      leader: new Types.ObjectId(dto.leader),
      decisions: dto.decisions,
      createdBy: new Types.ObjectId(createdBy),
    });
    return created.toObject();
  }

  async findAll() {
    return this.studyModel
      .find()
      .populate('leader', 'name email')
      .populate('group', 'name')
      .populate('createdBy', 'name email')
      .sort({ date: -1 })
      .lean();
  }

  async findById(id: string) {
    const study = await this.studyModel
      .findById(id)
      .populate('leader', 'name email')
      .populate('group', 'name')
      .populate('createdBy', 'name email')
      .lean();
    if (!study) {
      throw new NotFoundException('Estudio no encontrado');
    }
    return study;
  }

  async update(id: string, dto: UpdateStudyDto) {
    const update: Partial<Study> = {
      lesson: dto.lesson,
      decisions: dto.decisions,
    };

    if (dto.date) {
      update.date = new Date(dto.date);
    }
    if (dto.group) {
      update.group = new Types.ObjectId(dto.group);
    }
    if (dto.leader) {
      update.leader = new Types.ObjectId(dto.leader);
    }

    const study = await this.studyModel
      .findByIdAndUpdate(id, update, { new: true })
      .lean();
    if (!study) {
      throw new NotFoundException('Estudio no encontrado');
    }
    return study;
  }

  async remove(id: string) {
    const result = await this.studyModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Estudio no encontrado');
    }
  }
}
