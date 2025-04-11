import { NextRequest, NextResponse } from 'next/server';
import { executeWithExplain, getAvailableQueries } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // paramsを使用する前にawaitする必要はありませんが、
    // idをconst宣言する前に存在確認を行うべきです
    if (!params || !params.id) {
      return NextResponse.json(
        { error: 'IDが指定されていません' },
        { status: 400 }
      );
    }
    
    const id = params.id;
    
    // 事前定義されたクエリの取得
    const availableQueries = await getAvailableQueries();
    const queryItem = availableQueries.find(q => q.id === id);
    
    if (!queryItem) {
      return NextResponse.json(
        { error: '指定されたIDのクエリが見つかりません' },
        { status: 404 }
      );
    }
    
    // クエリの実行と実行計画の取得
    const result = await executeWithExplain(queryItem.query);
    
    return NextResponse.json({
      id: queryItem.id,
      name: queryItem.name,
      query: result.query,
      results: result.results,
      executionTime: result.executionTime,
      explain: result.explain
    });
  } catch (error) {
    console.error('Error executing query:', error);
    return NextResponse.json(
      { error: 'クエリの実行中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 