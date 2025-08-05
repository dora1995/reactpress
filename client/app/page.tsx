import Link from "next/link";
import Header, { NAV_ITEMS } from "./components/Header";

// 为了SEO优化，我们使用 metadata
export const metadata = {
  title: '跨境鱼友圈 - 跨境电商交流平台',
  description: '专业的跨境电商交流平台，提供经验分享、工具支持和行业交流',
  keywords: ['跨境电商', '亚马逊', '电商工具', '跨境交流']
};

// 热门文章数据
const hotArticles = [
  {
    title: '亚马逊测评最新玩法详解',
    description: '深度解析2024年亚马逊测评的有效方法和注意事项',
    date: '2024-03-20',
    views: 1280
  },
  {
    title: '跨境电商物流成本优化指南',
    description: '如何通过多种方式降低物流成本，提高利润率',
    date: '2024-03-18',
    views: 956
  },
  {
    title: '选品进阶技巧分享',
    description: '从市场分析到竞品研究，掌握精准选品方法',
    date: '2024-03-15',
    views: 845
  },
  {
    title: '品牌备案最新政策解读',
    description: '2024年亚马逊品牌备案政策变化及应对策略',
    date: '2024-03-12',
    views: 732
  },
];

// 热门工具数据
const hotTools = [
  {
    title: '跨境收款优化器',
    description: '智能匹配最优收款方式，降低手续费',
    users: 2341
  },
  {
    title: '物流成本计算器',
    description: '快速对比各物流路线的成本和时效',
    users: 1892
  },
  {
    title: '选品利润分析',
    description: '一键计算产品成本、利润及ROI',
    users: 1654
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* 主要内容区 */}
      <main className="pt-20">
        {/* Hero区域 */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  跨境电商交流平台
                </h1>
                <p className="text-xl text-gray-600">
                  使用最新的Web技术，为您提供极致的内容管理体验
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 热门内容区 */}
        <section className="py-10 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {/* 热门文章 - 占据2/3宽度 */}
              <div className="md:col-span-2 bg-white p-4 rounded-lg">
                <h2 className="text-2xl font-bold mb-8">🔥 热门文章</h2>
                <div className="grid gap-6">
                  {hotArticles.map((article, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                          {article.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="mr-4">{article.date}</span>
                          <span>阅读 {article.views}</span>
                        </div>
                      </div>
                      <p className="text-gray-600">{article.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 热门工具 - 占据1/3宽度 */}
              <div className="bg-white p-4 rounded-lg">
                <h2 className="text-2xl font-bold mb-8">🔥 热门工具</h2>
                <div className="grid gap-4">
                  {hotTools.map((tool, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer mb-2">
                        {tool.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">{tool.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{tool.users} 人在用</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="bg-black py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-start">
            <div>
              <h3 className="text-lg font-semibold mb-4">联系我们</h3>
              <p className="text-white">
                邮箱：contact@reactpress.com<br />
                电话：400-123-4567<br />
                地址：深圳市南山区科技园
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 text-center text-white">
            <p>© 2024 ReactPress. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}