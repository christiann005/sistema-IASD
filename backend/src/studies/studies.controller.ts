import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../common/current-user.decorator';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { CreateStudyDto } from './dto/create-study.dto';
import { UpdateStudyDto } from './dto/update-study.dto';
import { StudiesService } from './studies.service';

@Controller('studies')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class StudiesController {
  constructor(private readonly studiesService: StudiesService) {}

  @Post()
  @Roles('admin')
  create(@Body() dto: CreateStudyDto, @CurrentUser() user: { sub: string }) {
    return this.studiesService.create(dto, user.sub);
  }

  @Get()
  findAll() {
    return this.studiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studiesService.findById(id);
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() dto: UpdateStudyDto) {
    return this.studiesService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.studiesService.remove(id);
  }
}
