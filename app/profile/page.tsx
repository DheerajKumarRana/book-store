'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiUser, FiMapPin, FiPhone, FiBox } from 'react-icons/fi';
import styles from './profile.module.css';

import { Suspense } from 'react';

function ProfileContent() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();

    interface UserProfile {
        name: string;
        email: string;
        address: string;
        phone: string;
    }

    const [profile, setProfile] = useState<UserProfile>({
        name: '',
        email: '',
        address: '',
        phone: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Tab State
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }

        if (status === 'authenticated') {
            fetchProfile();
        }
    }, [status, router]);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/user/profile');
            const data = await res.json();
            if (res.ok) {
                setProfile({
                    name: data.user.name || '',
                    email: data.user.email || '',
                    address: data.user.address || '',
                    phone: data.user.phone || ''
                });
            }
        } catch (error) {
            console.error('Failed to fetch profile', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                setProfile(prev => ({ ...prev, ...data.user }));
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to update profile' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred' });
        } finally {
            setSaving(false);
        }
    };

    // Mock Orders Logic
    const orders = [
        { id: '#ORD-7721', date: 'Dec 01, 2025', status: 'Delivered', total: '$45.00', items: 2 },
        { id: '#ORD-7722', date: 'Nov 15, 2025', status: 'Processing', total: '$120.50', items: 5 }
    ];

    if (loading) {
        return <div className={styles.loading}>Loading profile...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>My Account</h1>
            </div>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tabBtn} ${activeTab === 'profile' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    <FiUser /> Profile
                </button>
                <button
                    className={`${styles.tabBtn} ${activeTab === 'orders' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    <FiBox /> My Orders
                </button>
            </div>

            <div className={styles.content}>
                {activeTab === 'profile' ? (
                    <>
                        <div className={styles.sectionTitle}>
                            <FiUser /> Personal Information
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Full Name</label>
                                <input
                                    type="text"
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Email Address</label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    disabled
                                    className={styles.input}
                                    style={{ background: '#f5f5f5', cursor: 'not-allowed' }}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Phone Number</label>
                                <input
                                    type="tel"
                                    value={profile.phone}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    className={styles.input}
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Shipping Address</label>
                                <textarea
                                    value={profile.address}
                                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                    className={styles.textarea}
                                    placeholder="Enter your full shipping address..."
                                />
                            </div>

                            <button type="submit" className={styles.button} disabled={saving}>
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>

                            {message && (
                                <div className={`${styles.message} ${styles[message.type]}`}>
                                    {message.text}
                                </div>
                            )}
                        </form>
                    </>
                ) : (
                    <div className={styles.ordersSection}>
                        <div className={styles.sectionTitle}>
                            <FiBox /> Order History
                        </div>
                        <div className={styles.ordersList}>
                            {orders.map(order => (
                                <div key={order.id} className={styles.orderCard}>
                                    <div className={styles.orderHeader}>
                                        <span className={styles.orderId}>{order.id}</span>
                                        <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>{order.status}</span>
                                    </div>
                                    <div className={styles.orderDetails}>
                                        <span>{order.date}</span>
                                        <span>{order.items} items</span>
                                        <span className={styles.orderTotal}>{order.total}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ProfilePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProfileContent />
        </Suspense>
    );
}
