import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { UserMembership } from './user-membership.entity';
import { MembershipTypeService } from './membership-type.service';

@Injectable()
export class UserMembershipService {
  constructor(
    @InjectRepository(UserMembership)
    private readonly userMembershipRepository: Repository<UserMembership>,
    private readonly membershipTypeService: MembershipTypeService,
  ) {}

  async create(data: Partial<UserMembership>): Promise<UserMembership> {
    const membership = this.userMembershipRepository.create(data);
    return this.userMembershipRepository.save(membership);
  }

  async findByUser(userId: string): Promise<UserMembership[]> {
    return this.userMembershipRepository.find({
      where: { user: { id: userId } },
      relations: ['membershipType'],
      order: { createAt: 'DESC' },
    });
  }

  async findActiveByUser(userId: string): Promise<UserMembership | null> {
    const now = new Date();
    return this.userMembershipRepository.findOne({
      where: {
        user: { id: userId },
        expireAt: MoreThan(now),
        isActive: true,
      },
      relations: ['membershipType'],
    });
  }

  async checkUserMembership(userId: string): Promise<boolean> {
    const activeMembership = await this.findActiveByUser(userId);
    return !!activeMembership;
  }

  async extendMembership(
    userId: string,
    membershipTypeId: string,
    startAt: Date = new Date(),
  ): Promise<UserMembership> {
    // 获取会员类型
    const membershipType = await this.membershipTypeService.findOne(membershipTypeId);
    if (!membershipType) {
      throw new Error('会员类型不存在');
    }

    // 计算过期时间
    const expireAt = new Date(startAt);
    expireAt.setDate(expireAt.getDate() + membershipType.duration);

    // 创建新的会员记录
    const membership = await this.create({
      user: { id: userId } as any,
      membershipType,
      startAt,
      expireAt,
      isActive: true,
    });

    // 将用户之前的有效会员设置为无效
    await this.userMembershipRepository.update(
      {
        user: { id: userId } as any,
        id: membership.id,
        isActive: true,
      },
      { isActive: false },
    );

    return membership;
  }

  async deactivateExpiredMemberships(): Promise<void> {
    const now = new Date();
    await this.userMembershipRepository.update(
      {
        expireAt: LessThan(now),
        isActive: true,
      },
      { isActive: false },
    );
  }
}