import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { MembershipTypeService } from './membership-type.service';
import { MembershipType } from './membership-type.entity';

@ApiTags('会员类型')
@Controller('membership-type')
export class MembershipTypeController {
  constructor(private readonly membershipTypeService: MembershipTypeService) {}

  @ApiOperation({ summary: '创建会员类型' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() data: Partial<MembershipType>): Promise<MembershipType> {
    return this.membershipTypeService.create(data);
  }

  @ApiOperation({ summary: '获取所有会员类型' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll(): Promise<MembershipType[]> {
    return this.membershipTypeService.findAll();
  }

  @ApiOperation({ summary: '获取激活的会员类型' })
  @Get('active')
  async findActive(): Promise<MembershipType[]> {
    return this.membershipTypeService.findActive();
  }

  @ApiOperation({ summary: '获取指定会员类型' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<MembershipType> {
    return this.membershipTypeService.findOne(id);
  }

  @ApiOperation({ summary: '更新会员类型' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<MembershipType>,
  ): Promise<MembershipType> {
    return this.membershipTypeService.update(id, data);
  }

  @ApiOperation({ summary: '删除会员类型' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.membershipTypeService.remove(id);
  }
}