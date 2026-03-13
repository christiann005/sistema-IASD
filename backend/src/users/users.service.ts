import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) {}

  async ensureAdminUser(): Promise<void> {
    const email = this.configService.get<string>('ADMIN_EMAIL');
    const password = this.configService.get<string>('ADMIN_PASSWORD');
    const name = this.configService.get<string>('ADMIN_NAME') ?? 'Administrador';

    if (!email || !password) {
      return;
    }

    const existing = await this.userModel.findOne({ email }).lean();
    if (existing) {
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await this.userModel.create({
      name,
      email,
      passwordHash,
      role: 'admin',
      active: true,
    });
  }

  async create(dto: CreateUserDto): Promise<User> {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const created = await this.userModel.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      role: dto.role ?? 'user',
      active: true,
    });
    return this.userModel.findById(created._id).lean() as Promise<User>;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().sort({ createdAt: -1 }).lean();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).lean();
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).select('+passwordHash').exec();
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const update: Partial<User> & { passwordHash?: string } = {
      name: dto.name,
      email: dto.email,
      role: dto.role,
      active: dto.active,
    };

    if (dto.password) {
      update.passwordHash = await bcrypt.hash(dto.password, 10);
    }

    const user = await this.userModel
      .findByIdAndUpdate(id, update, { new: true })
      .lean();
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Usuario no encontrado');
    }
  }
}
