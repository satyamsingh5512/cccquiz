import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('quizdb');
    
    const settings = await db.collection('settings').findOne({ key: 'maintenance' });
    const isMaintenanceMode = settings?.enabled || false;
    
    return NextResponse.json({ maintenanceMode: isMaintenanceMode });
  } catch (error) {
    console.error('Error checking maintenance mode:', error);
    return NextResponse.json({ maintenanceMode: false });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { enabled } = await request.json();
    
    const client = await clientPromise;
    const db = client.db('quizdb');
    
    await db.collection('settings').updateOne(
      { key: 'maintenance' },
      { 
        $set: { 
          enabled,
          updatedAt: new Date(),
          updatedBy: session.user.email
        } 
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, maintenanceMode: enabled });
  } catch (error) {
    console.error('Error toggling maintenance mode:', error);
    return NextResponse.json(
      { error: 'Failed to toggle maintenance mode', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
