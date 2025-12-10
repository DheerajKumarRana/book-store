import Link from 'next/link';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiSend } from 'react-icons/fi';
import styles from './footer.module.css';

export default function Footer() {
    return (
        <div className={styles.footerWrapper}>
            {/* Wave Divider */}
            <div className={styles.waveContainer}>
                <svg className={styles.waveSvg} viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className={styles.wavePath}></path>
                </svg>
            </div>

            <footer className={styles.footer}>
                <div className={styles.container}>
                    {/* Brand Column */}
                    <div className={styles.brandColumn}>
                        <Link href="/" className={styles.logo}>
                            <img src="/logo.png" alt="Read Shop" className={styles.logoImage} />
                        </Link>
                        <p className={styles.slogan}>
                            Your gateway to a world of stories. Discover, read, and connect with millions of book lovers worldwide.
                        </p>
                        <div className={styles.socialIcons}>
                            <a href="#" className={styles.socialBtn} aria-label="Facebook"><FiFacebook /></a>
                            <a href="#" className={styles.socialBtn} aria-label="Instagram"><FiInstagram /></a>
                            <a href="#" className={styles.socialBtn} aria-label="Twitter"><FiTwitter /></a>
                            <a href="#" className={styles.socialBtn} aria-label="YouTube"><FiYoutube /></a>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className={styles.column}>
                        <h3 className={styles.columnTitle}>Shop</h3>
                        <div className={styles.linkList}>
                            <Link href="/shop" className={styles.footerLink}>All Books</Link>
                            <Link href="/new" className={styles.footerLink}>New Arrivals</Link>
                            <Link href="/bestsellers" className={styles.footerLink}>Best Sellers</Link>
                            <Link href="/deals" className={styles.footerLink}>Deals</Link>
                        </div>
                    </div>

                    <div className={styles.column}>
                        <h3 className={styles.columnTitle}>Company</h3>
                        <div className={styles.linkList}>
                            <Link href="/about" className={styles.footerLink}>About Us</Link>
                            <Link href="/contact" className={styles.footerLink}>Contact</Link>
                            <Link href="/blog" className={styles.footerLink}>Blog</Link>
                            <Link href="/careers" className={styles.footerLink}>Careers</Link>
                        </div>
                    </div>

                    <div className={styles.column}>
                        <h3 className={styles.columnTitle}>Support</h3>
                        <div className={styles.linkList}>
                            <Link href="/help" className={styles.footerLink}>Help Center</Link>
                            <Link href="/returns" className={styles.footerLink}>Returns</Link>
                            <Link href="/shipping" className={styles.footerLink}>Shipping</Link>
                            <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
                        </div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>© 2025 DreamyBooks. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link href="/terms" className={styles.footerLink} style={{ fontSize: '0.85rem' }}>Terms</Link>
                        <Link href="/privacy" className={styles.footerLink} style={{ fontSize: '0.85rem' }}>Privacy</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
