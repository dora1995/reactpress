'use client';

import { useState } from 'react';

interface UnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  points: number;
  articleTitle: string;
}

export default function UnlockModal({ isOpen, onClose, onConfirm, points, articleTitle }: UnlockModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('解锁失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          使用积分解锁文章
        </h3>
        <div className="mb-6">
          <p className="text-gray-600 mb-2">文章标题：{articleTitle}</p>
          <p className="text-gray-600">需要消耗 <span className="text-blue-600 font-semibold">{points}</span> 积分</p>
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isLoading}
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            disabled={isLoading}
          >
            {isLoading ? '解锁中...' : '确认解锁'}
          </button>
        </div>
      </div>
    </div>
  );
}