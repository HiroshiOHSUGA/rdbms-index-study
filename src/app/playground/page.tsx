'use client';

import { useState } from 'react';
import DataTable from '@/components/DataTable';

interface QueryResult {
  query: string;
  results: any[];
  executionTime: number;
  explain: any[];
}

export default function Playground() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('クエリを入力してください');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/playground', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'クエリの実行に失敗しました');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知のエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>プレイグラウンド</h2>
      <p className="mb-4">
        自由にSELECTクエリを実行して、インデックスの動作を確認できます
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="query"
          >
            クエリ
          </label>
          <textarea
            id="query"
            value={query}
            onChange={handleQueryChange}
            rows={4}
            placeholder="SELECT * FROM user WHERE..."
          />
        </div>
        <button
          type="submit"
          disabled={loading}
        >
          {loading ? '実行中...' : '実行'}
        </button>
      </form>

      {error && (
        <div className="text-error mb-4">
          {error}
        </div>
      )}

      {result && (
        <div>
          <div className="mb-4">
            <h3>実行したクエリ</h3>
            <pre>{result.query}</pre>
            <p className="mt-2">
              実行時間: {result.executionTime}ms
            </p>
          </div>

          <div className="mb-6">
            <h3>実行計画 (EXPLAIN)</h3>
            <DataTable data={result.explain} />
          </div>

          <div>
            <h3>結果</h3>
            <DataTable data={result.results} />
          </div>
        </div>
      )}
    </div>
  );
} 