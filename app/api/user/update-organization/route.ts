import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { organization } = await request.json();

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('quizdb');

    await db.collection('users').updateOne(
      { email: session.user.email },
      { $set: { organization, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating organization:', error);
    return NextResponse.json(
      { error: 'Failed to update organization' },
      { status: 500 }
    );
  }
}
