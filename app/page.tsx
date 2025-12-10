import Link from 'next/link';
import { FiMail } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FavoriteBooks from '@/components/FavoriteBooks';
import OfferSection from '@/components/OfferSection';
import MustReadBooks from '@/components/MustReadBooks';
import AuthorBooks from '@/components/AuthorBooks';
import ShopByCategory from '@/components/ShopByCategory';
import dbConnect from '@/lib/db';
import Book from '@/models/Book';
import styles from './page.module.css';
import bookStyles from '@/components/Book3D.module.css';
import Footer from '@/components/Footer';
import NewReleases from '@/components/NewReleases';

export const dynamic = 'force-dynamic';


import { getPresignedUrlFromUrl } from '@/lib/s3';

async function getBooks() {
  await dbConnect();
  const books = await Book.find({}).sort({ createdAt: -1 }).lean();

  // Process books to sign URLs
  const booksWithSignedUrls = await Promise.all(books.map(async (book: any) => ({
    ...book,
    _id: book._id.toString(),
    coverImage: await getPresignedUrlFromUrl(book.coverImage),
  })));

  return booksWithSignedUrls;
}

export default async function Home() {
  const books = await getBooks();

  // Helper to get books safely (recycle if not enough)
  const getSafeSlice = (start: number, end: number) => {
    if (books.length === 0) return [];
    if (books.length > start) return books.slice(start, end);
    return books.slice(0, end - start); // Fallback to first N books
  };


  // const featured = books.slice(0, 4); // Unused
  const newArrivals = books.slice(0, 8);
  const rankingBooks = books.slice(0, 3);
  const authorBooks = getSafeSlice(10, 18);
  const mustReadBooks = getSafeSlice(16, 24);
  const favoriteBooks = getSafeSlice(22, 30);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <HeroSection />

        <div className={styles.container} >
          {/* Top Genres */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 id="top-genres" className={styles.sectionTitle}>Top Genre</h2>
              <Link href="/shop" className={styles.viewAll}>MORE</Link>
            </div>
            <div className={styles.genreGrid} >
              {[
                { name: 'Romance', class: styles.genreRomance, img: '/genres/romance.png' },
                { name: 'Paranormal', class: styles.genreParanormal, img: '/genres/paranormal.png' },
                { name: 'Steamy Stories', class: styles.genreSteamy, img: '/genres/steamy.png' },
                { name: 'YA Teenfiction', class: styles.genreTeen, img: '/genres/teen.png' },
                { name: 'NewAdult', class: styles.genreNewAdult, img: '/genres/newadult.png' },
                { name: 'Fantasy', class: styles.genreFantasy, img: '/genres/fantasy.png' },
              ].map((genre) => (
                <div key={genre.name} className={`${styles.genreCard} ${genre.class}`}>
                  <span className={styles.genreName}>{genre.name}</span>
                  <img src={genre.img} alt={genre.name} className={styles.genreImage} />
                </div>
              ))}
            </div>
          </section>

          {/* New Arrivals */}
          {/* New Releases */}
          <NewReleases books={newArrivals} />
        </div>

        {/* Favorite Books Section */}
        <FavoriteBooks books={favoriteBooks} />

        {/* Offer Section */}
        <OfferSection />

        {/* Must Read Books Section */}
        {/* <MustReadBooks books={mustReadBooks} /> */}

        {/* Author Books Section */}
        <AuthorBooks books={authorBooks} />

        {/* Shop By Category Section */}
        <ShopByCategory />

        <div className={styles.container}>



          {/* Ranking Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Ranking</h2>
              <Link href="/ranking" className={styles.viewAll}>MORE</Link>
            </div>
            <div className={styles.rankingGrid}>
              {/* Column 1 */}
              <div className={styles.rankingColumn}>
                <div className={styles.rankingHeader}>
                  <span className={styles.rankIcon}>🏆</span> Reputation Ranking
                </div>
                {rankingBooks.map((book, index) => (
                  <Link href={`/book/${book._id}`} key={book._id} className={styles.rankItem}>
                    <span className={`${styles.rankNumber} ${styles[`rank${index + 1}`]}`}>{index + 1}</span>
                    <img src={book.coverImage} className={styles.rankImage} alt="" />
                    <div className={styles.rankInfo}>
                      <h4>{book.title}</h4>
                      <p>{book.author}</p>
                    </div>
                  </Link>
                ))}
              </div>
              {/* Column 2 */}
              <div className={styles.rankingColumn}>
                <div className={styles.rankingHeader}>
                  <span className={styles.rankIcon}>🔥</span> Best Selling
                </div>
                {rankingBooks.map((book, index) => (
                  <Link href={`/book/${book._id}`} key={book._id} className={styles.rankItem}>
                    <span className={`${styles.rankNumber} ${styles[`rank${index + 1}`]}`}>{index + 1}</span>
                    <img src={book.coverImage} className={styles.rankImage} alt="" />
                    <div className={styles.rankInfo}>
                      <h4>{book.title}</h4>
                      <p>{book.author}</p>
                    </div>
                  </Link>
                ))}
              </div>
              {/* Column 3 */}
              <div className={styles.rankingColumn}>
                <div className={styles.rankingHeader}>
                  <span className={styles.rankIcon}>💎</span> Moon Ticket Ranking
                </div>
                {rankingBooks.map((book, index) => (
                  <Link href={`/book/${book._id}`} key={book._id} className={styles.rankItem}>
                    <span className={`${styles.rankNumber} ${styles[`rank${index + 1}`]}`}>{index + 1}</span>
                    <img src={book.coverImage} className={styles.rankImage} alt="" />
                    <div className={styles.rankInfo}>
                      <h4>{book.title}</h4>
                      <p>{book.author}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Promo Banner 1 */}
          <section className={styles.promoBanner} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)' }}>
            <div className={styles.promoOverlay}></div>
            <div className={styles.promoContent}>
              <h2>Fantasy Collection</h2>
              <p>Discover magical worlds and epic adventures in our curated fantasy selection.</p>
              <Link href="/shop" className={styles.promoBtn}>Shop Now</Link>
            </div>
          </section>










          {/* Testimonials */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>What Our Readers Say</h2>
            </div>
            <div className={styles.testimonials}>
              <div className={styles.testimonialCard}>
                <p className={styles.quote}>"The best bookstore I've ever used. The collection is amazing and delivery is super fast!"</p>
                <div className={styles.user}>
                  <div className={styles.userInfo}>
                    <h4>Sarah Johnson</h4>
                    <span>Book Lover</span>
                  </div>
                </div>
              </div>
              <div className={styles.testimonialCard}>
                <p className={styles.quote}>"I found so many rare editions here. Highly recommended for any serious collector."</p>
                <div className={styles.user}>
                  <div className={styles.userInfo}>
                    <h4>Michael Chen</h4>
                    <span>Collector</span>
                  </div>
                </div>
              </div>
              <div className={styles.testimonialCard}>
                <p className={styles.quote}>"Great prices and excellent customer support. Will definitely shop here again."</p>
                <div className={styles.user}>
                  <div className={styles.userInfo}>
                    <h4>Emily Davis</h4>
                    <span>Student</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Blog Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Latest News</h2>
              <Link href="/blog" className={styles.viewAll}>Read Blog</Link>
            </div>
            <div className={styles.blogGrid}>
              <div className={styles.blogCard}>
                <img src="https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" className={styles.blogImage} alt="" />
                <div className={styles.blogContent}>
                  <span className={styles.blogDate}>Dec 02, 2025</span>
                  <h3 className={styles.blogTitle}>Top 10 Books to Read This Winter</h3>
                  <Link href="#" className={styles.readMore}>Read More →</Link>
                </div>
              </div>
              <div className={styles.blogCard}>
                <img src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" className={styles.blogImage} alt="" />
                <div className={styles.blogContent}>
                  <span className={styles.blogDate}>Nov 28, 2025</span>
                  <h3 className={styles.blogTitle}>Interview with Best Selling Author</h3>
                  <Link href="#" className={styles.readMore}>Read More →</Link>
                </div>
              </div>
              <div className={styles.blogCard}>
                <img src="https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" className={styles.blogImage} alt="" />
                <div className={styles.blogContent}>
                  <span className={styles.blogDate}>Nov 15, 2025</span>
                  <h3 className={styles.blogTitle}>The Evolution of Digital Reading</h3>
                  <Link href="#" className={styles.readMore}>Read More →</Link>
                </div>
              </div>
            </div>
          </section>

          {/* Newsletter */}
          {/* Newsletter section */}
          <section className={styles.newsletter}>
            <div className={styles.newsletterContent}>
              <h2>Subscribe Our Newsletter</h2>
              <p>Get the latest updates, new releases, and special offers delivered directly to your inbox.</p>
              <form className={styles.newsletterForm}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className={styles.newsletterInput}
                  suppressHydrationWarning
                />
                <button type="submit" className={styles.newsletterBtn}>Subscribe</button>
              </form>
            </div>

            {/* Decorative Floating Icon */}
            <div className={styles.newsletterIconContainer}>
              <FiMail />
            </div>
          </section>

        </div>
        <Footer />
      </main>
    </>
  );
}
