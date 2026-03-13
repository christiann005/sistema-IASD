import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group, GroupDocument } from './schemas/group.schema';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group.name) private readonly groupModel: Model<GroupDocument>,
  ) {}

  async create(dto: CreateGroupDto) {
    const created = await this.groupModel.create({
      name: dto.name,
      address: dto.address,
      hostName: dto.hostName,
      leader: new Types.ObjectId(dto.leader),
      members: (dto.members ?? []).map((id) => new Types.ObjectId(id)),
      attendances: (dto.attendances ?? []).map((item) => ({
        date: new Date(item.date),
        count: item.count,
      })),
    });
    return created.toObject();
  }

  async findAll() {
    return this.groupModel.find().populate('leader', 'name email').lean();
  }

  async findById(id: string) {
    const group = await this.groupModel
      .findById(id)
      .populate('leader', 'name email')
      .populate('members', 'name email')
      .lean();
    if (!group) {
      throw new NotFoundException('Grupo no encontrado');
    }
    return group;
  }

  async update(id: string, dto: UpdateGroupDto) {
    const update: Partial<Group> = {
      name: dto.name,
      address: dto.address,
      hostName: dto.hostName,
    };

    if (dto.leader) {
      update.leader = new Types.ObjectId(dto.leader);
    }

    if (dto.members) {
      update.members = dto.members.map((memberId) => new Types.ObjectId(memberId));
    }

    if (dto.attendances) {
      update.attendances = dto.attendances.map((item) => ({
        date: new Date(item.date),
        count: item.count,
      }));
    }

    const group = await this.groupModel
      .findByIdAndUpdate(id, update, { new: true })
      .lean();
    if (!group) {
      throw new NotFoundException('Grupo no encontrado');
    }
    return group;
  }

  async remove(id: string) {
    const result = await this.groupModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Grupo no encontrado');
    }
  }
}
