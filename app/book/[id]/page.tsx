import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import dbConnect from '@/lib/db';
import Book from '@/models/Book';
import styles from './page.module.css';
import PurchaseButton from './PurchaseButton';

export const dynamic = 'force-dynamic';


import { getPresignedUrlFromUrl } from '@/lib/s3';

async function getBook(id: string) {
    await dbConnect();
    try {
        const book = await Book.findById(id).lean() as any;
        if (!book) return null;

        // Sign the cover image
        const signedCover = await getPresignedUrlFromUrl(book.coverImage);

        // Sign preview URLs if they exist
        let signedPreviewUrls: string[] = [];
        if (book.previewUrls && book.previewUrls.length > 0) {
            signedPreviewUrls = await Promise.all(
                book.previewUrls.map((url: string) => getPresignedUrlFromUrl(url))
            );
        }

        return {
            ...book,
            _id: book._id.toString(),
            coverImage: signedCover,
            previewUrls: signedPreviewUrls,
        };
    } catch (error) {
        return null;
    }
}

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    console.log(`[BookPage] Fetching book with ID: ${resolvedParams.id}`);
    const book = await getBook(resolvedParams.id);
    console.log(`[BookPage] Result: ${book ? 'Found' : 'Not Found'}`);

    if (!book) {
        console.error(`[BookPage] Book not found for ID: ${resolvedParams.id}`);
        notFound();
    }

    return (
        <main>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.imageColumn}>
                        <div className={styles.imageWrapper}>
                            <img src={book.coverImage} alt={book.title} className={styles.image} />
                        </div>
                    </div>

                    <div className={styles.infoColumn}>
                        <div className={styles.header}>
                            <h1 className={styles.title}>{book.title}</h1>
                            <div className={styles.metaRow}>
                                <span className={styles.author}>By {book.author}</span>
                                <span className={styles.separator}>•</span>
                                <span className={styles.rating}>★ {book.rating || '4.8'} (120 reviews)</span>
                                <span className={styles.separator}>•</span>
                                <span className={styles.genre}>{book.genre || 'Fiction'}</span>
                            </div>
                        </div>

                        <div className={styles.priceSection}>
                            <span className={styles.price}>${book.price}</span>
                            <span className={styles.originalPrice}>${(book.price * 1.2).toFixed(2)}</span>
                            <span className={styles.discount}>20% OFF</span>
                        </div>

                        <div className={styles.actions}>
                            <PurchaseButton bookId={book._id.toString()} price={book.price} />
                        </div>

                        <div className={styles.description}>
                            <h3>About the Book</h3>
                            <p>{book.description}</p>
                        </div>

                        {book.preview && (
                            <div className={styles.preview}>
                                <h3>Preview</h3>
                                <p>{book.preview}</p>
                            </div>
                        )}

                        {(book.previewUrls?.length > 0 || book.previewUrl) && (
                            <div className={styles.previewSection}>
                                <h3>📖 Peek Inside the Book</h3>
                                <div className={styles.previewFrameWrapper}>
                                    {book.previewUrls?.length > 0 ? (
                                        <div className={styles.previewList}>
                                            {book.previewUrls.map((url: string, index: number) => (
                                                <img
                                                    key={index}
                                                    src={url}
                                                    alt={`Page ${index + 1}`}
                                                    className={styles.previewPage}
                                                />
                                            ))}
                                            <div className={styles.previewOverlay}>
                                                <p>You've reached the end of the free preview.</p>
                                                <div className={styles.overlayActions}>
                                                    <p>Want to read the rest?</p>
                                                    <PurchaseButton bookId={book._id.toString()} price={book.price} />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <iframe
                                                src={`${book.previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                                                className={styles.previewFrame}
                                                title="Book Preview"
                                            />
                                            <div className={styles.previewOverlay}>
                                                <p>This is a free preview (First 4 pages)</p>
                                                <div className={styles.overlayActions}>
                                                    <p>Want to read the full story?</p>
                                                    <PurchaseButton bookId={book._id.toString()} price={book.price} />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
