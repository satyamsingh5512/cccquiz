import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db('quizdb');

    const attempt = {
      quizId: body.quizId,
      quizTitle: body.quizTitle,
      userName: body.userName,
      userEmail: body.userEmail,
      rollNumber: body.rollNumber,
      answers: body.answers,
      score: body.score,
      totalQuestions: body.totalQuestions,
      completedAt: new Date(),
    };

    const result = await db.collection('attempts').insertOne(attempt);

    return NextResponse.json({ ...attempt, _id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save attempt' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only admins can view all attempts
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('quizdb');
    
    const attempts = await db
      .collection('attempts')
      .find({})
      .sort({ completedAt: -1 })
      .toArray();

    return NextResponse.json(attempts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch attempts' }, { status: 500 });
  }
}
