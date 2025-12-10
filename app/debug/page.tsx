import dbConnect from '@/lib/db';
import Book from '@/models/Book';

export const dynamic = 'force-dynamic';

export default async function DebugPage() {
    await dbConnect();
    let books = [];
    let error = '';
    try {
        books = await Book.find({});
    } catch (e: any) {
        error = e.message;
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Debug Page</h1>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            <h2>Book Count: {books.length}</h2>
            <ul>
                {books.map((book: any) => (
                    <li key={book._id.toString()}>
                        <strong>{book.title}</strong> - ID: {book._id.toString()}
                    </li>
                ))}
            </ul>
        </div>
    );
}
