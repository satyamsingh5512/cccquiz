import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { quizId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('quiz-platform');
    
    // Delete all questions for this quiz
    await db.collection('questions').deleteMany({ quizId: params.quizId });
    
    // Delete all attempts for this quiz
    await db.collection('attempts').deleteMany({ quizId: params.quizId });
    
    // Delete the quiz
    const result = await db.collection('quizzes').deleteOne({ 
      _id: new ObjectId(params.quizId) 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Quiz and all related data deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    return NextResponse.json({ 
      error: 'Failed to delete quiz',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
