import { NextResponse } from 'next/server';
import { sections, generateMockResults } from '../../../../../../data/sections';

export async function GET(
  request: Request,
  { params }: { params: { section: string, case: string } }
) {
  const sectionIndex = parseInt(params.section) - 1;
  const caseIndex = parseInt(params.case) - 1;
  
  // セクションの範囲チェック
  if (isNaN(sectionIndex) || sectionIndex < 0 || sectionIndex >= sections.length) {
    return NextResponse.json({ error: 'セクションが見つかりません' }, { status: 404 });
  }

  // ケースの範囲チェック
  const section = sections[sectionIndex];
  if (isNaN(caseIndex) || caseIndex < 0 || caseIndex >= section.cases.length) {
    return NextResponse.json({ error: 'ケースが見つかりません' }, { status: 404 });
  }

  const caseItem = section.cases[caseIndex];
  
  // クエリ実行結果を生成
  const queriesWithResults = caseItem.queries.map(query => ({
    ...query,
    ...generateMockResults(query.query)
  }));

  // ケースとその結果を返す
  return NextResponse.json({
    ...caseItem,
    queries: queriesWithResults
  });
} 