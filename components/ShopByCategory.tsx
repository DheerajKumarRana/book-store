'use client';

import Link from 'next/link';
import styles from './shopByCategory.module.css';

const categories = [
    {
        id: 1,
        title: "Famous Crime Novels",
        bgColor: "#3b4371", // Dark Blue/Purple
        images: [
            "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60", // Back Left
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60", // Back Right
            "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60"  // Front Center
        ]
    },
    {
        id: 2,
        title: "Popular Magazine",
        bgColor: "#0f172a", // Dark Navy
        images: [
            "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60",
            "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60",
            "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60"
        ]
    },
    {
        id: 3,
        title: "Fairy Tales & Folk Tales",
        bgColor: "#114b43", // Dark Green
        images: [
            "https://images.unsplash.com/photo-1614726365723-49cfae96a6b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60",
            "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60",
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60"
        ]
    }
];

export default function ShopByCategory() {
    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.heading}>Shop By Category</h2>
                <Link href="/shop" className={styles.shopBtn}>Shop Now</Link>
            </div>

            <div className={styles.grid}>
                {categories.map((category) => (
                    <div key={category.id} className={styles.card}>
                        <div className={styles.imageArea} style={{ backgroundColor: category.bgColor }}>
                            <img src={category.images[0]} alt="" className={`${styles.bookImage} ${styles.backLeft}`} />
                            <img src={category.images[1]} alt="" className={`${styles.bookImage} ${styles.backRight}`} />
                            <img src={category.images[2]} alt="" className={`${styles.bookImage} ${styles.frontCenter}`} />
                        </div>
                        <h3 className={styles.categoryTitle}>{category.title}</h3>
                    </div>
                ))}
            </div>
        </section>
    );
}
