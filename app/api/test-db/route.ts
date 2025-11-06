import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const startTime = Date.now();
    
    // Test MongoDB connection
    const client = await clientPromise;
    const db = client.db('quiz-platform');
    
    // Get database stats
    const collections = await db.listCollections().toArray();
    const quizzesCount = await db.collection('quizzes').countDocuments();
    const questionsCount = await db.collection('questions').countDocuments();
    const attemptsCount = await db.collection('attempts').countDocuments();
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      stats: {
        collections: collections.map(c => c.name),
        quizzes: quizzesCount,
        questions: questionsCount,
        attempts: attemptsCount,
        responseTime: `${responseTime}ms`,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
