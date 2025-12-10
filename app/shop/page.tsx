import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import dbConnect from '@/lib/db';
import Book from '@/models/Book';
import styles from './shop.module.css';

export const dynamic = 'force-dynamic';


import { getPresignedUrlFromUrl } from '@/lib/s3';

async function getAllBooks() {
    try {
        await dbConnect();
        const books = await Book.find({}).sort({ createdAt: -1 }).lean();

        // Process books to sign URLs
        const booksWithSignedUrls = await Promise.all(books.map(async (book: any) => ({
            ...book,
            _id: book._id.toString(),
            coverImage: await getPresignedUrlFromUrl(book.coverImage),
        })));

        return booksWithSignedUrls;
    } catch (error) {
        console.error("Failed to fetch books:", error);
        return [];
    }
}

export default async function ShopPage() {
    const books = await getAllBooks();

    return (
        <>
            <Navbar />
            <main>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>All Books</h1>
                        <p className={styles.subtitle}>Browse our complete collection of stories</p>
                    </div>

                    <div className={styles.grid}>
                        {books.map((book) => (
                            <Link href={`/book/${book._id}`} key={book._id} className={styles.card}>
                                <div className={styles.imageWrapper}>
                                    <img
                                        src={book.coverImage}
                                        alt={book.title}
                                        className={styles.bookImage}
                                    />
                                    {/* Optional: Add badge logic here if data exists */}
                                    <div className={styles.pages}></div>
                                </div>
                                <div className={styles.cardContent}>
                                    <h3 className={styles.bookTitle}>{book.title}</h3>
                                    <p className={styles.bookAuthor}>{book.author}</p>
                                    <div className={styles.bookFooter}>
                                        <span className={styles.price}>${book.price}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
                <Footer />
            </main>
        </>
    );
}
