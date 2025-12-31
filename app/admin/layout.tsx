'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiBook, FiUsers, FiLayers, FiLogOut } from 'react-icons/fi';
import { signOut } from 'next-auth/react';
import styles from './admin.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path ? styles.navItemActive : '';

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <Link href="/admin" className={styles.logo}>
                    <FiLayers /> AdminPanel
                </Link>

                <nav className={styles.nav}>
                    <Link href="/admin" className={`${styles.navItem} ${isActive('/admin')}`}>
                        <FiHome /> Dashboard
                    </Link>
                    <Link href="/admin/books" className={`${styles.navItem} ${isActive('/admin/books')}`}>
                        <FiBook /> Books
                    </Link>
                    <Link href="/admin/collections" className={`${styles.navItem} ${isActive('/admin/collections')}`}>
                        <FiLayers /> Collections
                    </Link>
                    <Link href="/admin/users" className={`${styles.navItem} ${isActive('/admin/users')}`}>
                        <FiUsers /> Users
                    </Link>
                </nav>

                <button onClick={() => signOut({ callbackUrl: '/' })} className={styles.logoutBtn}>
                    <FiLogOut /> Logout
                </button>
            </aside>

            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
