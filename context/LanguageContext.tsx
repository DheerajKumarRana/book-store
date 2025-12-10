'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Locale = {
    code: string;
    name: string;
    currency: string;
    symbol: string;
    rate: number; // 1 USD = X Local Currency
    flag: string;
};

// Mock Exchange Rates (Base: USD)
export const LOCALES: Record<string, Locale> = {
    'en-US': { code: 'en-US', name: 'English (US)', currency: 'USD', symbol: '$', rate: 1, flag: '🇺🇸' },
    'ko-KR': { code: 'ko-KR', name: '한국어 (Korean)', currency: 'KRW', symbol: '₩', rate: 1430, flag: '🇰🇷' },
    'th-TH': { code: 'th-TH', name: 'ภาษาไทย (Thai)', currency: 'THB', symbol: '฿', rate: 34.5, flag: '🇹🇭' },
    'id-ID': { code: 'id-ID', name: 'Bahasa Indonesia', currency: 'IDR', symbol: 'Rp', rate: 15500, flag: '🇮🇩' },
};

interface LanguageContextType {
    locale: Locale;
    setLocale: (code: string) => void;
    formatPrice: (amountInUSD: number) => string;
    t: (key: string) => string; // Simple translation helper stub
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [currentLocaleCode, setCurrentLocaleCode] = useState('en-US');

    const locale = LOCALES[currentLocaleCode] || LOCALES['en-US'];

    const setLocale = (code: string) => {
        if (LOCALES[code]) {
            setCurrentLocaleCode(code);
        }
    };

    const formatPrice = (amountInUSD: number) => {
        const converted = amountInUSD * locale.rate;

        // Formatting options based on currency
        let options: Intl.NumberFormatOptions = {
            style: 'currency',
            currency: locale.currency,
        };

        // Remove decimals for currencies like KRW, JPY, IDR which typically don't store cents/sub-units in daily commerce
        if (['KRW', 'IDR', 'JPY'].includes(locale.currency)) {
            options.minimumFractionDigits = 0;
            options.maximumFractionDigits = 0;
        }

        return new Intl.NumberFormat(locale.code, options).format(converted);
    };

    // Simple Dictionary
    const dictionary: Record<string, Record<string, string>> = {
        'en-US': {
            'addToCart': 'Add to Cart',
            'inCart': 'In Cart',
            'buyNow': 'Buy Now for',
            'cartEmpty': 'Your Cart is Empty',
            'startShopping': 'Start Shopping',
            'shoppingCart': 'Shopping Cart',
            'orderSummary': 'Order Summary',
            'subtotal': 'Subtotal',
            'tax': 'Tax',
            'total': 'Total',
            'proceedToCheckout': 'Proceed to Checkout',
            'remove': 'Remove'
        },
        'ko-KR': {
            'addToCart': '장바구니 담기',
            'inCart': '담겼습니다',
            'buyNow': '즉시 구매',
            'cartEmpty': '장바구니가 비었습니다',
            'startShopping': '쇼핑하기',
            'shoppingCart': '장바구니',
            'orderSummary': '주문 요약',
            'subtotal': '소계',
            'tax': '세금',
            'total': '합계',
            'proceedToCheckout': '결제하기',
            'remove': '삭제'
        }
        // Add others as needed
    };

    const t = (key: string) => {
        const lang = dictionary[currentLocaleCode] || dictionary['en-US'];
        return lang[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ locale, setLocale, formatPrice, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
