import dbConnect from "@/lib/db";
import Book from "@/models/Book";
import Link from 'next/link';

export default async function SearchPage(props: { searchParams: Promise<{ q: string }> }) {
    await dbConnect();
    const searchParams = await props.searchParams;
    const query = searchParams.q || '';

    // Case-insensitive regex search
    const books = await Book.find({
        $or: [
            { title: { $regex: query, $options: 'i' } },
            { author: { $regex: query, $options: 'i' } }
        ]
    }).lean();

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '20px', color: '#333' }}>
                Search Results for "{query}"
            </h1>

            {books.length === 0 ? (
                <p>No books found matching your search.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '30px' }}>
                    {books.map((book: any) => (
                        <Link href={`/book/${book._id}`} key={book._id} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div style={{
                                border: '1px solid #eee',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                transition: 'transform 0.2s',
                                cursor: 'pointer'
                            }}>
                                <div style={{ height: '300px', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <img
                                        src={book.coverImage || '/placeholder.png'}
                                        alt={book.title}
                                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                    />
                                </div>
                                <div style={{ padding: '15px' }}>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '5px', fontWeight: 'bold' }}>{book.title}</h3>
                                    <p style={{ color: '#666', fontSize: '0.9rem' }}>{book.author}</p>
                                    <p style={{ marginTop: '10px', fontWeight: 'bold', color: '#000' }}>
                                        ${book.price}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
