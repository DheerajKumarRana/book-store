import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import dbConnect from '@/lib/db';
import Book from '@/models/Book';
import Link from 'next/link';
import styles from './ranking.module.css';

export const dynamic = 'force-dynamic';

async function getRankedBooks() {
    await dbConnect();
    // Sort by sold count descending
    const books = await Book.find({}).sort({ sold: -1 }).limit(20);
    return books;
}

export default async function RankingPage() {
    const books = await getRankedBooks();

    return (
        <main>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Best Selling Books</h1>
                    <p>The most popular books this week based on sales and views.</p>
                </div>

                <div className={styles.list}>
                    {books.map((book, index) => (
                        <Link href={`/book/${book._id}`} key={book._id.toString()} className={styles.card}>
                            <div className={styles.rank}>#{index + 1}</div>
                            <div className={styles.imageWrapper}>
                                <img src={book.coverImage} alt={book.title} className={styles.image} />
                            </div>
                            <div className={styles.info}>
                                <h2 className={styles.title}>{book.title}</h2>
                                <p className={styles.author}>by {book.author}</p>
                                <div className={styles.stats}>
                                    <span className={styles.stat}>🔥 {book.sold} Sold</span>
                                    <span className={styles.stat}>👁️ {book.views} Views</span>
                                    <span className={styles.stat}>★ {book.rating || '4.5'}</span>
                                </div>
                                <p className={styles.description}>{book.description.substring(0, 100)}...</p>
                            </div>
                            <div className={styles.price}>
                                ${book.price}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <Footer />
        </main>
    );
}
