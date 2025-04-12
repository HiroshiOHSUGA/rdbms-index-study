'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Case } from '../../../../types';

// データテーブルコンポーネント
function DataTable({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return <div className="text-gray-500">データがありません</div>;
  }

  // オブジェクトのキーを取得
  const keys = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border">
        <thead>
          <tr className="bg-gray-50">
            {keys.map((key) => (
              <th key={key} className="px-4 py-2 border text-left text-sm font-medium text-gray-700">
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              {keys.map((key) => (
                <td key={`${rowIndex}-${key}`} className="px-4 py-2 border text-sm">
                  {row[key] === null ? <span className="text-gray-400">NULL</span> : String(row[key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// クエリ結果の表示コンポーネント
function QueryResult({ queryData, index }: { queryData: any, index: number }) {
  return (
    <div className="mb-8 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">{queryData.note}</h3>
      <div className="mb-4">
        <h4 className="font-medium mb-1">SQL:</h4>
        <pre className="bg-gray-100 p-3 rounded whitespace-pre-wrap">{queryData.query}</pre>
        <p className="mt-2 text-sm text-gray-600">実行時間: {queryData.executionTime}ms</p>
      </div>
      
      <div className="mb-4">
        <h4 className="font-medium mb-1">実行計画:</h4>
        <DataTable data={queryData.explain} />
      </div>
      
      <div>
        <h4 className="font-medium mb-1">結果:</h4>
        <DataTable data={queryData.results} />
      </div>
    </div>
  );
}

// 比較ビューコンポーネント
function CompareView({ queries }: { queries: any[] }) {
  if (queries.length !== 2) {
    return <div className="text-red-500">比較には2つのクエリが必要です</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {queries.map((query, index) => (
        <div key={index} className="border rounded-lg p-4 h-full">
          <h3 className="text-lg font-semibold mb-2">{query.note}</h3>
          <div className="mb-4">
            <h4 className="font-medium mb-1">SQL:</h4>
            <pre className="bg-gray-100 p-3 rounded whitespace-pre-wrap">{query.query}</pre>
            <p className="mt-2 text-sm text-gray-600">実行時間: {query.executionTime}ms</p>
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium mb-1">実行計画:</h4>
            <DataTable data={query.explain} />
          </div>
          
          <div>
            <h4 className="font-medium mb-1">結果:</h4>
            <DataTable data={query.results} />
          </div>
        </div>
      ))}
    </div>
  );
}

// メインページコンポーネント
export default function CaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const section = params.section as string;
  const caseId = params.case as string;
  
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCaseData() {
      try {
        const response = await fetch(`/api/sections/${section}/cases/${caseId}`);
        if (!response.ok) {
          throw new Error('ケースデータの取得に失敗しました');
        }
        const data = await response.json();
        setCaseData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '未知のエラーが発生しました');
      } finally {
        setLoading(false);
      }
    }

    fetchCaseData();
  }, [section, caseId]);

  if (loading) {
    return <div className="text-center py-8">読み込み中...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">エラー: {error}</div>;
  }

  if (!caseData) {
    return <div className="text-center">ケースデータが見つかりませんでした</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-4">
        <Link href={`/${section}/cases`} className="text-blue-500 hover:underline">← ケース一覧に戻る</Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-2">{caseData.title}</h1>
      <p className="mb-6 text-gray-500">タイプ: {caseData.type === 'single' ? '単一クエリ' : '比較クエリ'}</p>
      
      {caseData.type === 'single' ? (
        caseData.queries.map((query: any, index: number) => (
          <QueryResult key={index} queryData={query} index={index} />
        ))
      ) : (
        <CompareView queries={caseData.queries} />
      )}
    </div>
  );
} 