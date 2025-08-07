'use client';

import { useState } from 'react';
import UnlockModal from './UnlockModal';

interface UnlockArticleButtonProps {
  articleId: string;
  articleTitle: string;
  points: number;
}

export default function UnlockArticleButton({ articleId, articleTitle, points }: UnlockArticleButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUnlock = async () => {
    try {
      const response = await fetch(`/api/article/${articleId}/unlock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '解锁失败');
      }

      // 解锁成功后刷新页面以显示完整内容
      window.location.reload();
    } catch (error) {
      alert(error instanceof Error ? error.message : '解锁失败，请稍后重试');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
      >
        使用积分解锁
      </button>
      
      <UnlockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleUnlock}
        points={points}
        articleTitle={articleTitle}
      />
    </>
  );
}