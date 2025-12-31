'use client';

import { useEffect, useState } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';
import styles from '../admin.module.css';

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/admin/users')
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(console.error);
    }, []);

    const toggleBlock = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`/api/admin/users?id=${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isBlocked: !currentStatus })
            });
            if (res.ok) {
                setUsers(users.map(u => u._id === id ? { ...u, isBlocked: !currentStatus } : u));
            }
        } catch (error) {
            console.error('Error updating user', error);
        }
    };

    return (
        <div>
            <div className={styles.tableHeader}>
                <h1 className={styles.tableTitle}>User Management</h1>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={styles.badge} style={{ background: user.role === 'admin' ? '#dbeafe' : '#f1f5f9', color: user.role === 'admin' ? '#1e40af' : '#475569' }}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>
                                    {user.isBlocked ? (
                                        <span className={`${styles.badge} ${styles.badgeBlocked}`}>Blocked</span>
                                    ) : (
                                        <span className={`${styles.badge} ${styles.badgeActive}`}>Active</span>
                                    )}
                                </td>
                                <td>
                                    {user.role !== 'admin' && (
                                        <button
                                            onClick={() => toggleBlock(user._id, user.isBlocked)}
                                            className={`${styles.smallBtn} ${user.isBlocked ? '' : styles.dangerBtn}`}
                                        >
                                            {user.isBlocked ? 'Unblock' : 'Block Access'}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
