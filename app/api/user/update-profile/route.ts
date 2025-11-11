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
    const { name, college, clubName } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('quizdb');

    // Build update object with only provided fields
    const updateData: any = {
      name,
      organization: college || clubName || 'Individual', // Set organization for backward compatibility
      updatedAt: new Date(),
    };

    // Add optional fields if provided
    if (college) {
      updateData.college = college;
    }
    if (clubName) {
      updateData.clubName = clubName;
    }

    await db.collection('users').updateOne(
      { email: session.user.email },
      { $set: updateData }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
