import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// PUT /api/admin/blog/categories/[id] - Update blog category
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
    const { name, nameEn, slug, description, image } = body;

    const category = await prisma.blogCategory.update({
      where: { id: id },
      data: {
        name,
        nameEn,
        slug,
        description,
        image,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating blog category:', error);
    return NextResponse.json(
      { error: 'Failed to update blog category' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/blog/categories/[id] - Delete blog category
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

    // Check if category has posts
    const category = await prisma.blogCategory.findUnique({
      where: { id: id },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    if (category._count.posts > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with existing posts' },
        { status: 400 }
      );
    }

    await prisma.blogCategory.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog category:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog category' },
      { status: 500 }
    );
  }
}
