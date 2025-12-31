export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');
        const secret = searchParams.get('secret');

        if (!secret || secret !== process.env.ADMIN_SETUP_SECRET) {
            return NextResponse.json({ message: 'Invalid or missing secret' }, { status: 403 });
        }

        if (!email) {
            return NextResponse.json({ message: 'Email required' }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: 'User not found. Register first.' }, { status: 404 });
        }

        user.role = 'admin';
        await user.save();

        return NextResponse.json({ message: `Success! User ${email} is now an Admin.` });

    } catch (error: any) {
        return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 });
    }
}
