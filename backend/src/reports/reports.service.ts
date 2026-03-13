import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Group, GroupDocument } from '../groups/schemas/group.schema';
import { Study, StudyDocument } from '../studies/schemas/study.schema';
import { Visit, VisitDocument } from '../visits/schemas/visit.schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Group.name) private readonly groupModel: Model<GroupDocument>,
    @InjectModel(Study.name) private readonly studyModel: Model<StudyDocument>,
    @InjectModel(Visit.name) private readonly visitModel: Model<VisitDocument>,
  ) {}

  async getSummary() {
    const [users, groups, studies, visits] = await Promise.all([
      this.userModel.countDocuments(),
      this.groupModel.countDocuments(),
      this.studyModel.countDocuments(),
      this.visitModel.countDocuments(),
    ]);

    return { users, groups, studies, visits };
  }
}
