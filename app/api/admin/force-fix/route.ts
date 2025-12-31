export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET() {
    try {
        await dbConnect();

        // Hardcoded fix for the user's specific email
        const user = await User.findOneAndUpdate(
            { email: 'dcodewithd_@gmail.com' },
            { role: 'admin' },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ message: 'User dcodewithd_@gmail.com not found!' });
        }

        return NextResponse.json({
            message: 'FIX SUCCESSFUL! You are now an Admin.',
            user: { email: user.email, role: user.role }
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message });
    }
}
