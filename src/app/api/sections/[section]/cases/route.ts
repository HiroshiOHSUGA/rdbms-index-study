import { NextResponse } from 'next/server';
import { sections } from '../../../../../data/sections';

export async function GET(
  request: Request,
  { params }: { params: { section: string } }
) {
  const sectionIndex = parseInt(params.section) - 1;
  
  // インデックスの範囲チェック
  if (isNaN(sectionIndex) || sectionIndex < 0 || sectionIndex >= sections.length) {
    return NextResponse.json({ error: 'セクションが見つかりません' }, { status: 404 });
  }

  return NextResponse.json(sections[sectionIndex].cases);
} 