'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from '../../../upload/upload.module.css'; // Reusing upload styles
import { FiUploadCloud, FiCheck } from 'react-icons/fi';

export default function EditBookPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        description: '',
        price: '',
        coverImage: '',
        images: [] as string[],
        fileUrl: '',
        s3Key: '',
        previewUrls: [] as string[],
        preview: '',
        tags: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/books/${id}`)
            .then(res => res.json())
            .then(data => {
                setFormData({
                    ...data,
                    tags: data.tags ? data.tags.join(', ') : '',
                    images: data.images || [],
                    previewUrls: data.previewUrls || []
                });
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                alert('Error fetching book details');
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'preview' | 'full' | 'gallery') => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        try {
            const uploadOne = async (file: File) => {
                const data = new FormData();
                data.append('file', file);
                data.append('type', type);
                const res = await fetch('/api/upload', { method: 'POST', body: data });
                if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.error || 'Upload failed');
                }
                return await res.json();
            };

            if (type === 'preview') {
                const urls: string[] = [];
                const filesToUpload = Array.from(files).slice(0, 4);
                for (const file of filesToUpload) {
                    const json = await uploadOne(file);
                    urls.push(json.url);
                }
                setFormData(prev => ({ ...prev, previewUrls: [...prev.previewUrls, ...urls].slice(0, 4) }));
            } else if (type === 'gallery') {
                const urls: string[] = [];
                // Calculate how many more we can add
                const currentCount = formData.images.length;
                const maxAllowed = 5;
                const remainingSlots = maxAllowed - currentCount;

                if (remainingSlots <= 0) {
                    alert(`You already have ${maxAllowed} images. Please remove some to add new ones.`);
                    setUploading(false);
                    return;
                }

                // Only take as many files as we have slots for
                const filesToUpload = Array.from(files).slice(0, remainingSlots);

                if (files.length > remainingSlots) {
                    alert(`Only uploading ${remainingSlots} image(s) because of the 5-image limit.`);
                }

                for (const file of filesToUpload) {
                    const json = await uploadOne(file);
                    urls.push(json.url);
                }

                // Append new URLs to existing ones
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, ...urls]
                }));
            } else {
                const json = await uploadOne(files[0]);
                if (type === 'cover') {
                    setFormData(prev => ({ ...prev, coverImage: json.url }));
                } else if (type === 'full') {
                    setFormData(prev => ({ ...prev, fileUrl: json.url, s3Key: json.key }));
                }
            }
        } catch (error: any) {
            alert(`Error uploading file: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Process tags
            const processedTags = formData.tags
                .split(',')
                .map(t => t.trim())
                .filter(t => t.length > 0);

            const payload = { ...formData, tags: processedTags };

            const res = await fetch(`/api/books/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push('/admin/books');
            } else {
                alert('Failed to update book');
            }
        } catch (error) {
            alert('Error updating book');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading book details...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Edit Book</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.row}>
                        <div className={styles.group}>
                            <label>Title</label>
                            <input name="title" value={formData.title} onChange={handleChange} required className={styles.input} />
                        </div>
                        <div className={styles.group}>
                            <label>Author</label>
                            <input name="author" value={formData.author} onChange={handleChange} required className={styles.input} />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.group}>
                            <label>Price ($)</label>
                            <input name="price" type="number" value={formData.price} onChange={handleChange} required className={styles.input} />
                        </div>
                        <div className={styles.group}>
                            <label>Tags</label>
                            <input name="tags" value={formData.tags} onChange={handleChange} className={styles.input} placeholder="Separate with commas" />
                        </div>
                    </div>

                    <div className={styles.group}>
                        <label>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required className={styles.textarea} />
                    </div>

                    {/* Simplified Image Uploads for Edit (similar to Create but shows current) */}
                    <div className={styles.row}>
                        <div className={styles.group}>
                            <label>Cover Image (Click to Replace)</label>
                            <div className={styles.fileInputWrapper}>
                                <input type="file" onChange={(e) => handleFileUpload(e, 'cover')} accept="image/*" className={styles.fileInput} />
                                <div className={styles.fileLabel}>
                                    {formData.coverImage ? <img src={formData.coverImage} alt="Cover" style={{ height: '50px', objectFit: 'contain' }} /> : <FiUploadCloud />}
                                </div>
                            </div>
                        </div>
                        <div className={styles.group}>
                            <label>Gallery Images (Max 5)</label>
                            <div className={styles.fileInputWrapper}>
                                <input type="file" multiple onChange={(e) => handleFileUpload(e, 'gallery')} accept="image/*" className={styles.fileInput} />
                                <div className={styles.fileLabel}>
                                    {formData.images.length > 0 ? <span>{formData.images.length} Images</span> : <FiUploadCloud />}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                                {formData.images.map((img, i) => (
                                    <div key={i} style={{ position: 'relative' }}>
                                        <img src={img} alt="thumb" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                                        <button type="button" onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))} style={{ position: 'absolute', top: 0, right: 0, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '15px', height: '15px', fontSize: '10px', cursor: 'pointer' }}>x</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={styles.group}>
                        <label>Full Book URL (PDF)</label>
                        <p style={{ fontSize: '0.8rem', color: '#666' }}>{formData.fileUrl ? 'File already uploaded. Upload new file to replace.' : 'No file uploaded.'}</p>
                        <div className={styles.fileInputWrapper}>
                            <input type="file" onChange={(e) => handleFileUpload(e, 'full')} accept=".pdf,.epub" className={styles.fileInput} />
                            <div className={styles.fileLabel}><FiUploadCloud /> Upload New File</div>
                        </div>
                    </div>

                    <button type="submit" disabled={saving || uploading} className={styles.button}>
                        {saving ? 'Saving...' : 'Update Book'}
                    </button>
                </form>
            </div>
        </div>
    );
}
