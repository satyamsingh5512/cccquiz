import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

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
      submittedAt: new Date(),
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
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const quizId = searchParams.get('quizId');

    const client = await clientPromise;
    const db = client.db('quizdb');
    
    let query: any = {};
    
    // If quizId is provided, filter by quizId and check ownership
    if (quizId) {
      const quiz = await db.collection('quizzes').findOne({ _id: new ObjectId(quizId) });
      
      // Check if user owns this quiz or is admin
      if (!quiz || (quiz.createdBy !== session.user.email && !session.user.isAdmin)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      query.quizId = quizId;
    } else if (!session?.user?.isAdmin) {
      // Non-admins can only see attempts for their own quizzes
      const userQuizzes = await db.collection('quizzes')
        .find({ createdBy: session.user.email })
        .project({ _id: 1 })
        .toArray();
      
      const quizIds = userQuizzes.map(q => q._id.toString());
      query.quizId = { $in: quizIds };
    }
    
    const attempts = await db
      .collection('attempts')
      .find(query)
      .sort({ submittedAt: -1 })
      .toArray();

    return NextResponse.json(attempts);
  } catch (error) {
    console.error('Error fetching attempts:', error);
    return NextResponse.json({ error: 'Failed to fetch attempts' }, { status: 500 });
  }
}
