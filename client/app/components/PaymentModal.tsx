'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCode: string;
  orderId: string;
  onPaymentSuccess: () => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  qrCode,
  orderId,
  onPaymentSuccess,
}: PaymentModalProps) {
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isOpen && orderId) {
      // 每2秒检查一次支付状态
      timer = setInterval(async () => {
        try {
          const response = await fetch(`${process.env.API_URL}/api/recharge/status/${orderId}`);
          const data = await response.json();
          
          if (data.statusCode === 200 && data.data.status === 'PAID') {
            // 支付成功，调用订单完成接口
            await completeOrder();
          }
        } catch (error) {
          console.error('检查支付状态失败:', error);
        }
      }, 2000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isOpen, orderId]);

  const completeOrder = async () => {
    try {
      const response = await fetch(`${process.env.API_URL}/api/payment/complete/${orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      if (data.statusCode === 200) {
        onPaymentSuccess();
        onClose();
      }
    } catch (error) {
      console.error('完成订单失败:', error);
    }
  };

  const handleManualCheck = async () => {
    if (isChecking) return;
    
    setIsChecking(true);
    try {
      const response = await fetch(`${process.env.API_URL}/api/payment/status/${orderId}`);
      const data = await response.json();
      
      if (data.statusCode === 200 && data.data.status === 'PAID') {
        await completeOrder();
      } else {
        alert('支付未完成，请确认支付后再试');
      }
    } catch (error) {
      console.error('检查支付状态失败:', error);
      alert('检查支付状态失败，请稍后再试');
    } finally {
      setIsChecking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">请扫码支付</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex justify-center mb-6">
          <div className="relative w-64 h-64">
            <Image
              src={qrCode}
              alt="支付二维码"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <button
          onClick={handleManualCheck}
          disabled={isChecking}
          className={`w-full py-3 rounded-lg text-white font-semibold ${
            isChecking
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isChecking ? '正在检查支付状态...' : '我已完成支付'}
        </button>
      </div>
    </div>
  );
}