'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Query {
  id: string;
  name: string;
  query: string;
}

export default function Home() {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQueries() {
      try {
        const response = await fetch('/api/queries');
        if (!response.ok) {
          throw new Error('クエリの取得に失敗しました');
        }
        const data = await response.json();
        setQueries(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '未知のエラーが発生しました');
      } finally {
        setLoading(false);
      }
    }

    fetchQueries();
  }, []);

  if (loading) {
    return <div className="text-center py-8">読み込み中...</div>;
  }

  if (error) {
    return <div className="text-center text-error">エラー: {error}</div>;
  }

  return (
    <div>
      <h2>学習用クエリの一覧</h2>
      <div className="grid">
        {queries.map((query) => (
          <Link
            href={`/${query.id}`}
            key={query.id}
            className="card"
          >
            <h3>{query.name}</h3>
            <pre>
              {query.query}
            </pre>
          </Link>
        ))}
      </div>
    </div>
  );
} 