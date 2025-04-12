'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Section } from '../types';

export default function Home() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSections() {
      try {
        const response = await fetch('/api/sections');
        if (!response.ok) {
          throw new Error('セクションの取得に失敗しました');
        }
        const data = await response.json();
        setSections(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '未知のエラーが発生しました');
      } finally {
        setLoading(false);
      }
    }

    fetchSections();
  }, []);

  if (loading) {
    return <div className="text-center py-8">読み込み中...</div>;
  }

  if (error) {
    return <div className="text-center text-error">エラー: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">SQLインデックス学習</h1>
      <div className="grid gap-4">
        {sections.map((section, index) => (
          <Link
            href={`/${index + 1}/cases`}
            key={index}
            className="block p-4 border rounded-lg hover:bg-gray-50 transition"
          >
            <h2 className="text-xl font-semibold">{section.title}</h2>
            <p className="text-gray-500 mt-2">ケース数: {section.cases.length}</p>
          </Link>
        ))}
      </div>
    </div>
  );
} 