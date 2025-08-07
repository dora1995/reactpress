import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Article } from '../../types/article';
import { cookies } from 'next/headers';
import UnlockArticleButton from '../../components/UnlockArticleButton';

// 获取文章详情
async function getArticle(id: string): Promise<Article & { isLocked?: boolean }> {
  // 从cookies中获取token
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  console.log('token', token)
  const res = await fetch(`${process.env.API_URL}/api/article/${id}?status=publish`, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
    // 禁用缓存以确保每次都获取最新的文章状态
    cache: 'no-store',
  });
  
  if (!res.ok) {
    notFound();
  }
  
  const _res = await res.json();
  return _res.data;
}

// 动态生成元数据
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const article = await getArticle(params.id);
  return {
    title: `${article.title} - 跨境鱼友圈`,
    description: article.summary,
  };
}

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await getArticle(params.id);
  
  return (
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
          </div>
        </header>

        {/* 文章内容 */}
        <div className="prose max-w-none">
          {article.isLocked ? (
            <div className="my-8 p-6 bg-gray-50 rounded-lg text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                该文章需要解锁才能阅读完整内容
              </h3>
              <p className="text-gray-600 mb-6">
                您可以通过以下方式解锁文章：
              </p>
              <div className="space-y-4">
                <a
                  href="/membership"
                  className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  开通会员
                </a>
                <div className="text-sm text-gray-500">或</div>
                <UnlockArticleButton
                  articleId={params.id}
                  articleTitle={article.title}
                  points={article.points || 0}
                />
              </div>
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          )}
        </div>
      </div>
    </article>
  );
}