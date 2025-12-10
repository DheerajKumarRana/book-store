'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { FiChevronLeft, FiChevronRight, FiShoppingCart, FiSearch } from 'react-icons/fi';
import styles from './newReleases.module.css';
import bookStyles from './Book3D.module.css';

interface Book {
    _id: string;
    title: string;
    author: string;
    price: number;
    coverImage: string;
    description: string;
}

interface NewReleasesProps {
    books: Book[];
}

export default function NewReleases({ books }: NewReleasesProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

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
            <div id="new-release" className={styles.header}>
                <h2 className={styles.sectionTitle}>New Releases</h2>
                <div className={styles.controls}>
                    <Link href="/new" className={styles.viewAll} style={{ marginRight: '1rem' }}>View All</Link>
                    <button className={styles.arrowBtn} onClick={() => scroll('left')} aria-label="Scroll left"><FiChevronLeft /></button>
                    <button className={styles.arrowBtn} onClick={() => scroll('right')} aria-label="Scroll right"><FiChevronRight /></button>
                </div>
            </div>

            <div className={styles.grid} ref={scrollRef}>
                {books.map((book) => (
                    <div key={book._id} className={bookStyles.card}>
                        <div className={bookStyles.imageWrapper}>
                            <Link href={`/book/${book._id}`} style={{ width: '100%', height: '100%', display: 'block' }}>
                                <img src={book.coverImage} alt={book.title} className={bookStyles.bookImage} />
                            </Link>
                            <div className={bookStyles.pages}></div>
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#333', marginBottom: '0.3rem' }}>{book.title}</h3>
                            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>{book.author}</p>
                            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#fca311' }}>${book.price}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
