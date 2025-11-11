import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  req: NextRequest,
  { params }: { params: { quizId: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db('quizdb');
    
    const quiz = await db
      .collection('quizzes')
      .findOne({ _id: new ObjectId(params.quizId) });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    return NextResponse.json(quiz);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch quiz' }, { status: 500 });
  }
}
