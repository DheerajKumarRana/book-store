'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../admin.module.css';
import { FiPlus, FiTag, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function CollectionsPage() {
    const [collections, setCollections] = useState<any[]>([]);
    const [formData, setFormData] = useState({ title: '', description: '', rule: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch('/api/collections')
            .then(res => res.json())
            .then(setCollections)
            .catch(console.error);
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this collection?')) return;
        try {
            const res = await fetch(`/api/collections/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setCollections(collections.filter(c => c._id !== id));
            } else {
                alert('Failed to delete collection');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/collections', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                const newCol = await res.json();
                setCollections([newCol, ...collections]);
                setFormData({ title: '', description: '', rule: '' });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(300px, 1fr)', gap: '2rem' }}>
            {/* List Section */}
            <div>
                <div className={styles.tableHeader}>
                    <h1 className={styles.tableTitle}>Existing Collections</h1>
                </div>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Tag Rule</th>
                                <th>Books</th>
                                <th>Active</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {collections.map((col) => (
                                <tr key={col._id}>
                                    <td>
                                        <div style={{ fontWeight: '600' }}>{col.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{col.description}</div>
                                    </td>
                                    <td>
                                        <span className={styles.badge} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                            <FiTag /> {col.rule}
                                        </span>
                                    </td>
                                    <td style={{ fontWeight: 'bold', color: '#2563eb' }}>{col.bookCount || '-'}</td>
                                    <td>
                                        <span className={`${styles.badge} ${styles.badgeActive}`}>Yes</span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <Link href={`/admin/collections/${col._id}/edit`} style={{ color: '#2563eb' }}>
                                                <FiEdit2 size={18} />
                                            </Link>
                                            <button onClick={() => handleDelete(col._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                                <FiTrash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {collections.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No collections found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Section */}
            <div>
                <div className={styles.formCard}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: '#0f172a' }}>Create Smart Collection</h2>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Collection Title</label>
                            <input
                                className={styles.input}
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                placeholder="e.g. Summer Best Sellers"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Description</label>
                            <input
                                className={styles.input}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Optional description"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Automated Rule (Tag)</label>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <FiTag style={{ color: '#64748b' }} />
                                <input
                                    className={styles.input}
                                    value={formData.rule}
                                    onChange={(e) => setFormData({ ...formData, rule: e.target.value })}
                                    required
                                    placeholder="e.g. bestseller"
                                />
                            </div>
                            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>
                                Any book with the tag <strong>"{formData.rule || '...'}"</strong> will automatically be added to this collection.
                            </p>
                        </div>
                        <button type="submit" className={styles.actionBtn} disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                            {loading ? 'Creating...' : 'Create Collection'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
