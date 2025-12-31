export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const user = await User.findOne({ email: 'dcodewithd_@gmail.com' });
        return NextResponse.json({
            found: !!user,
            role: user?.role,
            email: user?.email,
            id: user?._id
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message });
    }
}
