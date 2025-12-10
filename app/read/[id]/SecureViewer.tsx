'use client';

import { useEffect, useState } from 'react';
import styles from './reader.module.css';

export default function SecureViewer({ title, content }: { title: string, content: string }) {
    // In a real app, 'content' might be a URL to fetch secure chunks of text/pdf
    // For this demo, we'll assume 'content' is the text itself or a URL we fetch here
    // If it's a URL, we'd fetch it. If it's text, we display it.
    // Let's assume it's a URL to a text file for simplicity, or just raw text if it's short.

    const [text, setText] = useState<string>('Loading content...');

    useEffect(() => {
        // Disable right click
        const handleContextMenu = (e: MouseEvent) => e.preventDefault();
        document.addEventListener('contextmenu', handleContextMenu);

        // Disable copy
        const handleCopy = (e: ClipboardEvent) => {
            e.preventDefault();
            alert('Copying is disabled to protect author rights.');
        };
        document.addEventListener('copy', handleCopy);

        // Disable print screen (best effort, detects key press)
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'PrintScreen' || (e.ctrlKey && e.key === 'p')) {
                e.preventDefault();
                alert('Screenshots/Printing are disabled.');
                // We can't actually block OS screenshot, but we can hide content or warn
                document.body.style.display = 'none';
                setTimeout(() => document.body.style.display = 'block', 1000);
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        // Fetch content if it's a URL
        if (content.startsWith('http')) {
            fetch(content)
                .then(res => res.text())
                .then(setText)
                .catch(() => setText('Error loading book content.'));
        } else {
            setText(content);
        }

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('copy', handleCopy);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [content]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>{title}</h1>
                <a href="/" className={styles.exit}>Exit Reader</a>
            </div>
            <div className={styles.content} onContextMenu={(e) => e.preventDefault()}>
                {text.split('\n').map((para, i) => (
                    <p key={i}>{para}</p>
                ))}
            </div>
            <div className={styles.overlay}></div>
        </div>
    );
}
