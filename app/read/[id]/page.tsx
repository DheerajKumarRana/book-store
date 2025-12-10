import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Book from '@/models/Book';
import User from '@/models/User';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import SecureViewer from './SecureViewer';

export const dynamic = 'force-dynamic';

async function getBookContent(id: string, userEmail: string) {
    await dbConnect();

    const user = await User.findOne({ email: userEmail });
    if (!user || !user.purchasedBooks.includes(id)) {
        return null; // Not purchased
    }

    const book = await Book.findById(id);
    return book;
}

export default async function ReadPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        redirect('/login');
    }

    const resolvedParams = await params;
    const book = await getBookContent(resolvedParams.id, session.user.email);

    if (!book) {
        redirect(`/book/${resolvedParams.id}`); // Redirect to buy page if not purchased
    }

    return (
        <SecureViewer title={book.title} content={book.fileUrl} />
    );
}
