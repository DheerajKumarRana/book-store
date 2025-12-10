
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FiX, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import styles from './authModal.module.css';


interface AuthModalProps {
    onClose: () => void;
    initialView?: 'login' | 'register';
}


// Helper for password input
const PasswordInput = ({ value, onChange, placeholder = "Password", showPassword, toggleShowPassword }: any) => (
    <div style={{ position: 'relative', width: '100%' }}>
        <input
            className={styles.input}
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required
        />
        <button
            type="button"
            onClick={toggleShowPassword}
            style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#666',
                display: 'flex',
                alignItems: 'center',
                padding: 0
            }}
        >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
    </div>
);

export default function AuthModal({ onClose, initialView = 'login' }: AuthModalProps) {
    const [view, setView] = useState<'login' | 'register' | 'verify' | 'forgot-password'>(initialView);
    const [showPassword, setShowPassword] = useState(false);


    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState(''); // For success messages
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = () => {
        signIn('google', { callbackUrl: window.location.href });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (res?.error) {
                setError('Invalid email or password');
            } else {
                onClose();
                router.refresh();
            }
        } catch (error) {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                // Instead of direct login, go to verify
                setView('verify');
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (error) {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();

            if (res.ok) {
                // Auto login after verification
                const loginRes = await signIn('credentials', {
                    redirect: false,
                    email,
                    password,
                });

                if (loginRes?.ok) {
                    onClose();
                    router.refresh();
                } else {
                    // Should not happen if verify works
                    setView('login');
                    setError('Verification successful. Please login.');
                }
            } else {
                setError(data.message || 'Verification failed');
            }
        } catch (error) {
            setError('Invalid Code');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
            } else {
                setError(data.message || 'Something went wrong');
            }
        } catch (error) {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };


    const getViewClass = (targetView: string) => {
        if (view === targetView) return styles.activeView;

        // Simple logic: if not active, push it right or left
        // We can simplify this since we have a circular dependency potentially
        // Let's just say: if 'login' is active, everything else is right.
        // It's a bit complex with 4 views. 
        // Let's just use absolute positioning logic:

        return styles.inactiveRight;
    };

    // Helper to override getViewClass logic for smoother transitions if needed, 
    // but for now relying on the simple class toggle which might jump if we don't handle direction.
    // Given the previous CSS, we might just want to be simple:
    const isVisible = (targetView: string) => view === targetView;


    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}><FiX /></button>

                <div className={styles.contentContainer}>
                    {/* LOGIN VIEW */}
                    <div className={isVisible('login') ? styles.activeView : styles.inactiveLeft} style={isVisible('login') ? {} : { display: 'none' }}>
                        {/* Using display none for non-active views to prevent layout issues with 4 views stack */}
                        <img src="/logo.png" alt="Logo" className={styles.logo} />
                        <h2 className={styles.title}>Welcome Back</h2>
                        <p className={styles.subtitle}>Login to access your cart and orders</p>

                        <button type="button" className={styles.googleBtn} onClick={handleGoogleLogin}>
                            <FcGoogle size={22} />
                            Continue with Google
                        </button>

                        <div className={styles.divider}>or login with email</div>

                        <form onSubmit={handleLogin} className={styles.form}>
                            {error && <div className={styles.error}>{error}</div>}
                            <input
                                className={styles.input}
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                            <PasswordInput
                                value={password}
                                onChange={(e: any) => setPassword(e.target.value)}
                                placeholder="Password"
                                showPassword={showPassword}
                                toggleShowPassword={() => setShowPassword(!showPassword)}
                            />
                            <button className={styles.submitBtn} disabled={loading}>
                                {loading ? 'Logging in...' : 'Login'}
                            </button>

                            <div className={styles.forgotPassword}>
                                <button type="button" className={styles.link} onClick={() => { setError(''); setMessage(''); setView('forgot-password'); }}>
                                    Forgot Password?
                                </button>
                            </div>
                        </form>

                        <div className={styles.footer}>
                            New here?
                            <button onClick={() => setView('register')} className={styles.link}>
                                Create account
                            </button>
                        </div>
                    </div>

                    {/* REGISTER VIEW */}
                    <div className={isVisible('register') ? styles.activeView : styles.inactiveRight} style={isVisible('register') ? {} : { display: 'none' }}>
                        <img src="/logo.png" alt="Logo" className={styles.logo} />
                        <h2 className={styles.title}>Create Account</h2>
                        <p className={styles.subtitle}>Join us for exclusive book deals</p>

                        <button type="button" className={styles.googleBtn} onClick={handleGoogleLogin}>
                            <FcGoogle size={22} />
                            Sign up with Google
                        </button>

                        <div className={styles.divider}>or register with email</div>

                        <form onSubmit={handleRegister} className={styles.form}>
                            {error && <div className={styles.error}>{error}</div>}
                            <input
                                className={styles.input}
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            />
                            <input
                                className={styles.input}
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                            <PasswordInput
                                value={password}
                                onChange={(e: any) => setPassword(e.target.value)}
                                placeholder="Password"
                                showPassword={showPassword}
                                toggleShowPassword={() => setShowPassword(!showPassword)}
                            />
                            <button className={styles.submitBtn} disabled={loading}>
                                {loading ? 'Creating Account...' : 'Continue'}
                            </button>
                        </form>

                        <div className={styles.footer}>
                            Already have an account?
                            <button onClick={() => setView('login')} className={styles.link}>
                                Login here
                            </button>
                        </div>
                    </div>

                    {/* VERIFY VIEW */}
                    <div className={isVisible('verify') ? styles.activeView : styles.inactiveRight} style={isVisible('verify') ? {} : { display: 'none' }}>
                        <h2 className={styles.title}>Verify Email</h2>
                        <p className={styles.subtitle}>
                            We sent a code to <br /><strong>{email}</strong>
                        </p>

                        <form onSubmit={handleVerify} className={styles.form}>
                            {error && <div className={styles.error}>{error}</div>}
                            <input
                                className={`${styles.input} ${styles.otpInput}`}
                                type="text"
                                placeholder="000000"
                                maxLength={6}
                                value={otp}
                                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                                required
                            />
                            <button className={styles.submitBtn} disabled={loading}>
                                {loading ? 'Verifying...' : 'Verify Email'}
                            </button>
                        </form>

                        <div className={styles.footer}>
                            <button onClick={() => setView('register')} className={styles.link}>
                                Back
                            </button>
                        </div>
                    </div>

                    {/* FORGOT PASSWORD VIEW */}
                    <div className={isVisible('forgot-password') ? styles.activeView : styles.inactiveRight} style={isVisible('forgot-password') ? {} : { display: 'none' }}>
                        <h2 className={styles.title}>Reset Password</h2>
                        <p className={styles.subtitle}>
                            Enter your email to receive a reset link
                        </p>

                        <form onSubmit={handleForgotPassword} className={styles.form}>
                            {error && <div className={styles.error}>{error}</div>}
                            {message && <div style={{ color: 'green', background: '#f0fdf4', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>{message}</div>}

                            <input
                                className={styles.input}
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                            <button className={styles.submitBtn} disabled={loading}>
                                {loading ? 'Sending Link...' : 'Send Reset Link'}
                            </button>
                        </form>

                        <div className={styles.footer}>
                            Remembered?
                            <button onClick={() => setView('login')} className={styles.link}>
                                Login
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
