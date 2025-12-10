'use client';

import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FiShoppingCart, FiHeart, FiSearch, FiRepeat, FiChevronLeft, FiChevronRight, FiCheck } from 'react-icons/fi';
import styles from './mustReadBooks.module.css';
import bookStyles from './Book3D.module.css';
import { useCart } from '@/context/CartContext';

interface Book {
    _id: string;
    title: string;
    author: string;
    price: number;
    coverImage: string;
    discount?: string;
    badge?: string;
    badgeColor?: string;
    originalPrice?: number;
}

interface MustReadBooksProps {
    books: Book[];
}

export default function MustReadBooks({ books }: MustReadBooksProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { addToCart, cart } = useCart();
    const router = useRouter();
    const { data: session } = useSession();
    const [addedBooks, setAddedBooks] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (cart) {
            const added = new Set<string>();
            cart.forEach(item => {
                if (item.bookId) added.add(item.bookId.toString());
            });
            setAddedBooks(added);
        }
    }, [cart]);

    const handleAddToCart = async (bookId: string) => {
        const res = await addToCart(bookId);
        if (res.success) {
            setAddedBooks(prev => new Set(prev).add(bookId));
        }
    };

    const handleQuickView = (bookId: string) => {
        router.push(`/book/${bookId}`);
    };

    const handleCompare = () => {
        alert("Added to Compare list (Feature coming soon!)");
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300;
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.heading}>Must Read Books</h2>
                <div className={styles.controls}>
                    <Link href="/shop" className={styles.shopBtn}>Shop Now</Link>
                    <div className={styles.arrows}>
                        <button className={styles.arrowBtn} onClick={() => scroll('left')}><FiChevronLeft /></button>
                        <button className={styles.arrowBtn} onClick={() => scroll('right')}><FiChevronRight /></button>
                    </div>
                </div>
            </div>

            <div className={styles.contentWrapper}>
                {/* Left Banner */}
                <div className={styles.banner}>
                    <img
                        src="https://images.unsplash.com/photo-1535905557558-afc4877a26fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        alt="Reading"
                        className={styles.bannerImage}
                    />
                    <div className={styles.bannerOverlay}>
                        <h2>Save Upto<br />40%</h2>
                        <p>On Used Books</p>
                    </div>
                </div>

                {/* Right Grid */}
                <div className={styles.grid} ref={scrollRef}>
                    {books && books.length > 0 ? books.map((book) => (
                        <div key={book._id} className={bookStyles.card}>
                            <div className={bookStyles.imageWrapper}>
                                {book.badge && (
                                    <span className={`${styles.badge} ${styles[book.badgeColor || 'yellow']}`}>
                                        {book.badge === 'SOLD OUT' ? (
                                            <span className={styles.soldOutText}>SOLD<br />OUT</span>
                                        ) : book.badge}
                                    </span>
                                )}
                                <img src={book.coverImage} alt={book.title} className={bookStyles.bookImage} />

                                <div className={bookStyles.pages}></div>

                                {/* Hover Actions */}
                                <div className={bookStyles.actionsOverlay}>
                                    <div className={bookStyles.actionButtons}>
                                        <button
                                            className={bookStyles.actionBtn}
                                            title={addedBooks.has(book._id) ? "Added" : "Add to Cart"}
                                            onClick={() => handleAddToCart(book._id)}
                                            disabled={addedBooks.has(book._id)}
                                            suppressHydrationWarning={true}
                                        >
                                            {addedBooks.has(book._id) ? <FiCheck style={{ color: 'green' }} /> : <FiShoppingCart />}
                                        </button>
                                        <button
                                            className={bookStyles.actionBtn}
                                            title="Compare"
                                            onClick={handleCompare}
                                            suppressHydrationWarning={true}
                                        >
                                            <FiRepeat />
                                        </button>
                                        <button
                                            className={bookStyles.actionBtn}
                                            title="Quick View"
                                            onClick={() => handleQuickView(book._id)}
                                        >
                                            <FiSearch />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.details}>
                                <h3 className={styles.title}>{book.title}</h3>
                                <p className={styles.author}>{book.author}</p>
                                <div className={styles.priceRow}>
                                    <span className={styles.price}>${book.price}</span>
                                    {book.originalPrice && (
                                        <span className={styles.originalPrice}>${book.originalPrice}</span>
                                    )}
                                    {book.discount && (
                                        <span className={styles.discount}>({book.discount})</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className={styles.noBooks}>No books available</div>
                    )}
                </div>
            </div>
        </section>
    );
}
