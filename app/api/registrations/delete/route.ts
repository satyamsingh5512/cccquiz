import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const registrationId = searchParams.get('id');

    if (!registrationId) {
      return NextResponse.json({ error: 'Registration ID required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('quiz-platform');
    
    const result = await db.collection('registrations').deleteOne({ 
      _id: new ObjectId(registrationId) 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Registration deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting registration:', error);
    return NextResponse.json({ 
      error: 'Failed to delete registration',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
