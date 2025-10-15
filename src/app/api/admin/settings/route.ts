// src/app/api/admin/settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';

export async function PUT(request: NextRequest) {
  // Check admin authorization
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    const body = await request.json();
    const {
      siteName,
      siteDescription,
      contactEmail,
      contactPhone,
      address,
      currency,
      currencySymbol,
      taxRate,
    } = body;

    // Validate required fields
    if (!siteName || !siteDescription || !contactEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate tax rate
    if (taxRate < 0 || taxRate > 100) {
      return NextResponse.json(
        { error: 'Tax rate must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Get the first settings record or create one
    let settings = await prisma.settings.findFirst();

    if (settings) {
      // Update existing settings
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: {
          siteName,
          siteDescription,
          contactEmail,
          contactPhone,
          address,
          currency,
          currencySymbol,
          taxRate,
        },
      });
    } else {
      // Create new settings
      settings = await prisma.settings.create({
        data: {
          siteName,
          siteDescription,
          contactEmail,
          contactPhone,
          address,
          currency,
          currencySymbol,
          taxRate,
        },
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
