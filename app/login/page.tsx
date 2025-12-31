'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './login.module.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError('Invalid credentials');
                return;
            }

            // Fetch session to check role
            const session = await getSession();
            console.log('Login successful. Session:', session);
            console.log('User Role:', (session?.user as any)?.role);

            if (session?.user && (session.user as any).role === 'admin') {
                console.log('Redirecting to ADMIN panel');
                router.push('/admin');
            } else {
                console.log('Redirecting to HOME config');
                router.push('/');
            }
            router.refresh();
        } catch (error) {
            setError('Something went wrong');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Login</h1>
                {error && <p className={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.input}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.input}
                        required
                    />
                    <button type="submit" className={styles.button}>
                        Login
                    </button>
                </form>
                <p className={styles.text}>
                    Don't have an account? <Link href="/register" className={styles.link}>Register</Link>
                </p>
            </div>
        </div>
    );
}
