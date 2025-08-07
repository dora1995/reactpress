import { Metadata } from 'next';
import { Category, Article } from '../types/article';
import Header from '../components/Header';
import Link from 'next/link';

// 为了SEO优化
export const metadata: Metadata = {
  title: '经验文章 - 跨境鱼友圈',
  description: '分享跨境电商经验，助力卖家成长',
  keywords: ['跨境电商', '经验分享', '亚马逊', '电商教程'],
};

// 获取分类列表
async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${process.env.API_URL}/api/category`);
  const data = await res.json()
  console.log('getCategories', data)
  return data.data
}

// 获取分类下的文章
async function getArticlesByCategory(categoryId?: string): Promise<{data: Article[], total: number}> {
  const url = categoryId 
    ? `${process.env.API_URL}/api/article/category/${categoryId}?page=1&pageSize=100&status=publish`
    : `${process.env.API_URL}/api/article?page=1&pageSize=100&status=publish`;
  
  const res = await fetch(url);
  const data = await res.json()
  console.log('getArticlesByCategory', data)
  return data.data
}

export default async function ArticlesPage({
  searchParams: { category },
}: {
  searchParams: { category?: string };
}) {

  console.log('category', category)
  // 并行获取数据
  const [categoriesData, articlesData] = await Promise.all([
    getCategories(),
    getArticlesByCategory(category),
  ]);
  const categories = categoriesData;
  const articles = articlesData.data;

  const handleArticleClick = (article: Article) => {
    // 用新页面打开
    window.open(`/articles/${article.id}`, '_blank');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* 分类导航 */}
        <div className="bg-white rounded-lg p-4 mb-8 shadow-sm">
          <div className="flex flex-wrap gap-4">
            <a
              href="/articles"
              className={`px-4 py-2 rounded-full transition-colors ${
                !category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              全部
            </a>
            {categories.map((_category) => (
              <a
                key={_category.id}
                href={`/articles?category=${_category.id}`}
                className={`px-4 py-2 rounded-full transition-colors ${
                  category === _category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {_category.label}
              </a>
            ))}
          </div>
        </div>

        {/* 文章列表 */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link href={`/articles/${article.id}`} key={article.id}>
                <article
                  key={article.id}
                  className="cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col relative"
                >
                  <div className="p-4 flex flex-col flex-1">
                    <h2 className="text-lg font-semibold mb-3 line-clamp-2 hover:text-blue-600">
                      {article.title}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-4">
                      {article.summary || '暂无描述'}
                    </p>
                    <div className="pt-4 flex items-center justify-between text-xs text-gray-500">
                      <span>{new Date(article.publishAt).toLocaleDateString()}</span>
                      <div className="flex items-center gap-3">
                        <span>阅读 {article.views}</span>
                      </div>
                    </div>
                  </div>
                  {article.needVip && (
                    <div className="text-white absolute top-0 -right-2 bg-yellow-600 rounded-full px-2 py-1 text-xs">会员专享</div>
                  )}
                  {article.points > 0 && (
                    <div className="text-white absolute top-0 -right-2 bg-green-600 rounded-full px-2 py-1 text-xs">{article.points} 积分</div>
                  )}
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-500 mb-4">暂无相关文章</div>
            <a href="/articles" className="text-blue-600 hover:text-blue-700">
              返回全部文章
            </a>
          </div>
        )}
      </div>
    </div>
  );
}