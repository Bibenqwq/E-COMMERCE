import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { formatPrice } from '../data/products';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const } },
};

const drawerVariants = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: { type: 'spring' as const, damping: 28, stiffness: 280, mass: 0.9 } },
  exit: { x: '100%', transition: { duration: 0.35, ease: [0.32, 0, 0.67, 0] as const } },
};

const itemVariants = {
  hidden: { opacity: 0, x: 30, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1, x: 0, scale: 1,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  }),
  exit: { opacity: 0, x: -30, scale: 0.95, height: 0, marginBottom: 0, padding: 0,
    transition: { duration: 0.35, ease: [0.32, 0, 0.67, 0] as const },
  },
};

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore();
  const drawerRef = useRef<HTMLDivElement>(null);
  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const shipping = totalPrice >= 5000 ? 0 : 299;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeCart]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeCart}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(6px)', zIndex: 2000 }}
          />

          <motion.div ref={drawerRef}
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: 'fixed', right: 0, top: 0, bottom: 0, width: '100%', maxWidth: 420,
              background: '#fff', zIndex: 2001, display: 'flex', flexDirection: 'column',
              boxShadow: '-12px 0 50px rgba(0,0,0,0.1)', borderLeft: '1px solid #eeeeea',
            }}>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #f0f0ec' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ShoppingBag size={20} color="#000000" />
                <h2 style={{ color: '#0a0a0a', fontSize: '1rem', fontWeight: 700, margin: 0 }}>Your Cart</h2>
                <AnimatePresence mode="wait">
                  {totalItems > 0 && (
                    <motion.span
                      key={totalItems}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                      style={{ background: '#000000', color: '#fff', fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: 100 }}
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <motion.button
                onClick={closeCart}
                whileHover={{ scale: 1.1, background: '#eeeee8' }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                style={{ background: '#f5f5f3', border: 'none', cursor: 'pointer', color: '#6b6b6b', padding: '0.5rem', display: 'flex', borderRadius: 8 }}
              >
                <X size={18} />
              </motion.button>
            </motion.div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
              <AnimatePresence mode="popLayout">
                {items.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320, gap: '1rem', textAlign: 'center' }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                      style={{ width: 72, height: 72, background: '#f5f5f3', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <ShoppingBag size={32} color="#c0c0b8" />
                    </motion.div>
                    <p style={{ color: '#0a0a0a', fontSize: '1rem', fontWeight: 600 }}>Your cart is empty</p>
                    <p style={{ color: '#9a9a9a', fontSize: '0.875rem' }}>Add some sneakers to get started.</p>
                    <button onClick={closeCart} className="btn-primary">SHOP NOW</button>
                  </motion.div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {items.map((item, i) => (
                      <motion.div key={`${item.product.id}-${item.selectedColor.name}-${item.selectedSize}`}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        custom={i}
                        layout
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        style={{ display: 'flex', gap: '0.75rem', padding: '0.875rem', background: '#f8f8f6', border: '1px solid #eeeeea', borderRadius: 12, overflow: 'hidden' }}>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          style={{ width: 72, height: 72, flexShrink: 0, background: '#fff', borderRadius: 8, overflow: 'hidden', border: '1px solid #eeeeea' }}
                        >
                          <img src={item.product.images[0]} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/72x72/f5f5f3/ff3c00?text=Nike'; }} />
                        </motion.div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{ color: '#0a0a0a', fontSize: '0.875rem', fontWeight: 700, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.product.name}</h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                            <span style={{ width: 10, height: 10, borderRadius: '50%', background: item.selectedColor.hex, border: '1px solid #e8e8e4', flexShrink: 0 }} />
                            <span style={{ color: '#9a9a9a', fontSize: '0.72rem' }}>{item.selectedColor.name} · US {item.selectedSize}</span>
                          </div>
                          <div style={{ color: '#000000', fontSize: '0.875rem', fontWeight: 800, marginBottom: '0.5rem' }}>{formatPrice(item.product.price)}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {[
                              { action: () => updateQuantity(item.product.id, item.selectedColor.name, item.selectedSize, item.quantity - 1), icon: <Minus size={10} /> },
                              null,
                              { action: () => updateQuantity(item.product.id, item.selectedColor.name, item.selectedSize, item.quantity + 1), icon: <Plus size={10} /> },
                            ].map((btn, j) =>
                              btn === null ? (
                                <motion.span key={`qty-${j}-${item.quantity}`}
                                  initial={{ scale: 1.3, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                                  style={{ color: '#0a0a0a', fontWeight: 700, fontSize: '0.875rem', minWidth: 20, textAlign: 'center' }}
                                >
                                  {item.quantity}
                                </motion.span>
                              ) : (
                                <motion.button key={j} onClick={btn.action}
                                  whileHover={{ scale: 1.15, background: '#0a0a0a', color: '#fff' }}
                                  whileTap={{ scale: 0.85 }}
                                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                                  style={{ width: 24, height: 24, borderRadius: 6, border: '1px solid #e8e8e4', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b6b6b' }}>
                                  {btn.icon}
                                </motion.button>
                              )
                            )}
                            <motion.button
                              onClick={() => removeItem(item.product.id, item.selectedColor.name, item.selectedSize)}
                              whileHover={{ scale: 1.15, color: '#ef4444' }}
                              whileTap={{ scale: 0.85 }}
                              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                              style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#c0c0b8', display: 'flex' }}>
                              <Trash2 size={14} />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <AnimatePresence>
              {items.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  style={{ borderTop: '1px solid #f0f0ec', padding: '1.25rem 1.5rem' }}
                >
                  <div style={{ marginBottom: '1.1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, fontSize: '0.75rem' }}>
                      {shipping === 0 ? (
                        <span style={{ color: '#16a34a', fontWeight: 800 }}>✓ Free Shipping Unlocked!</span>
                      ) : (
                        <span style={{ color: '#666' }}>
                          Add <strong style={{ color: '#0a0a0a' }}>{formatPrice(5000 - totalPrice)}</strong> for Free Shipping
                        </span>
                      )}
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#888' }}>
                        {Math.min(100, Math.round((totalPrice / 5000) * 100))}%
                      </span>
                    </div>
                    <div style={{ width: '100%', height: 6, background: '#e5e5e0', borderRadius: 100, overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (totalPrice / 5000) * 100)}%` }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                          height: '100%',
                          background: shipping === 0 ? '#16a34a' : '#0a0a0a',
                          borderRadius: 100,
                        }}
                      />
                    </div>
                  </div>
                  {[['Subtotal', formatPrice(totalPrice)], ['Shipping', shipping === 0 ? 'FREE' : formatPrice(shipping)]].map(([l, v]) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                      <span style={{ color: '#9a9a9a', fontSize: '0.875rem' }}>{l}</span>
                      <span style={{ color: '#9a9a9a', fontSize: '0.875rem' }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderTop: '1px solid #f0f0ec', borderBottom: '1px solid #f0f0ec', marginBottom: '1rem' }}>
                    <span style={{ color: '#0a0a0a', fontWeight: 700 }}>Total</span>
                    <motion.span
                      key={totalPrice + shipping}
                      initial={{ scale: 1.1, opacity: 0.5 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      style={{ color: '#000000', fontWeight: 800, fontSize: '1.1rem' }}
                    >
                      {formatPrice(totalPrice + shipping)}
                    </motion.span>
                  </div>
                  <Link to="/checkout" onClick={closeCart} id="checkout-btn" className="btn-primary"
                    style={{ display: 'flex', justifyContent: 'center', borderRadius: 100, marginBottom: '0.625rem', padding: '0.875rem' }}>
                    CHECKOUT <ArrowRight size={15} />
                  </Link>
                  <button onClick={closeCart} style={{ width: '100%', background: 'none', border: 'none', color: '#9a9a9a', fontSize: '0.875rem', cursor: 'pointer', padding: '0.375rem', transition: 'color 0.35s cubic-bezier(0.16,1,0.3,1)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#0a0a0a')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#9a9a9a')}>
                    Continue Shopping
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
