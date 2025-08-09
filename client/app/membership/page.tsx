'use client';

import { useEffect, useState } from 'react';
import { MembershipType } from '../types/membership';
import Header from '../components/Header';
import PaymentModal from '../components/PaymentModal';

export default function MembershipPage() {
  const [membershipTypes, setMembershipTypes] = useState<MembershipType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    fetchMembershipTypes();
  }, []);

  const fetchMembershipTypes = async () => {
    try {
      const response = await fetch(`${process.env.API_URL}/api/membership-type/active`);
      const res = await response.json();
      if (res.statusCode === 200) {
        setMembershipTypes(res.data.map((item: any) => {
          return {
            ...item,
            features: item.description?.split(';') || []
          }
        }));
      } else {
        setMembershipTypes([]);
      }
    } catch (error) {
      console.error('获取会员类型失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (typeId: string) => {
    try {
      const response = await fetch(`${process.env.API_URL}/api/recharge/membership`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType: typeId,
          payType: 'wechat', // 默认使用微信支付
        }),
      });

      const data = await response.json();
      if (data.code === 200) {
        setCurrentOrderId(data.data.orderId);
        setQrCodeUrl(data.data.qrCode);
        setIsPaymentModalOpen(true);
      } else {
        alert('创建订单失败，请稍后再试');
      }
    } catch (error) {
      console.error('创建订单失败:', error);
      alert('创建订单失败，请稍后再试');
    }
  };

  const handlePaymentSuccess = async () => {
    // 刷新会员状态或其他需要更新的数据
    alert('支付成功！');
    // 可以选择刷新页面或更新用户状态
    window.location.reload();
  };



  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-12 mt-16">
        {/* 会员介绍部分 */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">会员开通</h1>
            <p className="text-gray-600">选择适合您的会员计划，开启赚钱之旅</p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {membershipTypes.map((type) => {
              const year = type.duration / 365;
              const showYear = year == 1 ? `/年` : year >= 100 ? '' : `/${year}年`;
              return (
              <div
                key={type.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1rem)]"
              >
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="text-2xl font-bold mb-4">{type.name}</h2>
                  <div className="text-4xl font-bold mb-6">
                    ¥{type.price}
                    <span className="text-base font-normal text-gray-600">
                      {showYear}
                    </span>
                  </div>
                  <div className="space-y-3 flex-1">
                    {type.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <svg
                          className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="flex-1">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-6 bg-gray-50">
                  <button
                    onClick={() => handlePurchase(type.id)}
                    className="w-full bg-blue-600 text-white rounded-md py-3 font-semibold hover:bg-blue-700 transition-colors duration-300 cursor-pointer"
                  >
                    立即开通
                  </button>
                </div>
              </div>
            )})}
          </div>
        </div>
      </div>
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        qrCode={qrCodeUrl}
        orderId={currentOrderId}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
}