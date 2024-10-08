import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { User } from '@/lib/models';

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();
    const hashedPassword = await hash(password, 12);

    const user = await User.create({
      user_name: username,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ message: 'User created successfully', user: { id: user.id, email: user.email } });
  } catch (error) {
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}