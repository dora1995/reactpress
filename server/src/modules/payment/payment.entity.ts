import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('payment')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: string;

  @Column()
  amount: number;

  @Column()
  title: string;

  @Column()
  redisKey: string;

  @Column()
  status: string; // pending, success, failed

  @Column()
  payType: string; // alipay, wxpay

  @Column()
  payUrl: string;

  @Column()
  qrcode: string;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}