// src/app/api/admin/inventory/alerts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';

// GET - Fetch alerts
export async function GET(request: NextRequest) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const acknowledged = searchParams.get('acknowledged') === 'true';

    const alerts = await prisma.inventoryAlert.findMany({
      where: { acknowledged },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            image: true,
            inventory: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ alerts });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

// PATCH - Acknowledge alert
export async function PATCH(request: NextRequest) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    const body = await request.json();
    const { alertIds } = body;

    if (!Array.isArray(alertIds) || alertIds.length === 0) {
      return NextResponse.json({ error: 'Invalid alert IDs' }, { status: 400 });
    }

    await prisma.inventoryAlert.updateMany({
      where: { id: { in: alertIds } },
      data: {
        acknowledged: true,
        acknowledgedBy: authCheck.session?.user?.id,
        acknowledgedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error acknowledging alerts:', error);
    return NextResponse.json(
      { error: 'Failed to acknowledge alerts' },
      { status: 500 }
    );
  }
}

// DELETE - Clear old acknowledged alerts
export async function DELETE(request: NextRequest) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await prisma.inventoryAlert.deleteMany({
      where: {
        acknowledged: true,
        acknowledgedAt: {
          lt: thirtyDaysAgo,
        },
      },
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.count,
    });
  } catch (error) {
    console.error('Error deleting alerts:', error);
    return NextResponse.json(
      { error: 'Failed to delete alerts' },
      { status: 500 }
    );
  }
}
