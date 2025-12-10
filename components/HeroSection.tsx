'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from './heroSection.module.css';

const slides = [
    {
        id: 1,
        title: "Discover Your Genre",
        subtitle: "Dignissim urna cursus eget nunc scelerisque viverra mauris in vitae purus faucibus ornare.",
        image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        bgColor: "#f3f4f6"
    },
    {
        id: 2,
        title: "New Releases 2025",
        subtitle: "Explore the latest additions to our collection. Find your next obsession today.",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        bgColor: "#e5e7eb"
    }
];

const featuredBooks = [
    {
        id: 1,
        title: "Footballz",
        author: "Hearthstone",
        price: "12.00",
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    },
    {
        id: 2,
        title: "The Great Adventure",
        author: "J.K. Rowling",
        price: "15.50",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    },
    {
        id: 3,
        title: "Silent Echoes",
        author: "Sarah J. Maas",
        price: "18.99",
        image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    },
    {
        id: 4,
        title: "Urban Jungle",
        author: "Rudyard Kipling",
        price: "10.00",
        image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    },
    {
        id: 5,
        title: "Cosmic Dreams",
        author: "Carl Sagan",
        price: "22.50",
        image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
    }
];

export default function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentBook, setCurrentBook] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Auto-scroll for main banner
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Auto-scroll for featured books
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBook((prev) => (prev + 1) % featuredBooks.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <div className={styles.heroWrapper}>
            {/* Main Banner Slider */}
            <div className={styles.sliderContainer}>
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
                        style={{
                            backgroundImage: `url(${slide.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        <div className={styles.slideOverlay}></div>
                        <div className={styles.slideContent}>
                            <h1 className={styles.title}>{slide.title}</h1>
                            <p className={styles.subtitle}>{slide.subtitle}</p>
                            <Link href="/shop" className={styles.shopBtn}>Shop Now</Link>
                        </div>
                    </div>
                ))}

                <div className={styles.controls}>
                    <button onClick={prevSlide} className={styles.controlBtn}><FiChevronLeft /></button>
                    <button onClick={nextSlide} className={styles.controlBtn}><FiChevronRight /></button>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className={styles.bottomBar}>
                <div className={styles.searchArea}>
                    <div className={styles.searchContent}>
                        <input type="text" placeholder="Search" className={styles.searchInput} />
                    </div>
                    <button className={styles.searchBtn}>
                        Search<br />Now
                    </button>
                </div>

                {mounted && (
                    <div className={styles.featuredArea}>
                        <div className={styles.bookInfo}>
                            <h3 className={styles.bookTitle}>{featuredBooks[currentBook]?.title}</h3>
                            <p className={styles.bookAuthor}>{featuredBooks[currentBook]?.author}</p>
                            <p className={styles.bookPrice}>${featuredBooks[currentBook]?.price}</p>
                            <div className={styles.dots}>
                                {featuredBooks.map((_, idx) => (
                                    <span
                                        key={idx}
                                        className={`${styles.dot} ${idx === currentBook ? styles.activeDot : ''}`}
                                        onClick={() => setCurrentBook(idx)}
                                    ></span>
                                ))}
                            </div>
                        </div>
                        <div className={styles.bookImageWrapper}>
                            <img
                                src={featuredBooks[currentBook]?.image}
                                alt={featuredBooks[currentBook]?.title}
                                className={styles.bookImage}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
