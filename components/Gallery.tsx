'use client';

import { useState } from 'react';
import styles from './gallery.module.css';

interface GalleryProps {
    mainImage: string;
    images?: string[];
    title: string;
}

export default function Gallery({ mainImage, images = [], title }: GalleryProps) {
    const [selectedImage, setSelectedImage] = useState(mainImage);

    // Combine main image and extra images into one list for thumbnails
    // Ensure unique and valid URLs
    const allImages = [mainImage, ...images].filter(Boolean);

    return (
        <div className={styles.container}>
            <div className={styles.mainImageWrapper}>
                <img
                    src={selectedImage}
                    alt={title}
                    className={styles.mainImage}
                />
            </div>

            {allImages.length > 1 && (
                <div className={styles.thumbnailList}>
                    {allImages.map((img, index) => (
                        <div
                            key={index}
                            className={`${styles.thumbnailWrapper} ${selectedImage === img ? styles.active : ''}`}
                            onClick={() => setSelectedImage(img)}
                        >
                            <img
                                src={img}
                                alt={`${title} view ${index + 1}`}
                                className={styles.thumbnail}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
