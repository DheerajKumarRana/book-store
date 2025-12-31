
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './upload.module.css';
import { FiUploadCloud, FiCheck } from 'react-icons/fi';

export default function UploadPage() {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        description: '',
        price: '',
        coverImage: '',
        images: [] as string[], // Additional gallery images
        fileUrl: '', // Full book public URL
        s3Key: '',   // Crucial for secure access
        previewUrls: [] as string[],
        preview: '', // Text preview
        tags: '',   // Comma separated tags
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const router = useRouter();

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
                setFormData(prev => ({ ...prev, previewUrls: urls }));
            } else if (type === 'gallery') {
                const urls: string[] = [];
                // Allow up to 5 gallery images
                const filesToUpload = Array.from(files).slice(0, 5);

                for (const file of filesToUpload) {
                    const json = await uploadOne(file);
                    urls.push(json.url);
                }
                setFormData(prev => ({ ...prev, images: urls }));
            } else {
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
            // Process tags into an array
            const processedTags = formData.tags
                .split(',')
                .map(t => t.trim())
                .filter(t => t.length > 0);

            const payload = {
                ...formData,
                tags: processedTags
            };

            const res = await fetch('/api/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
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
                    <div className={styles.row}>
                        <div className={styles.group}>
                            <label>Title</label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className={styles.input}
                                placeholder="Enter book title"
                            />
                        </div>
                        <div className={styles.group}>
                            <label>Author</label>
                            <input
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                required
                                className={styles.input}
                                placeholder="Author name"
                            />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.group}>
                            <label>Price ($)</label>
                            <input
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                className={styles.input}
                                placeholder="0.00"
                            />
                        </div>
                        <div className={styles.group}>
                            <label>Tags</label>
                            <input
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="Fiction, Bestseller, 2024 (comma separated)"
                            />
                            <span className={styles.helper}>Separate tags with commas</span>
                        </div>
                    </div>

                    <div className={styles.group}>
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className={styles.textarea}
                            placeholder="Book description..."
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.group}>
                            <label>Cover Image (Public)</label>
                            <div className={styles.fileInputWrapper}>
                                <input
                                    type="file"
                                    onChange={(e) => handleFileUpload(e, 'cover')}
                                    accept="image/*"
                                    className={styles.fileInput}
                                />
                                <div className={styles.fileLabel}>
                                    {formData.coverImage ? (
                                        <span className={styles.success}><FiCheck /> Cover Uploaded</span>
                                    ) : (
                                        <>
                                            <FiUploadCloud size={24} />
                                            <p>Click to upload cover image</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={styles.group}>
                            <label>Gallery Images (Optional, max 5)</label>
                            <div className={styles.fileInputWrapper}>
                                <input
                                    type="file"
                                    multiple
                                    onChange={(e) => handleFileUpload(e, 'gallery')}
                                    accept="image/*"
                                    className={styles.fileInput}
                                />
                                <div className={styles.fileLabel}>
                                    {formData.images && formData.images.length > 0 ? (
                                        <span className={styles.success}><FiCheck /> {formData.images.length} Images Uploaded</span>
                                    ) : (
                                        <>
                                            <FiUploadCloud size={24} />
                                            <p>Click to upload gallery images</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.group}>
                        <label>Full Book File (PDF/EPUB)</label>
                        <div className={styles.fileInputWrapper}>
                            <input
                                type="file"
                                onChange={(e) => handleFileUpload(e, 'full')}
                                accept=".pdf,.epub"
                                className={styles.fileInput}
                            />
                            <div className={styles.fileLabel}>
                                {formData.s3Key ? (
                                    <span className={styles.success}><FiCheck /> File Uploaded</span>
                                ) : (
                                    <>
                                        <FiUploadCloud size={24} />
                                        <p>Click to upload book file</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={styles.group}>
                        <label>Preview Pages (Optional, max 4)</label>
                        <div className={styles.fileInputWrapper}>
                            <input
                                type="file"
                                multiple
                                onChange={(e) => handleFileUpload(e, 'preview')}
                                accept=".png,.jpg,.jpeg"
                                className={styles.fileInput}
                            />
                            <div className={styles.fileLabel}>
                                {formData.previewUrls.length > 0 ? (
                                    <span className={styles.success}><FiCheck /> {formData.previewUrls.length} Pages Uploaded</span>
                                ) : (
                                    <>
                                        <FiUploadCloud size={24} />
                                        <p>Click to upload preview pages</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={styles.group}>
                        <label>Short Preview Text (Optional)</label>
                        <textarea
                            name="preview"
                            value={formData.preview}
                            onChange={handleChange}
                            className={styles.textarea}
                            placeholder="A short snippet from the book..."
                            style={{ minHeight: '80px' }}
                        />
                    </div>

                    <button type="submit" disabled={loading || uploading} className={styles.button}>
                        {loading ? 'Saving Book...' : uploading ? 'Uploading Files...' : 'Publish Book'}
                    </button>
                </form>
            </div>
        </div>
    );
}
