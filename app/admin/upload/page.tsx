'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './upload.module.css';

export default function UploadPage() {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        description: '',
        price: '',
        coverImage: '',
        fileUrl: '', // Full book public URL (or standard S3 URL if we treat it as opaque)
        s3Key: '',   // Crucial for secure access
        previewUrls: [] as string[], // Array of preview URLs
        preview: '', // Text preview
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'preview' | 'full') => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);

        try {
            // Helper to upload a single file
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
                // Upload all selected preview files strictly
                const urls: string[] = [];
                // Limit to 4 files if user selects more
                const filesToUpload = Array.from(files).slice(0, 4);

                for (const file of filesToUpload) {
                    const json = await uploadOne(file);
                    urls.push(json.url);
                }
                setFormData(prev => ({ ...prev, previewUrls: urls })); // Replace or append? Replacing for simplicity for now
            } else {
                // Single file upload for cover / full book
                const json = await uploadOne(files[0]);
                if (type === 'cover') {
                    setFormData(prev => ({ ...prev, coverImage: json.url }));
                } else if (type === 'full') {
                    setFormData(prev => ({
                        ...prev,
                        fileUrl: json.url,
                        s3Key: json.key
                    }));
                }
            }

        } catch (error: any) {
            console.error(error);
            alert(`Error uploading file: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.coverImage) {
            alert('Please upload a cover image');
            return;
        }
        if (!formData.fileUrl) {
            alert('Please upload the full book file (PDF/EPUB)');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/');
            } else {
                alert('Failed to upload book');
            }
        } catch (error) {
            alert('Error uploading book');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Upload New Book</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.group}>
                        <label>Title</label>
                        <input name="title" value={formData.title} onChange={handleChange} required className={styles.input} />
                    </div>
                    <div className={styles.group}>
                        <label>Author</label>
                        <input name="author" value={formData.author} onChange={handleChange} required className={styles.input} />
                    </div>
                    <div className={styles.group}>
                        <label>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required className={styles.textarea} />
                    </div>
                    <div className={styles.group}>
                        <label>Price ($)</label>
                        <input name="price" type="number" value={formData.price} onChange={handleChange} required className={styles.input} />
                    </div>

                    {/* Cover Image */}
                    <div className={styles.group}>
                        <label>Cover Image (Public)</label>
                        <input type="file" onChange={(e) => handleFileUpload(e, 'cover')} accept="image/*" className={styles.input} />
                        {formData.coverImage && <p className={styles.success}>Cover uploaded!</p>}
                    </div>

                    {/* Preview File */}
                    <div className={styles.group}>
                        <label>Preview Files (Select up to 4 Images)</label>
                        <input type="file" multiple onChange={(e) => handleFileUpload(e, 'preview')} accept=".png,.jpg,.jpeg" className={styles.input} />
                        {formData.previewUrls.length > 0 && <p className={styles.success}>{formData.previewUrls.length} preview pages uploaded!</p>}
                    </div>

                    {/* Full Book File */}
                    <div className={styles.group}>
                        <label>Full Book File (Private - PDF/EPUB)</label>
                        <input type="file" onChange={(e) => handleFileUpload(e, 'full')} accept=".pdf,.epub" className={styles.input} />
                        {formData.s3Key && <p className={styles.success}>Secure Book uploaded!</p>}
                    </div>

                    <div className={styles.group}>
                        <label>Short Preview Text</label>
                        <textarea name="preview" value={formData.preview} onChange={handleChange} className={styles.textarea} />
                    </div>

                    <button type="submit" disabled={loading || uploading} className={styles.button}>
                        {loading ? 'Saving...' : uploading ? 'Uploading File...' : 'Upload Book'}
                    </button>
                </form>
            </div>
        </div>
    );
}
