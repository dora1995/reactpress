import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Article } from '../../types/article';

// 获取文章详情
async function getArticle(id: string): Promise<Article> {
  const res = await fetch(`${process.env.API_URL}/api/article/${id}?status=publish`, {
    next: { revalidate: 3600 }, // 1小时缓存
  });
  
  if (!res.ok) {
    notFound();
  }
  
  return res.json();
}

// 动态生成元数据
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const article = await getArticle(params.id);
  
  return {
    title: `${article.title} - 跨境鱼友圈`,
    description: article.summary,
    keywords: [
      '跨境电商',
      article.category.name,
      ...article.tags.map(tag => tag.name)
    ],
  };
}

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await getArticle(params.id);

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <article className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* 文章头部 */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
            <div className="flex items-center text-sm text-gray-500 gap-4">
              <time dateTime={article.publishAt}>
                {new Date(article.publishAt).toLocaleDateString()}
              </time>
              <span>阅读 {article.views}</span>
              <span>点赞 {article.likes}</span>
              <span className="text-blue-600">#{article.category.name}</span>
              {article.tags.map((tag) => (
                <span key={tag.id} className="text-gray-500">
                  #{tag.name}
                </span>
              ))}
            </div>
          </header>

          {/* 文章目录 */}
          {article.toc && (
            <div className="bg-gray-50 rounded-lg p-4 mb-8">
              <h2 className="text-lg font-semibold mb-2">目录</h2>
              <div dangerouslySetInnerHTML={{ __html: article.toc }} />
            </div>
          )}

          {/* 文章内容 */}
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.html }}
          />
        </div>
      </article>
    </div>
  );
}