import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const client = await clientPromise;
    const db = client.db('quiz-platform');

    const question = {
      question: body.question,
      options: body.options,
      correctAnswer: body.correctAnswer,
      quizId: body.quizId,
      createdAt: new Date(),
    };

    const result = await db.collection('questions').insertOne(question);

    return NextResponse.json({ ...question, _id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
  }
}
