import { NextResponse } from 'next/server';
import { getAvailableQueries } from '@/lib/db';

export async function GET() {
  try {
    const queries = await getAvailableQueries();
    return NextResponse.json(queries);
  } catch (error) {
    console.error('Error fetching queries:', error);
    return NextResponse.json(
      { error: 'クエリの取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 