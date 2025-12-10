import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
    await dbConnect();

    // 1. Create unique test user
    const email = `test_${Date.now()}@example.com`;
    const password = await bcrypt.hash('password123', 10);

    const user = await User.create({
        name: 'Test Logic User',
        email,
        password,
        cart: []
    });

    try {
        const logs = [];

        // 2. Add Book A
        const bookA = "BOOK_ID_A";
        logs.push(`Adding Book A: ${bookA}`);

        user.cart.push({ bookId: bookA, quantity: 1 });
        await user.save();

        logs.push(`Cart after A: ${JSON.stringify(user.cart)}`);

        // 3. Add Book B
        const bookB = "BOOK_ID_B";
        logs.push(`Adding Book B: ${bookB}`);

        // Simulate the logic used in the main API
        const existingIndex = user.cart.findIndex((item: any) => item.bookId === bookB);
        if (existingIndex > -1) {
            user.cart[existingIndex].quantity += 1;
        } else {
            user.cart.push({ bookId: bookB, quantity: 1 });
        }
        await user.save();

        logs.push(`Cart after B: ${JSON.stringify(user.cart)}`);

        // 4. Verify
        const hasA = user.cart.some((i: any) => i.bookId === bookA);
        const hasB = user.cart.some((i: any) => i.bookId === bookB);

        const success = hasA && hasB && user.cart.length === 2;

        return NextResponse.json({
            success,
            cart: user.cart,
            logs
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        // Cleanup
        await User.deleteOne({ _id: user._id });
    }
}
