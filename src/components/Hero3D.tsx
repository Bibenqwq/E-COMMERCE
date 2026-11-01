import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Check } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { products } from '../data/products';

export default function Hero3D() {
  const [added, setAdded] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const { addItem, openCart } = useCartStore();
  const jordanProduct = products.find((p) => p.id === 'air-jordan-1-retro-high') || products[0];

  const handleQuickAdd = () => {
    addItem(jordanProduct, jordanProduct.colors[0], 9.5, 1);
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <section
      id="hero-360-viewer"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '680px',
        maxHeight: '1000px',
        background: 'radial-gradient(ellipse 85% 75% at 50% 45%, #242427 0%, #151518 50%, #0d0d0f 100%)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── TOP-LEFT: Nike Branding & 360° Title ── */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute',
          top: '5.5rem',
          left: '2.5rem',
          zIndex: 25,
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          pointerEvents: 'auto',
        }}
      >
        {/* Nike Swoosh */}
        <Link to="/" aria-label="Nike Home" style={{ display: 'flex', alignItems: 'center' }}>
          <svg viewBox="0 0 80 30" style={{ width: 56, height: 22, fill: '#ffffff' }}>
            <path d="M9.333 0L0 22.5l29.867-8.4C36.133 12 40.933 8.1 38.4 4.5c-2.667-3.9-10.267-2.1-15.867 1.5L9.333 0zM80 0L20 22.5l9.867-2.7L80 0z" />
          </svg>
        </Link>

        {/* Text */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1
            style={{
              color: '#ffffff',
              fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
              fontWeight: 800,
              letterSpacing: '0.06em',
              lineHeight: 1.15,
              margin: 0,
              textTransform: 'uppercase',
              fontFamily: "'Inter', -apple-system, sans-serif",
            }}
          >
            NIKE AIR JORDAN 1
          </h1>
          <span
            style={{
              color: 'rgba(255, 255, 255, 0.45)',
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              marginTop: '0.2rem',
            }}
          >
            360° VIEW
          </span>
        </div>
      </motion.div>

      {/* ── TOP-RIGHT: Drag to Rotate / Scroll to Zoom Pill ── */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute',
          top: '5.5rem',
          right: '2.5rem',
          zIndex: 25,
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          padding: '0.65rem 1.15rem',
          borderRadius: 22,
          background: 'rgba(25, 25, 28, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          pointerEvents: 'none',
        }}
      >
        {/* Animated Mouse Icon */}
        <div
          style={{
            width: 18,
            height: 28,
            border: '1.5px solid rgba(255, 255, 255, 0.75)',
            borderRadius: 10,
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <motion.div
            animate={{ y: [2, 8, 2], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: 2.5,
              height: 5,
              background: '#ffffff',
              borderRadius: 2,
              marginTop: 4,
            }}
          />
        </div>

        {/* Text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.92)', fontSize: '0.78rem', fontWeight: 500, lineHeight: 1.2 }}>
            Click and drag to rotate
          </span>
          <span style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: '0.7rem', lineHeight: 1.2 }}>
            Scroll to zoom
          </span>
        </div>
      </motion.div>

      {/* ── SKETCHFAB 3D VIEWER: THE REAL AUTHENTIC NIKE AIR JORDAN 1 ── */}
      <div
        className="sketchfab-embed-wrapper"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 10,
          overflow: 'hidden',
        }}
      >
        {/* Loading Spinner */}
        {!iframeLoaded && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              color: '#ffffff',
              zIndex: 15,
              background: 'radial-gradient(ellipse 80% 70% at 50% 45%, #222225 0%, #151518 50%, #0d0d0f 100%)',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                border: '3px solid rgba(255,255,255,0.15)',
                borderTopColor: '#ffffff',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <span style={{ fontSize: '0.78rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>
              Loading 3D Air Jordan 1...
            </span>
          </div>
        )}

        <iframe
          title="Nike Air Jordan"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; fullscreen; xr-spatial-tracking"
          src="https://sketchfab.com/models/c00345fd64414c4e8895c6aaa262e4d5/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_watermark=0&ui_hint=0&ui_help=0&ui_settings=0&ui_inspector=0&dnt=1"
          onLoad={() => setIframeLoaded(true)}
          style={{
            position: 'absolute',
            top: '-52px',
            left: 0,
            width: '100%',
            height: 'calc(100% + 52px)',
            border: 'none',
            display: 'block',
          }}
        />
      </div>

      {/* ── FLOATING PRODUCT QUICK BUY PILL (Bottom Left) ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '2.5rem',
          zIndex: 25,
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '0.65rem 1.15rem',
          background: 'rgba(20, 20, 24, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 14,
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
        }}
        className="hidden md:flex"
      >
        <div>
          <div style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            Official Release
          </div>
          <div style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700 }}>
            ₱9,995 <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', textDecoration: 'line-through', fontWeight: 400 }}>₱11,995</span>
          </div>
        </div>

        <button
          onClick={handleQuickAdd}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.55rem 0.95rem',
            background: added ? '#22c55e' : '#ffffff',
            color: added ? '#ffffff' : '#0a0a0a',
            border: 'none',
            borderRadius: 8,
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.25s ease',
          }}
        >
          {added ? <Check size={14} /> : <ShoppingBag size={14} />}
          {added ? 'ADDED' : 'BUY NOW'}
        </button>

        <Link
          to={`/product/${jordanProduct.id}`}
          style={{
            color: 'rgba(255, 255, 255, 0.65)',
            fontSize: '0.72rem',
            textDecoration: 'none',
            padding: '0.2rem 0.4rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.25)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)')}
        >
          Details
        </Link>
      </motion.div>
    </section>
  );
}
