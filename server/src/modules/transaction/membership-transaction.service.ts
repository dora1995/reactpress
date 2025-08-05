import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MembershipTransaction } from './membership-transaction.entity';
import { UserMembershipService } from '../membership/user-membership.service';

@Injectable()
export class MembershipTransactionService {
  constructor(
    @InjectRepository(MembershipTransaction)
    private readonly transactionRepository: Repository<MembershipTransaction>,
    private readonly userMembershipService: UserMembershipService,
  ) {}

  async create(data: Partial<MembershipTransaction>): Promise<MembershipTransaction> {
    const transaction = this.transactionRepository.create(data);
    return this.transactionRepository.save(transaction);
  }

  async findByUser(userId: string): Promise<MembershipTransaction[]> {
    return this.transactionRepository.find({
      where: { user: { id: userId } },
      relations: ['membershipType'],
      order: { createAt: 'DESC' },
    });
  }

  async findByOrderId(orderId: string): Promise<MembershipTransaction> {
    return this.transactionRepository.findOne({
      where: { orderId },
      relations: ['membershipType'],
    });
  }

  async createTransaction(
    userId: string,
    membershipTypeId: string,
    amount: number,
    paymentMethod: string,
  ): Promise<MembershipTransaction> {
    // 生成订单号
    const orderId = `M${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const transaction = await this.create({
      user: { id: userId } as any,
      membershipType: { id: membershipTypeId } as any,
      amount,
      orderId,
      status: 'pending',
      paymentMethod,
    });

    return transaction;
  }

  async handlePaymentSuccess(
    orderId: string,
    paymentTime: Date = new Date(),
  ): Promise<void> {
    const queryRunner = this.transactionRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const transaction = await this.findByOrderId(orderId);
      if (!transaction || transaction.status !== 'pending') {
        throw new Error('Invalid transaction');
      }

      // 更新交易状态
      transaction.status = 'success';
      transaction.paidAt = paymentTime;
      await queryRunner.manager.save(transaction);

      // 开通会员
      await this.userMembershipService.extendMembership(
        transaction.user.id,
        transaction.membershipType.id,
        paymentTime,
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async handlePaymentFailure(orderId: string): Promise<void> {
    const transaction = await this.findByOrderId(orderId);
    if (transaction && transaction.status === 'pending') {
      transaction.status = 'failed';
      await this.transactionRepository.save(transaction);
    }
  }
}