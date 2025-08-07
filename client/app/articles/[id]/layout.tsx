import Header from '../../components/Header';

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-24">
        {children}
      </main>
    </div>
  );
}