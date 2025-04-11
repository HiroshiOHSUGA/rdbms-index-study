import { NextRequest, NextResponse } from 'next/server';
import { executeWithExplain } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'クエリが指定されていないか無効です' },
        { status: 400 }
      );
    }
    
    // 安全のため、SELECT文のみを許可
    if (!query.trim().toLowerCase().startsWith('select')) {
      return NextResponse.json(
        { error: '安全のため、SELECT文のみが許可されています' },
        { status: 400 }
      );
    }
    
    const result = await executeWithExplain(query);
    
    return NextResponse.json({
      query: result.query,
      results: result.results,
      executionTime: result.executionTime,
      explain: result.explain
    });
  } catch (error) {
    console.error('Error executing custom query:', error);
    return NextResponse.json(
      { error: 'クエリの実行中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 