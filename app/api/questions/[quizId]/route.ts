import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(
  req: NextRequest,
  { params }: { params: { quizId: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db('quizdb');
    
    const questions = await db
      .collection('questions')
      .find({ quizId: params.quizId })
      .toArray();

    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}
