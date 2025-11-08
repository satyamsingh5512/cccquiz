import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

const MAINTENANCE_FILE = path.join(process.cwd(), '.maintenance');

export async function GET() {
  try {
    const isMaintenanceMode = fs.existsSync(MAINTENANCE_FILE);
    return NextResponse.json({ maintenanceMode: isMaintenanceMode });
  } catch (error) {
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

    if (enabled) {
      // Create maintenance file
      fs.writeFileSync(MAINTENANCE_FILE, new Date().toISOString());
    } else {
      // Remove maintenance file
      if (fs.existsSync(MAINTENANCE_FILE)) {
        fs.unlinkSync(MAINTENANCE_FILE);
      }
    }

    return NextResponse.json({ success: true, maintenanceMode: enabled });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to toggle maintenance mode' },
      { status: 500 }
    );
  }
}
