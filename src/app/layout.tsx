import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RDBMS Index Study',
  description: 'RDBMSのindexの振る舞いを確認・学習できるアプリケーション',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <div className="container">
          <header>
            <h1>
              RDBMS Index Study
            </h1>
            <nav>
              <a href="/">
                ホーム
              </a>
              <a href="/playground">
                プレイグラウンド
              </a>
            </nav>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
} 