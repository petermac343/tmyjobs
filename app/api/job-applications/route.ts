import { NextResponse } from 'next/server';
import { JobApplication } from '@/lib/models';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const applications = await JobApplication.findAll({
      where: { user_id: userId },
      order: [['date_applied', 'DESC']],
    });

    const count = applications.length;
    const latestApplication = applications[0];

    return NextResponse.json({ applications, count, latestApplication });
  } catch (error) {
    console.error('Error fetching job applications:', error);
    return NextResponse.json({ error: 'An error occurred while fetching job applications' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const data = await req.json();
  const { userId, ...applicationData } = data;

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const newApplication = await JobApplication.create({
      ...applicationData,
      user_id: userId,
    });

    return NextResponse.json({ message: 'Job application created successfully', application: newApplication });
  } catch (error) {
    console.error('Error creating job application:', error);
    return NextResponse.json({ error: 'An error occurred while creating the job application' }, { status: 500 });
  }
}