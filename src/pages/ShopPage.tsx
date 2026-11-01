import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, RotateCcw, Award, Sparkles } from 'lucide-react';
import ProductGrid from '../components/ProductGrid';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';

const smoothEase = [0.16, 1, 0.3, 1] as const;

const categoryCards = [
  {
    title: 'All Sneakers',
    badge: 'Catalog',
    cat: 'All',
    count: '12 Models',
    img: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&q=80',
  },
  {
    title: 'Basketball',
    badge: 'Hardwood OG',
    cat: 'Basketball',
    count: 'Court Proven',
    img: 'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=600&q=80',
  },
  {
    title: 'Lifestyle',
    badge: 'Streetwear Icons',
    cat: 'Lifestyle',
    count: 'Daily Heat',
    img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80',
  },
  {
    title: 'Running',
    badge: 'Air & ZoomX',
    cat: 'Running',
    count: 'Performance',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  },
];

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const badge = searchParams.get('badge') || '';
  const [selectedCat, setSelectedCat] = useState<'All' | 'Lifestyle' | 'Basketball' | 'Running'>('All');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const title =
    badge === 'new'
      ? 'New Arrivals'
      : badge === 'bestseller'
      ? 'Best Sellers'
      : search
      ? `Results: "${search}"`
      : 'Sneaker Collection';

  return (
    <main style={{ minHeight: '100vh', background: '#ffffff', paddingTop: 66 }}>
      {/* ── 1. CINEMATIC SHOP HERO BANNER ── */}
      <section
        style={{
          background: 'linear-gradient(180deg, #0d0d11 0%, #17171e 65%, #202028 100%)',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          padding: '4.5rem 1.5rem 3.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Ambient background watermarks */}
        <div
          style={{
            position: 'absolute',
            right: '-3%',
            top: '5%',
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(8rem, 20vw, 18rem)',
            color: 'rgba(255,255,255,0.03)',
            lineHeight: 0.8,
            pointerEvents: 'none',
            userSelect: 'none',
            letterSpacing: '0.05em',
          }}
        >
          JUST DO IT
        </div>

        <div style={{ maxWidth: 1400, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          {/* Tag Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: smoothEase }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', padding: '5px 14px', borderRadius: 100, marginBottom: '1.25rem' }}
          >
            <Sparkles size={13} color="#e11d48" />
            <span style={{ color: '#fff', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Official Nike Store · 2026 Drops
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: smoothEase }}
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(3.5rem, 8vw, 7rem)',
              color: '#ffffff',
              lineHeight: 0.95,
              margin: '0 0 1rem',
              letterSpacing: '0.01em',
            }}
          >
            {title.toUpperCase()}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: smoothEase }}
            style={{ color: '#a0a0ab', fontSize: '1rem', maxWidth: 640, lineHeight: 1.6, marginBottom: '2.5rem' }}
          >
            Engineered for champions, crafted for the streets. Discover our lineup of authentic Nike, Jordan, and Dunk footwear with responsive cushioning and iconic designs.
          </motion.p>

          {/* Category Visual Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
            }}
          >
            {categoryCards.map((card, i) => {
              const isSelected = selectedCat === card.cat;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.5, ease: smoothEase }}
                  whileHover={{ scale: 1.025, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCat(card.cat as any)}
                  style={{
                    position: 'relative',
                    height: 120,
                    borderRadius: 16,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: isSelected ? '2px solid #e11d48' : '1px solid rgba(255,255,255,0.12)',
                    boxShadow: isSelected ? '0 0 20px rgba(225,29,72,0.3)' : '0 4px 20px rgba(0,0,0,0.3)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <img
                    src={card.img}
                    alt={card.title}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'brightness(0.65)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 100%)',
                    }}
                  />
                  <div style={{ position: 'relative', zIndex: 2, padding: '1rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <span style={{ color: isSelected ? '#e11d48' : '#e0e0e8', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                      {card.badge}
                    </span>
                    <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', color: '#fff', margin: 0, letterSpacing: '0.03em' }}>
                      {card.title}
                    </h3>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 2. VALUE PROPOSITION STRIP ── */}
      <section
        style={{
          background: '#f8f8f6',
          borderBottom: '1px solid #eeeeea',
          padding: '1.25rem 1.5rem',
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          {[
            { icon: ShieldCheck, title: '100% Guaranteed Authentic', sub: 'Verified Nike Box & Tags' },
            { icon: Truck, title: 'Free Express Shipping', sub: 'On all orders above ₱5,000' },
            { icon: RotateCcw, title: '30-Day Hassle-Free Returns', sub: 'Unworn items policy' },
            { icon: Award, title: 'Official Nike Member Perks', sub: 'Exclusive drop access' },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: '#ffffff',
                  border: '1px solid #e5e5df',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#e11d48',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                }}
              >
                <Icon size={18} />
              </div>
              <div>
                <div style={{ color: '#0a0a0a', fontSize: '0.8rem', fontWeight: 700 }}>{title}</div>
                <div style={{ color: '#888', fontSize: '0.72rem' }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. PRODUCT CATALOG GRID ── */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '3.5rem 1.5rem 6rem' }}>
        <ProductGrid
          showFilters
          initialSearch={search}
          initialBadge={badge}
          initialCategory={selectedCat}
        />
      </div>

      <Newsletter />
      <Footer />
    </main>
  );
}
