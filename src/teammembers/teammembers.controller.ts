import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TeammembersService } from './teammembers.service';
import { CreateTeammemberDto } from './dto/create-teammember.dto';
import { UpdateTeammemberDto } from './dto/update-teammember.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('teammembers')
export class TeammembersController {
  constructor(private readonly teammembersService: TeammembersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createTeammemberDto: CreateTeammemberDto) {
    return this.teammembersService.create(req.user.merchantId, createTeammemberDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.teammembersService.findAll(req.user.merchantId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.teammembersService.findOne(id, req.user.merchantId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateTeammemberDto: UpdateTeammemberDto) {
    return this.teammembersService.update(id, req.user.merchantId, updateTeammemberDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.teammembersService.remove(id, req.user.merchantId);
  }
}
