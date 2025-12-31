'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from '../../../admin.module.css';

export default function EditCollectionPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [formData, setFormData] = useState({ title: '', description: '', rule: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/collections/${id}`)
            .then(res => res.json())
            .then(data => {
                setFormData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                alert('Error fetching collection');
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`/api/collections/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                router.push('/admin/collections');
            } else {
                alert('Failed to update collection');
            }
        } catch (error) {
            console.error(error);
            alert('Error updating collection');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <div className={styles.formCard}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Edit Collection</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Collection Title</label>
                        <input
                            className={styles.input}
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Description</label>
                        <input
                            className={styles.input}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Automated Rule (Tag)</label>
                        <input
                            className={styles.input}
                            value={formData.rule}
                            onChange={(e) => setFormData({ ...formData, rule: e.target.value })}
                            required
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" onClick={() => router.back()} className={styles.secondaryBtn} style={{ flex: 1, padding: '0.8rem', cursor: 'pointer', background: '#e2e8f0', border: 'none', borderRadius: '6px' }}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.actionBtn} disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
