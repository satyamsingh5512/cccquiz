import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('quizdb');
    
    const quizzes = await db
      .collection('quizzes')
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json({ error: 'Failed to fetch quizzes', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const client = await clientPromise;
    const db = client.db('quizdb');

    // Get user from database to get their _id and college info
    const user = await db.collection('users').findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const quiz = {
      title: body.title,
      description: body.description,
      createdBy: session.user.email,
      creatorId: user._id,
      creatorName: user.name || 'Anonymous',
      college: user.college || '',
      clubName: user.clubName || '',
      createdAt: new Date(),
      isActive: true,
      accessCode: body.accessCode || Math.random().toString(36).substring(2, 8).toUpperCase(),
      timerType: body.timerType || 'none',
      timeLimit: body.timeLimit || 0,
      perQuestionTime: body.perQuestionTime || 0,
      allowSkip: body.allowSkip !== undefined ? body.allowSkip : true,
      questionCount: 0,
      participantCount: 0,
    };

    const result = await db.collection('quizzes').insertOne(quiz);

    return NextResponse.json({ ...quiz, _id: result.insertedId });
  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json({ error: 'Failed to create quiz' }, { status: 500 });
  }
}
