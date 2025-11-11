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
    
    // Try to find questions with ObjectId first, then fall back to string
    let questions = await db
      .collection('questions')
      .find({ quizId: new ObjectId(params.quizId) })
      .toArray();

    // If no questions found with ObjectId, try with string
    if (questions.length === 0) {
      questions = await db
        .collection('questions')
        .find({ quizId: params.quizId })
        .toArray();
    }

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}
