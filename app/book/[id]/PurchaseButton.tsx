'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './purchase.module.css';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import PaymentModal from './PaymentModal';

export default function PurchaseButton({ bookId, price }: { bookId: string, price: number }) {
    const { data: session } = useSession();
    const router = useRouter();
    const { addToCart, cart } = useCart();

    const [loading, setLoading] = useState(false);
    const [purchased, setPurchased] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Check if item is already in cart
    const safeBookId = String(bookId || '');
    const isInCart = cart.some(item => String(item.bookId) === safeBookId && safeBookId !== '');

    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        if (session) {
            checkPurchaseStatus();
        }
    }, [session, bookId]);

    const checkPurchaseStatus = async () => {
        try {
            const res = await fetch(`/api/purchase?bookId=${bookId}`);
            if (res.ok) {
                const data = await res.json();
                setPurchased(data.purchased);
            }
        } catch (error) {
            console.error('Error checking purchase status', error);
        }
    };


    const { formatPrice, t } = useLanguage();

    const handlePurchaseClick = () => {
        if (!session) {
            router.push('/login');
            return;
        }
        setShowModal(true);
    };

    const handleAddToCart = async () => {
        console.log("[PurchaseButton] handleAddToCart clicked for:", bookId);
        if (isInCart) {
            console.log("[PurchaseButton] Item already in cart");
            return;
        }

        const result = await addToCart(bookId);
        console.log("[PurchaseButton] addToCart result:", result);
        if (result.success) {
            setFeedback(t('inCart'));
            setTimeout(() => setFeedback(''), 3000);
        } else {
            if (result.message !== 'User not authenticated') {
                console.error(result.message);
            }
            // If user is not authenticated, the modal will open via context (as verified in CartContext)
            // But if it's another error, we should show it.
            if (result.message !== 'User not authenticated') {
                alert(result.message);
            }
        }
    };

    const handlePaymentSuccess = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/purchase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookId }),
            });

            if (res.ok) {
                setPurchased(true);
                setShowModal(false);
                alert('Purchase successful!');
            } else {
                alert('Purchase failed');
            }
        } catch (error) {
            alert('Error processing purchase');
        } finally {
            setLoading(false);
        }
    };

    if (purchased) {
        return (
            <button onClick={() => router.push(`/read/${bookId}`)} className={styles.readButton}>
                Read Now
            </button>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.buttonGroup}>
                <button
                    onClick={handleAddToCart}
                    className={`${styles.cartButton} ${isInCart ? styles.disabled : ''}`}
                    disabled={isInCart}
                >
                    {isInCart ? t('inCart') : t('addToCart')}
                </button>
                <button onClick={handlePurchaseClick} disabled={loading} className={styles.buyButton}>
                    {t('buyNow')} {formatPrice(price)}
                </button>


                {showModal && (
                    <PaymentModal
                        price={price}
                        onClose={() => setShowModal(false)}
                        onSuccess={handlePaymentSuccess}
                    />
                )}
            </div>

            {/* Feedback Message */}
            {isInCart && (
                <p style={{ color: 'red', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                    This book is already added to your cart.
                </p>
            )}
            {!isInCart && feedback && (
                <p style={{ color: 'green', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                    {feedback}
                </p>
            )}
        </div>
    );
}
