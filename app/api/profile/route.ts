import { NextResponse } from 'next/server';
import { Profile } from '@/lib/models';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const profile = await Profile.findOne({ where: { user_id: userId } });
    return NextResponse.json(profile || {});
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'An error occurred while fetching the profile' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const data = await req.json();
  const { userId, ...profileData } = data;

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const [profile, created] = await Profile.findOrCreate({
      where: { user_id: userId },
      defaults: { ...profileData, user_id: userId },
    });

    if (!created) {
      await profile.update(profileData);
    }

    return NextResponse.json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'An error occurred while updating the profile' }, { status: 500 });
  }
}