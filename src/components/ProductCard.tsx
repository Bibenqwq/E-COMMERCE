import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Eye, Star, Check } from 'lucide-react';
import type { Product } from '../types';
import { useCartStore } from '../store/cartStore';
import { formatPrice } from '../data/products';

interface ProductCardProps { product: Product; index?: number; }

const badgeConfig: Record<string, { label: string; bg: string; color: string }> = {
  new: { label: 'New', bg: '#000000', color: '#fff' },
  bestseller: { label: 'Best Seller', bg: '#0a0a0a', color: '#fff' },
  sale: { label: 'Sale', bg: '#ef4444', color: '#fff' },
};

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [colorIdx, setColorIdx] = useState(0);
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { openCart, addItem } = useCartStore();

  const selectedColor = product.colors[colorIdx];
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null;
  const rating = (4.3 + (product.popularity % 10) * 0.05).toFixed(1);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    addItem(product, selectedColor, product.sizes[Math.floor(product.sizes.length / 2)]);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    openCart();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 35, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -10, boxShadow: '0 28px 60px rgba(0,0,0,0.12)' }}
      style={{
        background: '#fff', border: '1px solid #eeeeea',
        borderRadius: 16, overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        display: 'flex', flexDirection: 'column',
        willChange: 'transform',
      }}
    >
      {/* Image */}
      <Link to={`/product/${product.id}`} style={{ display: 'block', position: 'relative' }}>
        <AnimatePresence>
          {product.badge && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: 'absolute', top: 12, left: 12, zIndex: 5, background: badgeConfig[product.badge]?.bg, color: badgeConfig[product.badge]?.color, padding: '3px 10px', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: 100 }}
            >
              {badgeConfig[product.badge]?.label}
            </motion.div>
          )}
        </AnimatePresence>
        {discount && (
          <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 5, background: '#ef4444', color: '#fff', padding: '3px 8px', fontSize: '0.62rem', fontWeight: 700, borderRadius: 100 }}>
            -{discount}%
          </div>
        )}

        <div style={{ position: 'relative', overflow: 'hidden', background: '#f5f5f3', aspectRatio: '4/3' }}>
          <motion.img
            src={product.images[0]} alt={product.name} loading="lazy"
            animate={{ scale: hovered ? 1.08 : 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/400x300/f5f5f3/ff3c00?text=${encodeURIComponent(product.name)}`; }}
          />
          {/* Quick view overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={hovered ? { y: 0, opacity: 1 } : { y: 12, opacity: 0 }}
              transition={{ duration: 0.35, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              style={{ background: '#fff', borderRadius: 100, padding: '0.6rem 1.125rem', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 20px rgba(0,0,0,0.12)', fontSize: '0.8rem', fontWeight: 700, color: '#0a0a0a' }}
            >
              <Eye size={15} /> Quick View
            </motion.div>
          </motion.div>
        </div>
      </Link>

      {/* Info */}
      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ color: '#9a9a9a', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{product.category}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#9a9a9a', fontSize: '0.7rem' }}>
            <Star size={11} color="#000000" fill="#000000" /> {rating}
          </span>
        </div>

        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{ color: '#0a0a0a', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', transition: 'color 0.35s cubic-bezier(0.16,1,0.3,1)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#000000')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#0a0a0a')}>
            {product.name}
          </h3>
        </Link>

        {/* Color swatches */}
        <div style={{ display: 'flex', gap: 5, marginBottom: '0.625rem' }}>
          {product.colors.map((color, i) => (
            <motion.button key={color.name} onClick={() => setColorIdx(i)} title={color.name}
              animate={{
                scale: i === colorIdx ? 1.2 : 1,
                borderColor: i === colorIdx ? '#000000' : '#e0e0da',
              }}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 500, damping: 22 }}
              style={{
                width: 16, height: 16, borderRadius: '50%', border: '2px solid',
                background: color.hex, cursor: 'pointer', padding: 0, outline: 'none',
              }} />
          ))}
        </div>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: '0.875rem' }}>
          <span style={{ color: '#0a0a0a', fontWeight: 800, fontSize: '1rem' }}>{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span style={{ color: '#c0c0b8', fontSize: '0.8rem', textDecoration: 'line-through' }}>{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        {/* Add to cart */}
        <motion.button
          onClick={handleQuickAdd} id={`add-to-cart-${product.id}`}
          whileHover={{ scale: 1.03, boxShadow: '0 6px 20px rgba(0,0,0,0.15)' }}
          whileTap={{ scale: 0.97 }}
          animate={{ background: added ? '#22c55e' : '#0a0a0a' }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '0.625rem', fontSize: '0.73rem', fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: 10,
            border: 'none', cursor: 'pointer', marginTop: 'auto',
            color: '#fff',
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {added ? (
              <motion.span key="added"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Check size={13} /> ADDED!
              </motion.span>
            ) : (
              <motion.span key="add"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <ShoppingCart size={13} /> ADD TO CART
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
}
