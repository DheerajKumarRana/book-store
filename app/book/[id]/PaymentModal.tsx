'use client';

import { useState } from 'react';
import styles from './payment.module.css';

interface PaymentModalProps {
    price: number;
    onClose: () => void;
    onSuccess: () => void;
}

export default function PaymentModal({ price, onClose, onSuccess }: PaymentModalProps) {
    const [loading, setLoading] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        setLoading(false);
        onSuccess();
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>Secure Payment</h2>
                    <button onClick={onClose} className={styles.closeBtn}>&times;</button>
                </div>

                <div className={styles.amount}>
                    Total to pay: <span>${price}</span>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.group}>
                        <label>Card Number</label>
                        <input
                            type="text"
                            placeholder="0000 0000 0000 0000"
                            value={cardNumber}
                            onChange={e => setCardNumber(e.target.value)}
                            required
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.group}>
                            <label>Expiry Date</label>
                            <input
                                type="text"
                                placeholder="MM/YY"
                                value={expiry}
                                onChange={e => setExpiry(e.target.value)}
                                required
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.group}>
                            <label>CVC</label>
                            <input
                                type="text"
                                placeholder="123"
                                value={cvc}
                                onChange={e => setCvc(e.target.value)}
                                required
                                className={styles.input}
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className={styles.payBtn}>
                        {loading ? 'Processing...' : `Pay $${price}`}
                    </button>
                </form>

                <p className={styles.secure}>
                    <span role="img" aria-label="lock">🔒</span>
                    This is a secure 256-bit SSL Encrypted payment.
                </p>
            </div>
        </div>
    );
}
