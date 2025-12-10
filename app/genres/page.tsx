import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function GenresPage() {
    return (
        <main>
            <Navbar />
            <div style={{ padding: '4rem 2rem', textAlign: 'center', minHeight: '60vh' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Genres</h1>
                <p style={{ color: '#666' }}>Explore books by category.</p>
            </div>
            <Footer />
        </main>
    );
}
