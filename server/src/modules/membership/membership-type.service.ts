import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MembershipType } from './membership-type.entity';

@Injectable()
export class MembershipTypeService {
  constructor(
    @InjectRepository(MembershipType)
    private readonly membershipTypeRepository: Repository<MembershipType>,
  ) {}

  async create(data: Partial<MembershipType>): Promise<MembershipType> {
    const membershipType = this.membershipTypeRepository.create(data);
    return this.membershipTypeRepository.save(membershipType);
  }

  async findAll(): Promise<MembershipType[]> {
    return this.membershipTypeRepository.find({
      order: {
        createAt: 'DESC',
      },
    });
  }

  async findActive(): Promise<MembershipType[]> {
    return this.membershipTypeRepository.find({
      where: {
        isActive: true,
      },
      order: {
        price: 'ASC',
      },
    });
  }

  async findOne(id: string): Promise<MembershipType> {
    return this.membershipTypeRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, data: Partial<MembershipType>): Promise<MembershipType> {
    await this.membershipTypeRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.membershipTypeRepository.delete(id);
  }
}