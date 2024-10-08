import { NextResponse } from 'next/server';
import { JobApplication } from '@/lib/models';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const application = await JobApplication.findOne({
      where: { id: params.id, user_id: userId },
    });

    if (!application) {
      return NextResponse.json({ error: 'Job application not found' }, { status: 404 });
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error fetching job application:', error);
    return NextResponse.json({ error: 'An error occurred while fetching the job application' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();
  const { userId, ...applicationData } = data;

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const application = await JobApplication.findOne({
      where: { id: params.id, user_id: userId },
    });

    if (!application) {
      return NextResponse.json({ error: 'Job application not found' }, { status: 404 });
    }

    await application.update(applicationData);

    return NextResponse.json({ message: 'Job application updated successfully', application });
  } catch (error) {
    console.error('Error updating job application:', error);
    return NextResponse.json({ error: 'An error occurred while updating the job application' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const application = await JobApplication.findOne({
      where: { id: params.id, user_id: userId },
    });

    if (!application) {
      return NextResponse.json({ error: 'Job application not found' }, { status: 404 });
    }

    await application.destroy();

    return NextResponse.json({ message: 'Job application deleted successfully' });
  } catch (error) {
    console.error('Error deleting job application:', error);
    return NextResponse.json({ error: 'An error occurred while deleting the job application' }, { status: 500 });
  }
}