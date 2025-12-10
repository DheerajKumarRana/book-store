'use client';

import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import styles from './offerSection.module.css';

export default function OfferSection() {
    return (
        <section className={styles.section}>
            <div className={styles.grid}>
                {/* Left Book: Game On */}
                <div className={`${styles.bookContainer} ${styles.leftBook}`}>
                    <div className={styles.bookInner}>
                        {/* The Inside Page (Visible when opened) */}
                        <div className={styles.bookInside}>
                            <div className={styles.offerContent}>
                                <h3 className={styles.offerTitle}>OFFER</h3>
                                <p className={styles.offerSubtitle}>Save Upto 20%</p>
                                <Link href="/shop" className={styles.shopLink}>
                                    Shop Now <FiArrowRight />
                                </Link>
                            </div>
                        </div>
                        {/* The Cover (Rotates on hover) */}
                        <div className={styles.bookCover}>
                            <img
                                src="https://images.unsplash.com/photo-1614726365723-49cfae96a6b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                                alt="Game On Cover"
                                className={styles.coverImage}
                            />
                            <div className={styles.coverOverlay}>
                                <h3>GAME ON</h3>
                                <p>CHILL DAYS AS ALWAYS</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center Banner: Deals */}
                <div className={styles.centerBanner}>
                    <div className={styles.bannerContent}>
                        <h2 className={styles.bannerTitle}>Deals</h2>
                        <h3 className={styles.bannerSubtitle}>Buy Fantasy Books</h3>
                        <p className={styles.bannerText}>Get 10% Discount</p>
                        <Link href="/shop" className={styles.bannerBtn}>Shop Now</Link>
                    </div>
                    <img
                        src="https://images.unsplash.com/photo-1518373714866-3f1478910cc0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                        alt="Fantasy Books"
                        className={styles.bannerImage}
                    />
                </div>

                {/* Right Book: Children's Playground */}
                <div className={`${styles.bookContainer} ${styles.rightBook}`}>
                    <div className={styles.bookInner}>
                        {/* The Inside Page (Visible when opened) */}
                        <div className={`${styles.bookInside} ${styles.yellowBg}`}>
                            <div className={styles.offerContent}>
                                <h3 className={`${styles.offerTitle} ${styles.redText}`}>Kid's<br />Collection</h3>
                                <p className={styles.offerSubtitleBlack}>Get 25% Flat Off</p>
                                <Link href="/shop" className={styles.shopLinkBlack}>
                                    <FiArrowRight /> Shop Now
                                </Link>
                            </div>
                        </div>
                        {/* The Cover (Rotates on hover) */}
                        <div className={styles.bookCover}>
                            <img
                                src="https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                                alt="Children's Playground Cover"
                                className={styles.coverImage}
                            />
                            <div className={styles.coverOverlay}>
                                <h3>CHILDRENS'</h3>
                                <h2>PLAYGROUND</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
