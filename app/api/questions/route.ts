import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const client = await clientPromise;
    const db = client.db('quizdb');

    const quizId = new ObjectId(body.quizId);

    const question = {
      question: body.question,
      options: body.options,
      correctAnswer: body.correctAnswer,
      quizId: quizId,
      createdAt: new Date(),
    };

    const result = await db.collection('questions').insertOne(question);

    // Update quiz question count
    await db.collection('quizzes').updateOne(
      { _id: quizId },
      { $inc: { questionCount: 1 } }
    );

    return NextResponse.json({ ...question, _id: result.insertedId });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
  }
}
