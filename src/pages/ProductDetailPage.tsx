import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Minus,
  Plus,
  Check,
  Package,
  RefreshCw,
  Star,
  ArrowRight,
  ChevronLeft,
  Heart,
  Maximize2,
  X,
  Ruler,
  ShieldCheck,
  Flame,
  Truck,
  Sparkles,
  Share2,
} from 'lucide-react';
import { products, formatPrice } from '../data/products';
import { useCartStore } from '../store/cartStore';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';

const smoothEase = [0.16, 1, 0.3, 1] as const;

const customerReviews = [
  {
    name: 'Marcus V.',
    date: '2 days ago',
    rating: 5,
    title: 'Absolute perfection and comfort',
    comment: 'The materials are top-tier. Cushioning feels responsive right out of the box. Delivery to BGC was fast too!',
    verified: true,
    fit: 'True to Size',
  },
  {
    name: 'Janelle D.',
    date: '1 week ago',
    rating: 5,
    title: 'Iconic sneaker, looks amazing in person',
    comment: 'Colors pop even more than in pictures. Pairs with everything from trackpants to denim.',
    verified: true,
    fit: 'True to Size',
  },
  {
    name: 'Carlo R.',
    date: '2 weeks ago',
    rating: 4,
    title: 'Great pickup, clean craftsmanship',
    comment: 'Solid build quality. A little snug on the toe box initially, but broke in comfortably after two wears.',
    verified: true,
    fit: 'Slightly Snug',
  },
];

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === id);
  const { addItem, openCart } = useCartStore();

  const [colorIdx, setColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'tech' | 'reviews' | 'delivery'>('details');
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setColorIdx(0);
    setSelectedSize(null);
    setQuantity(1);
    setActiveImg(0);
    setAdded(false);
    setSizeError(false);
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 480) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!product) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#fff',
          paddingTop: 66,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: smoothEase }}
          style={{ textAlign: 'center', padding: '2rem' }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👟</div>
          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '3rem',
              color: '#0a0a0a',
              marginBottom: 8,
            }}
          >
            Product Not Found
          </h2>
          <p style={{ color: '#9a9a9a', marginBottom: '1.5rem' }}>
            This sneaker doesn't exist in our collection.
          </p>
          <Link to="/shop" className="btn-primary">
            EXPLORE CATALOG
          </Link>
        </motion.div>
      </div>
    );
  }

  const selectedColor = product.colors[colorIdx];
  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      const sizeSelectorEl = document.getElementById('size-selector-section');
      if (sizeSelectorEl) {
        sizeSelectorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    setSizeError(false);
    addItem(product, selectedColor, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
    openCart();
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setSizeError(true);
      const sizeSelectorEl = document.getElementById('size-selector-section');
      if (sizeSelectorEl) {
        sizeSelectorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    addItem(product, selectedColor, selectedSize, quantity);
    navigate('/checkout');
  };

  return (
    <main style={{ minHeight: '100vh', background: '#ffffff', paddingTop: 66 }}>
      {/* ── BREADCRUMB ── */}
      <div
        style={{
          borderBottom: '1px solid #f0f0ec',
          background: '#fafaf8',
          padding: '0.875rem 1.5rem',
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#6b6b6b',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: '0.825rem',
                fontWeight: 600,
                padding: 0,
              }}
            >
              <ChevronLeft size={16} /> Back
            </button>
            <span style={{ color: '#d0d0c8' }}>/</span>
            <Link
              to="/shop"
              style={{
                color: '#6b6b6b',
                textDecoration: 'none',
                fontSize: '0.825rem',
                fontWeight: 600,
              }}
            >
              Shop
            </Link>
            <span style={{ color: '#d0d0c8' }}>/</span>
            <span style={{ color: '#0a0a0a', fontSize: '0.825rem', fontWeight: 700 }}>
              {product.name}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: product.name, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Product link copied to clipboard!');
                }
              }}
              title="Share"
              style={{
                background: '#fff',
                border: '1px solid #e0e0da',
                borderRadius: 8,
                padding: '5px 10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#555',
              }}
            >
              <Share2 size={13} /> Share
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN PRODUCT SECTION ── */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '3.5rem',
            alignItems: 'start',
          }}
          className="lg:grid-cols-2"
        >
          {/* ── LEFT: IMAGE SHOWCASE ── */}
          <div>
            {/* Primary Main Image Frame */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: smoothEase }}
              style={{
                position: 'relative',
                background: 'linear-gradient(145deg, #f8f8f6, #ededeb)',
                borderRadius: 24,
                overflow: 'hidden',
                aspectRatio: '1',
                border: '1px solid #eeeee8',
                boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
                cursor: 'zoom-in',
              }}
              onClick={() => setLightboxOpen(true)}
            >
              {/* Badges on Image */}
              <div
                style={{
                  position: 'absolute',
                  top: 18,
                  left: 18,
                  zIndex: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                {product.badge && (
                  <span
                    style={{
                      background: product.badge === 'new' ? '#000000' : '#e11d48',
                      color: '#ffffff',
                      padding: '4px 12px',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      borderRadius: 100,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}
                  >
                    {product.badge === 'new'
                      ? 'New Release'
                      : product.badge === 'bestseller'
                      ? 'Best Seller'
                      : 'Sale'}
                  </span>
                )}
                {product.has3D && (
                  <span
                    style={{
                      background: 'rgba(10,10,10,0.85)',
                      backdropFilter: 'blur(8px)',
                      color: '#fff',
                      padding: '4px 10px',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      borderRadius: 100,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Sparkles size={11} color="#38bdf8" /> 3D Model Available
                  </span>
                )}
              </div>

              {/* Zoom & Lightbox Trigger */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxOpen(true);
                }}
                title="Fullscreen Zoom"
                style={{
                  position: 'absolute',
                  top: 18,
                  right: 18,
                  zIndex: 4,
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid #e0e0da',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#0a0a0a',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
              >
                <Maximize2 size={16} />
              </button>

              {/* Image with AnimatePresence */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={product.images[activeImg] || product.images[0]}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: smoothEase }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://placehold.co/800x800/f5f5f3/e11d48?text=${encodeURIComponent(
                      product.name
                    )}`;
                  }}
                />
              </AnimatePresence>

              {/* Photo counter */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 14,
                  right: 14,
                  background: 'rgba(0,0,0,0.65)',
                  backdropFilter: 'blur(6px)',
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  padding: '3px 9px',
                  borderRadius: 100,
                }}
              >
                {activeImg + 1} / {product.images.length}
              </div>
            </motion.div>

            {/* Thumbnail Carousel */}
            {product.images.length > 1 && (
              <div
                style={{
                  display: 'flex',
                  gap: '0.875rem',
                  marginTop: '1rem',
                  overflowX: 'auto',
                  paddingBottom: 4,
                }}
              >
                {product.images.map((img, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      width: 84,
                      height: 84,
                      borderRadius: 14,
                      overflow: 'hidden',
                      padding: 0,
                      border: `2.5px solid ${i === activeImg ? '#0a0a0a' : '#eeeeea'}`,
                      cursor: 'pointer',
                      background: '#f5f5f3',
                      position: 'relative',
                      boxShadow:
                        i === activeImg ? '0 4px 14px rgba(0,0,0,0.12)' : 'none',
                    }}
                  >
                    <img
                      src={img}
                      alt={`Angle ${i + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://placehold.co/84x84/f5f5f3/e11d48?text=Nike';
                      }}
                    />
                  </motion.button>
                ))}
              </div>
            )}

            {/* Brand Authenticity Trust Strip */}
            <div
              style={{
                marginTop: '1.75rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
              }}
            >
              {[
                { icon: ShieldCheck, title: 'Verified 100% Authentic', sub: 'Original Nike Box' },
                { icon: Truck, title: 'Fast Metro Shipping', sub: '24-48 Hours Delivery' },
                { icon: RefreshCw, title: '30-Day Hassle Returns', sub: 'Free exchanges' },
              ].map(({ icon: Icon, title, sub }) => (
                <div
                  key={title}
                  style={{
                    background: '#fafaf8',
                    border: '1px solid #eeeeea',
                    borderRadius: 14,
                    padding: '0.875rem',
                    textAlign: 'center',
                  }}
                >
                  <Icon size={18} color="#e11d48" style={{ margin: '0 auto 4px' }} />
                  <div style={{ color: '#0a0a0a', fontSize: '0.75rem', fontWeight: 700 }}>
                    {title}
                  </div>
                  <div style={{ color: '#999', fontSize: '0.68rem' }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: PRODUCT DETAILS & PURCHASE PANEL ── */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: smoothEase }}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            {/* Live Demand / Social Proof Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#fff3f5',
                border: '1px solid #ffd1dc',
                borderRadius: 100,
                padding: '4px 12px',
                marginBottom: '1rem',
                alignSelf: 'flex-start',
              }}
            >
              <Flame size={14} color="#e11d48" />
              <span style={{ color: '#b91c1c', fontSize: '0.72rem', fontWeight: 700 }}>
                High Demand: 16 people are viewing this right now
              </span>
            </div>

            {/* Category / Sub-type */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  color: '#888',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  fontWeight: 700,
                }}
              >
                Nike Performance · {product.category} · {product.type}
              </span>
              <span
                style={{
                  color: product.stock < 20 ? '#e11d48' : '#16a34a',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                {product.stock < 20
                  ? `⚡ Only ${product.stock} left in stock`
                  : '✓ In Stock & Ready to Ship'}
              </span>
            </div>

            {/* Title */}
            <h1
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(2.75rem, 5vw, 4.5rem)',
                color: '#0a0a0a',
                lineHeight: 1.02,
                margin: '0 0 0.75rem',
                letterSpacing: '0.01em',
              }}
            >
              {product.name}
            </h1>

            {/* Ratings & Reviews Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', gap: 2 }}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    color="#e11d48"
                    fill={i < 4 ? '#e11d48' : 'none'}
                  />
                ))}
              </div>
              <span style={{ color: '#0a0a0a', fontSize: '0.825rem', fontWeight: 700 }}>
                4.8
              </span>
              <span style={{ color: '#aaa', fontSize: '0.8rem' }}>·</span>
              <button
                onClick={() => setActiveTab('reviews')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: '#666',
                  fontSize: '0.825rem',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                128 Verified Reviews
              </button>
            </div>

            {/* Price Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '1rem',
                paddingBottom: '1.5rem',
                borderBottom: '1px solid #f0f0ec',
                marginBottom: '1.5rem',
              }}
            >
              <span
                style={{
                  color: '#0a0a0a',
                  fontWeight: 800,
                  fontSize: '2.4rem',
                  letterSpacing: '-0.03em',
                }}
              >
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <>
                  <span
                    style={{
                      color: '#a0a09c',
                      fontSize: '1.25rem',
                      textDecoration: 'line-through',
                    }}
                  >
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span
                    style={{
                      color: '#16a34a',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      background: 'rgba(22, 163, 74, 0.1)',
                      padding: '4px 10px',
                      borderRadius: 100,
                    }}
                  >
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            {/* Short Narrative */}
            <p
              style={{
                color: '#555555',
                lineHeight: 1.7,
                fontSize: '0.95rem',
                marginBottom: '1.75rem',
              }}
            >
              {product.description}
            </p>

            {/* Colorways Selection */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    color: '#888',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  Colorway:{' '}
                  <strong style={{ color: '#0a0a0a' }}>{selectedColor.name}</strong>
                </span>
                <span style={{ color: '#aaa', fontSize: '0.72rem' }}>
                  {product.colors.length} options
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {product.colors.map((color, i) => (
                  <motion.button
                    key={color.name}
                    onClick={() => setColorIdx(i)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.92 }}
                    title={color.name}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      padding: 0,
                      cursor: 'pointer',
                      background: color.hex,
                      border: `3px solid ${i === colorIdx ? '#0a0a0a' : '#e8e8e4'}`,
                      boxShadow:
                        i === colorIdx
                          ? '0 0 0 2px #fff, 0 0 0 4px #0a0a0a'
                          : '0 1px 4px rgba(0,0,0,0.1)',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector Section */}
            <div id="size-selector-section" style={{ marginBottom: '1.75rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span
                    style={{
                      color: sizeError ? '#ef4444' : '#888',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {sizeError ? '⚠ Please select a size first' : 'Select US Men’s Size'}
                  </span>
                </div>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: '#0a0a0a',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Ruler size={13} /> Size Chart
                </button>
              </div>

              {/* Sizes Buttons */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(58px, 1fr))',
                  gap: '0.5rem',
                }}
              >
                {product.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <motion.button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        setSizeError(false);
                      }}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                      style={{
                        height: 44,
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        borderRadius: 10,
                        cursor: 'pointer',
                        border: `1.5px solid ${
                          isSelected
                            ? '#0a0a0a'
                            : sizeError
                            ? '#fca5a5'
                            : '#e5e5e0'
                        }`,
                        background: isSelected ? '#0a0a0a' : '#ffffff',
                        color: isSelected ? '#ffffff' : '#1a1a1a',
                        boxShadow: isSelected
                          ? '0 4px 12px rgba(0,0,0,0.18)'
                          : 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {size}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div style={{ marginBottom: '1.75rem' }}>
              <span
                style={{
                  display: 'block',
                  color: '#888',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: 8,
                }}
              >
                Quantity
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <motion.button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  whileHover={{ scale: 1.08, background: '#0a0a0a', color: '#fff' }}
                  whileTap={{ scale: 0.92 }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    border: '1.5px solid #e0e0da',
                    background: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0a0a0a',
                  }}
                >
                  <Minus size={15} />
                </motion.button>
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: '1.15rem',
                    minWidth: 32,
                    textAlign: 'center',
                    color: '#0a0a0a',
                  }}
                >
                  {quantity}
                </span>
                <motion.button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  whileHover={{ scale: 1.08, background: '#0a0a0a', color: '#fff' }}
                  whileTap={{ scale: 0.92 }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    border: '1.5px solid #e0e0da',
                    background: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0a0a0a',
                  }}
                >
                  <Plus size={15} />
                </motion.button>
              </div>
            </div>

            {/* CTAs: Add to Cart, Buy Now, Wishlist */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr auto',
                gap: '0.75rem',
                marginBottom: '1.75rem',
              }}
            >
              <motion.button
                onClick={handleAddToCart}
                id={`product-add-cart-${product.id}`}
                whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(0,0,0,0.2)' }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '1.05rem',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  borderRadius: 14,
                  border: 'none',
                  cursor: 'pointer',
                  color: '#fff',
                  background: added ? '#16a34a' : '#0a0a0a',
                  transition: 'background 0.3s ease',
                }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {added ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <Check size={16} /> ADDED TO CART!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <ShoppingCart size={16} /> ADD TO CART
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <motion.button
                onClick={handleBuyNow}
                id={`product-buy-now-${product.id}`}
                whileHover={{ scale: 1.02, background: '#0a0a0a', color: '#fff' }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1.05rem',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  borderRadius: 14,
                  cursor: 'pointer',
                  border: '2px solid #0a0a0a',
                  background: 'transparent',
                  color: '#0a0a0a',
                  transition: 'all 0.25s ease',
                }}
              >
                BUY NOW
              </motion.button>

              <motion.button
                onClick={() => setIsWishlisted(!isWishlisted)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  border: '1.5px solid #e5e5e0',
                  background: isWishlisted ? '#ffe4e6' : '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isWishlisted ? '#e11d48' : '#6b6b6b',
                }}
              >
                <Heart size={20} fill={isWishlisted ? '#e11d48' : 'none'} />
              </motion.button>
            </div>

            {/* Delivery Assurance Callout */}
            <div
              style={{
                background: '#f8f8f6',
                borderRadius: 16,
                padding: '1.25rem',
                border: '1px solid #eeeeea',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#333', fontSize: '0.85rem' }}>
                <Package size={17} color="#e11d48" style={{ flexShrink: 0 }} />
                <span>
                  <strong>Free Nationwide Shipping</strong> on orders above ₱5,000.
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#333', fontSize: '0.85rem' }}>
                <RefreshCw size={17} color="#e11d48" style={{ flexShrink: 0 }} />
                <span>
                  <strong>30-Day Hassle-Free Returns</strong> for unworn pairs with receipt.
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── INTERACTIVE TABS SECTION ── */}
        <section style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid #eeeee8' }}>
          {/* Tab Navigation Header */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              borderBottom: '1px solid #e5e5e0',
              marginBottom: '2.5rem',
              overflowX: 'auto',
            }}
          >
            {[
              { id: 'details', label: 'Story & Specifications' },
              { id: 'tech', label: 'Innovation & Tech' },
              { id: 'reviews', label: 'Customer Reviews (128)' },
              { id: 'delivery', label: 'Shipping & Delivery' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '0.75rem 1.25rem 1rem',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: isActive ? '#0a0a0a' : '#888',
                    position: 'relative',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.2s',
                  }}
                >
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      style={{
                        position: 'absolute',
                        bottom: -1,
                        left: 0,
                        right: 0,
                        height: 3,
                        background: '#0a0a0a',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'details' && (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: smoothEase }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '3.5rem',
                }}
              >
                <div>
                  <h3
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: '2rem',
                      color: '#0a0a0a',
                      marginBottom: '1rem',
                    }}
                  >
                    THE STORY BEHIND THE ICON
                  </h3>
                  <p style={{ color: '#555', lineHeight: 1.8, fontSize: '0.95rem' }}>
                    {product.longDescription}
                  </p>
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: '2rem',
                      color: '#0a0a0a',
                      marginBottom: '1rem',
                    }}
                  >
                    TECHNICAL SPECIFICATIONS
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {product.specs.map((spec) => (
                      <div
                        key={spec.label}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '0.85rem 0',
                          borderBottom: '1px solid #f0f0ec',
                          fontSize: '0.875rem',
                        }}
                      >
                        <span style={{ color: '#888' }}>{spec.label}</span>
                        <span style={{ color: '#0a0a0a', fontWeight: 700 }}>{spec.value}</span>
                      </div>
                    ))}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0.85rem 0',
                        borderBottom: '1px solid #f0f0ec',
                        fontSize: '0.875rem',
                      }}
                    >
                      <span style={{ color: '#888' }}>Origin</span>
                      <span style={{ color: '#0a0a0a', fontWeight: 700 }}>Nike Authentics PH</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'tech' && (
              <motion.div
                key="tech"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: smoothEase }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1.5rem',
                }}
              >
                {[
                  {
                    title: 'Encapsulated Nike Air Unit',
                    desc: 'Pressurized air inside a tough yet flexible membrane provides lightweight energy return and all-day shock absorption.',
                  },
                  {
                    title: 'Multi-Directional Pivot Circle',
                    desc: 'Circular herringbone pattern engineered originally for court pivots offers supreme street grip and non-slip traction.',
                  },
                  {
                    title: 'Reinforced Double-Stitched Overlays',
                    desc: 'Durable full-grain leather panels engineered to withstand heavy wear while molding comfortably to foot anatomy.',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    style={{
                      background: '#fafaf8',
                      border: '1px solid #eeeee8',
                      borderRadius: 18,
                      padding: '1.5rem',
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: '#0a0a0a',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1rem',
                      }}
                    >
                      <Sparkles size={16} />
                    </div>
                    <h4 style={{ color: '#0a0a0a', fontWeight: 800, fontSize: '1rem', marginBottom: 8 }}>
                      {item.title}
                    </h4>
                    <p style={{ color: '#666', fontSize: '0.875rem', lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: smoothEase }}
              >
                {/* Rating Overview Box */}
                <div
                  style={{
                    background: '#fcfcfb',
                    border: '1px solid #eeeee8',
                    borderRadius: 20,
                    padding: '2rem',
                    marginBottom: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '2rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '4.5rem', color: '#0a0a0a', lineHeight: 1 }}>
                      4.8
                    </div>
                    <div>
                      <div style={{ display: 'flex', gap: 3, marginBottom: 4 }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={18} color="#e11d48" fill="#e11d48" />
                        ))}
                      </div>
                      <div style={{ color: '#666', fontSize: '0.85rem', fontWeight: 600 }}>
                        Based on 128 verified customer ratings
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: 700, textTransform: 'uppercase' }}>
                        Fit Rating
                      </div>
                      <div style={{ fontSize: '1rem', color: '#0a0a0a', fontWeight: 800 }}>
                        94% Fits True to Size
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: 700, textTransform: 'uppercase' }}>
                        Comfort Score
                      </div>
                      <div style={{ fontSize: '1rem', color: '#0a0a0a', fontWeight: 800 }}>
                        9.7 / 10
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reviews List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {customerReviews.map((rev) => (
                    <div
                      key={rev.name}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #eeeee8',
                        borderRadius: 16,
                        padding: '1.5rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0a0a0a' }}>
                            {rev.name}
                          </span>
                          {rev.verified && (
                            <span
                              style={{
                                background: '#e0f2fe',
                                color: '#0369a1',
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: 100,
                              }}
                            >
                              ✓ Verified Buyer
                            </span>
                          )}
                        </div>
                        <span style={{ color: '#999', fontSize: '0.75rem' }}>{rev.date}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} size={14} color="#e11d48" fill="#e11d48" />
                        ))}
                      </div>
                      <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0a0a0a', marginBottom: 6 }}>
                        {rev.title}
                      </h4>
                      <p style={{ color: '#555', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'delivery' && (
              <motion.div
                key="delivery"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: smoothEase }}
                style={{
                  background: '#fafaf8',
                  borderRadius: 20,
                  padding: '2rem',
                  border: '1px solid #eeeee8',
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                  <div>
                    <h4 style={{ color: '#0a0a0a', fontWeight: 800, fontSize: '1.1rem', marginBottom: 12 }}>
                      Delivery Estimates
                    </h4>
                    <p style={{ color: '#555', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: 12 }}>
                      • <strong>Metro Manila:</strong> 1–2 business days via Express Courier.<br />
                      • <strong>Luzon Provinces:</strong> 2–4 business days.<br />
                      • <strong>Visayas & Mindanao:</strong> 3–6 business days via Air Freight.
                    </p>
                    <p style={{ color: '#888', fontSize: '0.8rem' }}>
                      All shipments are fully insured and tracked with live SMS & Email notifications.
                    </p>
                  </div>
                  <div>
                    <h4 style={{ color: '#0a0a0a', fontWeight: 800, fontSize: '1.1rem', marginBottom: 12 }}>
                      Return & Exchange Policy
                    </h4>
                    <p style={{ color: '#555', fontSize: '0.875rem', lineHeight: 1.6 }}>
                      Need to exchange your size? We offer free returns and size exchanges within 30 days of receipt provided the sneakers are in unworn condition with all original tags and shoebox intact.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ── RELATED PRODUCTS ── */}
        {related.length > 0 && (
          <section style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid #eeeee8' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <span
                  style={{
                    color: '#e11d48',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                  }}
                >
                  Recommended For You
                </span>
                <h2
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '2.5rem',
                    color: '#0a0a0a',
                    margin: '0.2rem 0 0',
                  }}
                >
                  YOU MAY ALSO LIKE
                </h2>
              </div>
              <Link
                to="/shop"
                style={{
                  color: '#6b6b6b',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                View Catalog <ArrowRight size={14} />
              </Link>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── STICKY FLOATING CTA BAR (ON SCROLL) ── */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.35, ease: smoothEase }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1000,
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(16px)',
              borderTop: '1px solid #eeeee8',
              boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
              padding: '0.75rem 1.5rem',
            }}
          >
            <div
              style={{
                maxWidth: 1400,
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img
                  src={product.images[0]}
                  alt={product.name}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    objectFit: 'cover',
                    border: '1px solid #eeeee8',
                  }}
                />
                <div>
                  <div style={{ color: '#0a0a0a', fontWeight: 800, fontSize: '0.9rem' }}>
                    {product.name}
                  </div>
                  <div style={{ color: '#888', fontSize: '0.75rem' }}>
                    {selectedSize ? `Size: US ${selectedSize}` : 'Please select size'} ·{' '}
                    <strong style={{ color: '#0a0a0a' }}>{formatPrice(product.price)}</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <motion.button
                  onClick={handleAddToCart}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="btn-primary"
                  style={{ padding: '0.65rem 1.5rem', fontSize: '0.75rem' }}
                >
                  <ShoppingCart size={14} /> ADD TO CART
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SIZE GUIDE MODAL ── */}
      <AnimatePresence>
        {sizeGuideOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 2500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSizeGuideOpen(false)}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(4px)',
              }}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{
                position: 'relative',
                background: '#ffffff',
                borderRadius: 20,
                maxWidth: 580,
                width: '100%',
                padding: '2rem',
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.25rem',
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '2rem',
                    color: '#0a0a0a',
                    margin: 0,
                  }}
                >
                  NIKE OFFICIAL FOOTWEAR SIZING
                </h3>
                <button
                  onClick={() => setSizeGuideOpen(false)}
                  style={{
                    background: '#f2f2ef',
                    border: 'none',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <X size={16} />
                </button>
              </div>
              <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Use this conversion chart to find your perfect fit. For Nike basketball and lifestyle shoes, we recommend ordering true to size.
              </p>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  textAlign: 'center',
                  fontSize: '0.825rem',
                  marginBottom: '1.5rem',
                }}
              >
                <thead>
                  <tr style={{ background: '#f5f5f3', borderBottom: '2px solid #eeeee8' }}>
                    <th style={{ padding: '8px' }}>US Men</th>
                    <th style={{ padding: '8px' }}>US Women</th>
                    <th style={{ padding: '8px' }}>UK</th>
                    <th style={{ padding: '8px' }}>EUR</th>
                    <th style={{ padding: '8px' }}>CM</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [7, 8.5, 6, 40, 25.0],
                    [7.5, 9, 6.5, 40.5, 25.5],
                    [8, 9.5, 7, 41, 26.0],
                    [8.5, 10, 7.5, 42, 26.5],
                    [9, 10.5, 8, 42.5, 27.0],
                    [9.5, 11, 8.5, 43, 27.5],
                    [10, 11.5, 9, 44, 28.0],
                    [10.5, 12, 9.5, 44.5, 28.5],
                    [11, 12.5, 10, 45, 29.0],
                    [12, 13.5, 11, 46, 30.0],
                  ].map(([usm, usw, uk, eur, cm]) => (
                    <tr key={usm} style={{ borderBottom: '1px solid #f0f0ec' }}>
                      <td style={{ padding: '8px', fontWeight: 700 }}>{usm}</td>
                      <td style={{ padding: '8px', color: '#666' }}>{usw}</td>
                      <td style={{ padding: '8px', color: '#666' }}>{uk}</td>
                      <td style={{ padding: '8px', color: '#666' }}>{eur}</td>
                      <td style={{ padding: '8px', color: '#666' }}>{cm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div
                style={{
                  background: '#f8f8f6',
                  padding: '1rem',
                  borderRadius: 12,
                  fontSize: '0.78rem',
                  color: '#666',
                }}
              >
                💡 <strong>Fit Tip:</strong> If you have wider feet or prefer extra room in the toe box, consider sizing up by a half-size (0.5 US).
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── LIGHTBOX FULLSCREEN ZOOM ── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 3000,
              background: 'rgba(0,0,0,0.92)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
            }}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              style={{
                position: 'absolute',
                top: 24,
                right: 24,
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: '#fff',
                width: 44,
                height: 44,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={22} />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={product.images[activeImg] || product.images[0]}
              alt={product.name}
              style={{
                maxWidth: '90vw',
                maxHeight: '85vh',
                objectFit: 'contain',
                borderRadius: 12,
                boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
