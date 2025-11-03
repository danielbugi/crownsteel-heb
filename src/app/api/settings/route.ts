import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get the first (and only) settings record
    let settings = await prisma.settings.findFirst();

    // If no settings exist, create default
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          siteName: 'Forge & Steel',
          siteDescription: "Premium Men's Jewelry",
          contactEmail: 'contact@forgesteel.com',
          contactPhone: '+972-50-123-4567',
          address: 'Online E-commerce Store',
          currency: 'ILS',
          currencySymbol: '₪',
          taxRate: 18,

          // Email Settings
          smtpFromEmail: 'contact@forgesteel.com',
          smtpReplyToEmail: null,
          emailNotificationsEnabled: true,
          adminNotificationEmail: 'admin@forgesteel.com',

          // Shipping Settings
          shippingCost: 20,
          freeShippingThreshold: 350,
          shippingDescription: 'Standard shipping within Israel',
          processingTime: '2-3 business days',
        },
      });
    }

    return NextResponse.json({
      settings: {
        ...settings,
        taxRate: settings.taxRate.toNumber(),
        shippingCost: settings.shippingCost.toNumber(),
        freeShippingThreshold: settings.freeShippingThreshold.toNumber(),
      },
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Get existing settings
    let settings = await prisma.settings.findFirst();

    if (!settings) {
      // Create if doesn't exist
      settings = await prisma.settings.create({
        data: {
          siteName: body.siteName,
          siteDescription: body.siteDescription,
          contactEmail: body.contactEmail,
          contactPhone: body.contactPhone,
          address: body.address,
          currency: body.currency,
          currencySymbol: body.currencySymbol,
          taxRate: parseFloat(body.taxRate),
        },
      });
    } else {
      // Update existing
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: {
          siteName: body.siteName,
          siteDescription: body.siteDescription,
          contactEmail: body.contactEmail,
          contactPhone: body.contactPhone,
          address: body.address,
          currency: body.currency,
          currencySymbol: body.currencySymbol,
          taxRate: parseFloat(body.taxRate),
        },
      });
    }

    return NextResponse.json({
      settings: {
        ...settings,
        taxRate: settings.taxRate.toNumber(),
        shippingCost: settings.shippingCost.toNumber(),
        freeShippingThreshold: settings.freeShippingThreshold.toNumber(),
      },
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
