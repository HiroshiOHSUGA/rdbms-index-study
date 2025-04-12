import { NextResponse } from 'next/server';
import { sections } from '../../../../../../data/sections';
import { executeWithExplain } from '../../../../../../lib/db';

export async function GET(
  request: Request,
  { params }: { params: { section: string, case: string } }
) {
  const { section, case: caseId } = await params;
  const sectionIndex = parseInt(section) - 1;
  const caseIndex = parseInt(caseId) - 1;
  
  // セクションの範囲チェック
  if (isNaN(sectionIndex) || sectionIndex < 0 || sectionIndex >= sections.length) {
    return NextResponse.json({ error: 'セクションが見つかりません' }, { status: 404 });
  }

  // ケースの範囲チェック
  const sectionData = sections[sectionIndex];
  if (isNaN(caseIndex) || caseIndex < 0 || caseIndex >= sectionData.cases.length) {
    return NextResponse.json({ error: 'ケースが見つかりません' }, { status: 404 });
  }

  const caseItem = sectionData.cases[caseIndex];
  
  // 並列実行せず、一件ずつSQLクエリを順番に実行
  const queriesWithResults = [];
  for (const query of caseItem.queries) {
    // クエリのパラメータがある場合の処理（?の部分を適切な値に置き換える）
    // パラメータの値は実際のユースケースによって異なるため、ここではサンプル値を使用
    const queryParams: any[] = [];
    const processedQuery = query.query.replace(/\?/g, () => {
      // サンプルパラメータ - 実際のアプリケーションでは適切なパラメータを指定する
      queryParams.push(1); // ここでは単純に1を使用
      return '?';
    });
    
    // SQLクエリを実行して結果を取得
    const results = await executeWithExplain(processedQuery, queryParams);
    
    queriesWithResults.push({
      ...query,
      ...results
    });
  }

  // ケースとその結果を返す
  return NextResponse.json({
    ...caseItem,
    queries: queriesWithResults
  });
} 