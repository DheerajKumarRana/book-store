import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { logCart } from "@/lib/logger";
import Book from "@/models/Book";
// Force rebuild check

// ... imports

const mongoose = require('mongoose');

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ cart: [] });

        await dbConnect();
        // @ts-ignore
        const user = await User.findById(session.user.id);

        // Cleanup: Filter out null/undefined/empty IDs from cart
        if (user && user.cart) {
            let changed = false;
            const validCart = user.cart.filter((item: any) => {
                const isValidId = item.bookId &&
                    item.bookId !== 'undefined' &&
                    item.bookId !== '[object Object]' &&
                    mongoose.Types.ObjectId.isValid(item.bookId); // Check for valid ObjectId
                return isValidId;
            });

            if (validCart.length !== user.cart.length) {
                user.cart = validCart;
                await user.save();
            }
        }

        const cartItems = user?.cart || [];

        // Populate book details
        // Only query for valid ObjectIds
        const bookIds = cartItems
            .map((item: any) => item.bookId)
            .filter((id: any) => mongoose.Types.ObjectId.isValid(id));

        const books = await Book.find({ _id: { $in: bookIds } });

        const populatedCart = cartItems.map((item: any) => {
            const book = books.find((b: any) => b._id.toString() === item.bookId.toString());
            if (!book) return null;
            return {
                bookId: item.bookId,
                quantity: item.quantity,
                title: book.title,
                price: book.price,
                image: book.coverImage,
                author: book.author
            };
        }).filter(Boolean);

        return NextResponse.json({ cart: populatedCart });
    } catch (error: any) {
        console.error("Cart GET Error Detailed:", error);
        return NextResponse.json({ cart: [], message: "Failed to fetch cart", error: error.message }, { status: 500 });
    }
}

// Helper to get fresh cart
async function getCart(userId: string) {
    try {
        // @ts-ignore
        const user = await User.findById(userId);

        if (user && user.cart) {
            // Populate
            const cartItems = user.cart;
            const bookIds = cartItems.map((item: any) => item.bookId);
            const books = await Book.find({ _id: { $in: bookIds } });

            return cartItems.map((item: any) => {
                const book = books.find((b: any) => b._id.toString() === item.bookId.toString());
                if (!book) return null;
                return {
                    bookId: item.bookId,
                    quantity: item.quantity,
                    title: book.title,
                    price: book.price,
                    image: book.coverImage,
                    author: book.author
                };
            }).filter(Boolean);
        }
        return [];
    } catch (error) {
        console.error("getCart Helper Error:", error);
        return [];
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        await dbConnect();

        const body = await req.json();
        const { bookId, quantity = 1, action = 'add' } = body;

        // @ts-ignore
        const userId = session.user.id;
        console.log(`[Cart API] POST request. UserId: ${userId}, Action: ${action}, BookId: ${bookId}`);

        if (!userId) {
            console.error("[Cart API] Error: User ID is missing in session");
            return NextResponse.json({ message: "User ID missing" }, { status: 401 });
        }

        logCart(`Action: ${action} | Book: ${bookId}`, { userId });

        if (action === 'add') {
            // 1. Try to increment if exists
            // @ts-ignore
            const updated = await User.findOneAndUpdate(
                { _id: userId, "cart.bookId": bookId.toString() },
                { $inc: { "cart.$.quantity": quantity } }
            );

            // 2. If not found (updated is null), push new item
            if (!updated) {
                await User.findByIdAndUpdate(userId, {
                    $push: {
                        cart: { bookId: bookId.toString(), quantity: quantity }
                    }
                });
            }
        } else if (action === 'update') {
            await User.findOneAndUpdate(
                { _id: userId, "cart.bookId": bookId.toString() },
                { $set: { "cart.$.quantity": quantity } }
            );
        } else if (action === 'remove') {
            await User.findByIdAndUpdate(userId, {
                $pull: { cart: { bookId: bookId.toString() } }
            });
        }

        const newCart = await getCart(userId);
        return NextResponse.json({ cart: newCart, message: "Cart updated" });

    } catch (error: any) {
        console.error("Cart POST API Error:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}
