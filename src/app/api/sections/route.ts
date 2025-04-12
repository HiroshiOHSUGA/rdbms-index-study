import { NextResponse } from 'next/server';
import { sections } from '../../../data/sections';

export async function GET() {
  return NextResponse.json(sections);
} 