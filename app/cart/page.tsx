'use client';

import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { FiShoppingBag, FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import styles from './cart.module.css';

export default function CartPage() {
    const { cart, updateQuantity, removeFromCart } = useCart();
    const { formatPrice, t } = useLanguage();

    const subtotal = cart.reduce((acc, item) => acc + ((item.price || 0) * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    if (cart.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.emptyState}>
                    <FiShoppingBag className={styles.emptyIcon} />
                    <h2 className={styles.title}>{t('cartEmpty')}</h2>
                    <p className={styles.emptyText}>Looks like you haven't added any books to your cart yet.</p>
                    <Link href="/" className={styles.continueBtn}>
                        {t('startShopping')}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{t('shoppingCart')} ({cart.length} items)</h1>

            <div className={styles.grid}>
                <div className={styles.items}>
                    {cart.map((item) => (
                        <div key={item.bookId} className={styles.item}>
                            <img src={item.image || '/placeholder.png'} alt={item.title || 'Book'} className={styles.itemImage} />

                            <div className={styles.itemInfo}>
                                <h3 className={styles.itemTitle}>{item.title || 'Unknown Title'}</h3>
                                <p className={styles.itemAuthor}>by {item.author || 'Unknown Author'}</p>
                                <div className={styles.itemPrice}>{formatPrice(item.price || 0)}</div>

                                <div className={styles.quantityGroup}>
                                    <button
                                        className={styles.qtyBtn}
                                        onClick={() => updateQuantity(item.bookId, Math.max(1, item.quantity - 1))}
                                    >
                                        <FiMinus size={14} />
                                    </button>
                                    <span className={styles.qtyValue}>{item.quantity}</span>
                                    <button
                                        className={styles.qtyBtn}
                                        onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                                    >
                                        <FiPlus size={14} />
                                    </button>
                                </div>

                                <button
                                    className={styles.removeBtn}
                                    onClick={() => removeFromCart(item.bookId)}
                                >
                                    <FiTrash2 size={14} /> {t('remove')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.summary}>
                    <h2 className={styles.summaryTitle}>{t('orderSummary')}</h2>
                    <div className={styles.summaryRow}>
                        <span>{t('subtotal')}</span>
                        <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>{t('tax')} (10%)</span>
                        <span>{formatPrice(tax)}</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>
                    <div className={styles.totalRow}>
                        <span>{t('total')}</span>
                        <span>{formatPrice(total)}</span>
                    </div>
                    <button className={styles.checkoutBtn}>
                        {t('proceedToCheckout')}
                    </button>
                </div>
            </div>
        </div>
    );
}
