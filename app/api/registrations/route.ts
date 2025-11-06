import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('quiz-platform');
    
    const registrations = await db
      .collection('registrations')
      .find({})
      .sort({ registeredAt: -1 })
      .toArray();

    return NextResponse.json(registrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch registrations',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const client = await clientPromise;
    const db = client.db('quiz-platform');

    const registration = {
      name: body.name,
      rollNumber: body.rollNumber,
      email: body.email,
      phone: body.phone || '',
      event: body.event,
      registeredAt: new Date(),
      registeredBy: session.user.email,
    };

    const result = await db.collection('registrations').insertOne(registration);

    return NextResponse.json({ ...registration, _id: result.insertedId });
  } catch (error) {
    console.error('Error creating registration:', error);
    return NextResponse.json({ 
      error: 'Failed to create registration',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
