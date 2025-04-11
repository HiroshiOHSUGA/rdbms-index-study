'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DataTable from '@/components/DataTable';

interface QueryResult {
  id: string;
  name: string;
  query: string;
  results: any[];
  executionTime: number;
  explain: any[];
}

export default function QueryPage() {
  const params = useParams();
  const queryId = params.query_id as string;
  
  const [result, setResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQueryResult() {
      try {
        const response = await fetch(`/api/query/${queryId}`);
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
    }

    fetchQueryResult();
  }, [queryId]);

  if (loading) {
    return <div className="text-center py-8">読み込み中...</div>;
  }

  if (error) {
    return <div className="text-center text-error">エラー: {error}</div>;
  }

  if (!result) {
    return (
      <div className="text-center">
        クエリの結果が見つかりませんでした
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-2">{result.name}</h2>

      <div className="mb-6">
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
  );
} 