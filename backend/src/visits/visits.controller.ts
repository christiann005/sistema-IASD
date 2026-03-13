import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../common/current-user.decorator';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';
import { VisitsService } from './visits.service';

@Controller('visits')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Post()
  @Roles('admin')
  create(@Body() dto: CreateVisitDto, @CurrentUser() user: { sub: string }) {
    return this.visitsService.create(dto, user.sub);
  }

  @Get()
  findAll() {
    return this.visitsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.visitsService.findById(id);
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() dto: UpdateVisitDto) {
    return this.visitsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.visitsService.remove(id);
  }
}
