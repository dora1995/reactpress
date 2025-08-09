import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('recharge_record')
export class RechargeRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uid: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  status: number;

  @Column()
  tradeNo: string;

  @Column({ type: 'bigint' })
  updateTime: number;

  @Column({ type: 'bigint' })
  createTime: number;

  @Column('text')
  remark: string;
}