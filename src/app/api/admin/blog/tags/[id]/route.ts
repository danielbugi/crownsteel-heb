import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// PUT /api/admin/blog/tags/[id] - Update blog tag
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, slug } = body;

    const tag = await prisma.blogTag.update({
      where: { id: id },
      data: {
        name,
        slug,
      },
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error('Error updating blog tag:', error);
    return NextResponse.json(
      { error: 'Failed to update blog tag' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/blog/tags/[id] - Delete blog tag
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.blogTag.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog tag:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog tag' },
      { status: 500 }
    );
  }
}
