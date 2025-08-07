export interface MembershipType {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // 会员时长（天）
  features: string[]; // 会员特权
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}