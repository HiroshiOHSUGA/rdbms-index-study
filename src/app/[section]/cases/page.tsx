'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Case } from '../../../types';

export default function CasesPage() {
  const params = useParams();
  const router = useRouter();
  const section = params.section as string;

  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCases() {
      try {
        const response = await fetch(`/api/sections/${section}/cases`);
        if (!response.ok) {
          throw new Error('ケースの取得に失敗しました');
        }
        const data = await response.json();
        setCases(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '未知のエラーが発生しました');
      } finally {
        setLoading(false);
      }
    }

    fetchCases();
  }, [section]);

  if (loading) {
    return <div className="text-center py-8">読み込み中...</div>;
  }

  if (error) {
    return <div className="text-center text-error">エラー: {error}</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-4">
        <Link href="/" className="text-blue-500 hover:underline">← セクション一覧に戻る</Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">ケース一覧</h1>

      <div className="space-y-6">
        <ul className="space-y-6">
          {cases.map((caseItem, index) => (
            <li key={index}>
              <Link
                href={`/${section}/cases/${index + 1}`}
                className="block border rounded-lg p-4 hover:bg-gray-50 transition w-full"
              >{caseItem.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 