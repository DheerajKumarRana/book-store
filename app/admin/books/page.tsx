'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import styles from '../admin.module.css';

export default function BooksPage() {
    const [books, setBooks] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/books')
            .then(res => res.json())
            .then(data => setBooks(data))
            .catch(err => console.error(err));
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this book?')) return;
        try {
            const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setBooks(books.filter(b => b._id !== id));
            } else {
                alert('Failed to delete book');
            }
        } catch (error) {
            console.error(error);
            alert('Error deleting book');
        }
    };

    return (
        <div>
            <div className={styles.tableHeader}>
                <h1 className={styles.tableTitle}>Books Management</h1>
                <Link href="/admin/upload" className={styles.actionBtn}>
                    <FiPlus /> Add New Book
                </Link>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Book Title</th>
                            <th>Author</th>
                            <th>Price</th>
                            <th>Tags</th>
                            <th>Sold</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book) => (
                            <tr key={book._id}>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>${book.price}</td>
                                <td>
                                    {book.tags && book.tags.map((tag: string, i: number) => (
                                        <span key={i} className={styles.badge} style={{ background: '#f1f5f9', color: '#475569', marginRight: '5px' }}>
                                            {tag}
                                        </span>
                                    ))}
                                </td>
                                <td>{book.sold || 0}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <Link href={`/admin/books/${book._id}/edit`} style={{ color: '#2563eb' }}>
                                            <FiEdit2 size={18} />
                                        </Link>
                                        <button onClick={() => handleDelete(book._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                            <FiTrash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {books.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No books found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
