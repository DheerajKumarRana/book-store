'use client';

import { useEffect, useState } from 'react';
import styles from './admin.module.css';
import { FiBook, FiUsers, FiLayers, FiDollarSign } from 'react-icons/fi';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ totalBooks: 0, totalUsers: 0, totalCollections: 0 });

    useEffect(() => {
        fetch('/api/admin/stats')
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h1 className={styles.logo} style={{ color: '#0f172a', marginBottom: '2rem' }}>Dashboard Overview</h1>
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={`${styles.statIconWrapper} ${styles.blueIcon}`}>
                        <FiBook />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>Total Books</h3>
                        <p>{stats.totalBooks}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.statIconWrapper} ${styles.greenIcon}`}>
                        <FiUsers />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>Total Users</h3>
                        <p>{stats.totalUsers}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.statIconWrapper} ${styles.purpleIcon}`}>
                        <FiLayers />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>Collections</h3>
                        <p>{stats.totalCollections}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.statIconWrapper} ${styles.orangeIcon}`}>
                        <FiDollarSign />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>Revenue</h3>
                        <p>$0</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
