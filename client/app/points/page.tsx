'use client';

import { useState } from 'react';
import Header from '../components/Header';

export default function PointsPage() {
  const [customPoints, setCustomPoints] = useState('');
  const [selectedPoints, setSelectedPoints] = useState<number | null>(null);

  const pointsOptions = [100, 200, 500];

  const handlePointsSelect = (points: number) => {
    setSelectedPoints(points);
    setCustomPoints('');
  };

  const handleCustomPointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setCustomPoints(value);
      setSelectedPoints(null);
    }
  };

  const handleRecharge = async () => {
    const points = selectedPoints || Number(customPoints);
    if (!points) {
      alert('请选择或输入充值积分数量');
      return;
    }

    try {
      // TODO: 实现充值逻辑
      console.log('充值积分:', points);
      // const response = await fetch(`${process.env.API_URL}/api/points/recharge`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify({ points })
      // });
      // const data = await response.json();
      // if (data.statusCode === 200) {
      //   alert('充值成功');
      // } else {
      //   alert(data.message || '充值失败');
      // }
    } catch (error) {
      console.error('充值失败:', error);
      alert('充值失败，请稍后重试');
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-12 mt-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">积分充值</h1>
            <p className="text-gray-600">选择或输入您想要充值的积分数量</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="space-y-8">
              <div className="grid grid-cols-3 gap-4">
                {pointsOptions.map((points) => (
                  <button
                    key={points}
                    onClick={() => handlePointsSelect(points)}
                    className={`p-6 rounded-lg border-2 transition-colors ${
                      selectedPoints === points
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-2xl font-bold mb-1">{points}</div>
                    <div className="text-gray-600">积分</div>
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={customPoints}
                  onChange={handleCustomPointsChange}
                  placeholder="自定义积分数量"
                  className="flex-1 p-4 border-2 rounded-lg focus:outline-none focus:border-blue-600 text-lg"
                />
                <span className="text-gray-600 text-lg">积分</span>
              </div>

              <button
                onClick={handleRecharge}
                disabled={!selectedPoints && !customPoints}
                className={`w-full py-4 rounded-lg text-white font-semibold text-lg transition-colors ${
                  selectedPoints || customPoints
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                立即充值
              </button>

              <div className="text-sm text-gray-500 mt-4">
                <p>充值说明：</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>1积分 = 1元人民币</li>
                  <li>充值成功后积分将立即到账</li>
                  <li>如遇到充值问题，请联系客服</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}