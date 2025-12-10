'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { FiUser, FiShoppingBag, FiChevronDown, FiSearch } from 'react-icons/fi';
import styles from './navbar.module.css';
import { useCart } from '@/context/CartContext';
import { useLanguage, LOCALES } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const { data: session } = useSession();
    const router = useRouter();
    const { cartCount, openAuthModal } = useCart();
    const { locale, setLocale } = useLanguage();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            setShowSearch(false);
        }
    };

    return (
        <nav className={styles.nav}>
            <div className={styles.container}>
                <div className={styles.left}>
                    <Link href="/" className={styles.logo}>
                        <img src="/logo.png" alt="Read Shop" className={styles.logoImage} />
                    </Link>
                </div>

                <div className={styles.center}>
                    <div className={styles.links}>
                        <Link href="#top-genres" className={styles.navItem}>
                            Browse Genres
                        </Link>
                        <Link href="#new-release" className={styles.navItem}>
                            New Releases
                        </Link>
                        <Link href="#best-sellers" className={styles.navItem}>
                            Best Sellers
                        </Link>
                    </div>
                </div>

                <div className={styles.right}>
                    <button
                        className={styles.iconBtn}
                        onClick={() => setShowSearch(!showSearch)}
                        aria-label="Search"
                        suppressHydrationWarning={true}
                    >
                        <FiSearch />
                        <span className={styles.iconLabel}>Search</span>
                    </button>

                    {showSearch && (
                        <div className={styles.searchBarContainer}>
                            <form onSubmit={handleSearch} className={styles.searchForm}>
                                <input
                                    type="text"
                                    placeholder="Search books..."
                                    className={styles.searchInput}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                    suppressHydrationWarning={true}
                                />
                                <button type="submit" style={{ display: 'none' }} suppressHydrationWarning={true}>Search</button>
                            </form>
                        </div>
                    )}

                    <Link href="/cart" className={styles.cartBtn}>
                        <FiShoppingBag />
                        <span className={styles.iconLabel}>Cart</span>
                        {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
                    </Link>

                    <div className={styles.userMenu}>
                        {session ? (
                            <button
                                className={styles.iconBtn}
                                onClick={() => setShowDropdown(!showDropdown)}
                                suppressHydrationWarning={true}
                            >
                                {session.user?.image ? (
                                    <img
                                        src={session.user.image}
                                        alt={session.user.name || 'User'}
                                        className={styles.profileImg}
                                    />
                                ) : (
                                    <FiUser />
                                )}
                                <span className={styles.iconLabel}>{session.user?.name?.split(' ')[0] || 'Account'}</span>
                            </button>
                        ) : (
                            <button
                                className={styles.iconBtn}
                                onClick={openAuthModal}
                                suppressHydrationWarning={true}
                            >
                                <FiUser />
                                <span className={styles.iconLabel}>Login</span>
                            </button>
                        )}

                        {showDropdown && session && (
                            <div className={styles.dropdown}>
                                <Link href="/profile" className={styles.dropdownItem}>Profile</Link>
                                <Link href="/orders" className={styles.dropdownItem}>Orders</Link>
                                <button onClick={() => signOut()} className={styles.dropdownItem} suppressHydrationWarning={true}>Logout</button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
            {/* AuthModal is now handled by CartProvider globally */}
        </nav>
    );
}
