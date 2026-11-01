import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown, LayoutGrid, Grid3X3, Grid2X2, Sparkles, Flame, Tag, RotateCcw } from 'lucide-react';
import ProductCard from './ProductCard';
import { products } from '../data/products';
import type { Product } from '../types';

type SortKey = 'popular' | 'newest' | 'price-asc' | 'price-desc';
type FilterCategory = 'All' | 'Lifestyle' | 'Basketball' | 'Running';
type FilterBadge = 'All' | 'new' | 'bestseller' | 'sale';

interface ProductGridProps {
  limit?: number;
  showFilters?: boolean;
  initialSearch?: string;
  initialBadge?: string;
  initialCategory?: FilterCategory;
}

const smoothEase = [0.16, 1, 0.3, 1] as const;

export default function ProductGrid({
  limit,
  showFilters = true,
  initialSearch = '',
  initialBadge = '',
  initialCategory = 'All',
}: ProductGridProps) {
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState<FilterCategory>(initialCategory);
  const [badgeFilter, setBadgeFilter] = useState<FilterBadge>((initialBadge as FilterBadge) || 'All');
  const [sortBy, setSortBy] = useState<SortKey>('popular');
  const [maxPrice, setMaxPrice] = useState(15000);
  const [filterOpen, setFilterOpen] = useState(false);
  const [columns, setColumns] = useState<4 | 3 | 2>(4);

  const categories: FilterCategory[] = ['All', 'Lifestyle', 'Basketball', 'Running'];
  const badges: { id: FilterBadge; label: string; icon?: React.ReactNode }[] = [
    { id: 'All', label: 'All Sneakers' },
    { id: 'new', label: 'New Drops', icon: <Sparkles size={12} color="#000" /> },
    { id: 'bestseller', label: 'Best Sellers', icon: <Flame size={12} color="#e11d48" /> },
    { id: 'sale', label: 'On Sale', icon: <Tag size={12} color="#ef4444" /> },
  ];

  const pricePresets = [
    { label: 'All Prices', val: 15000 },
    { label: 'Under ₱7,000', val: 7000 },
    { label: 'Under ₱10,000', val: 10000 },
  ];

  const filtered = useMemo(() => {
    let list: Product[] = [...products];
    if (badgeFilter !== 'All') {
      list = list.filter((p) => p.badge === badgeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q)
      );
    }
    if (category !== 'All') list = list.filter((p) => p.category === category);
    list = list.filter((p) => p.price <= maxPrice);

    switch (sortBy) {
      case 'popular':
        list.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'newest':
        list.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
        break;
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
    }
    return limit ? list.slice(0, limit) : list;
  }, [search, category, badgeFilter, sortBy, maxPrice, limit]);

  const activeFilterCount =
    (category !== 'All' ? 1 : 0) +
    (badgeFilter !== 'All' ? 1 : 0) +
    (maxPrice < 15000 ? 1 : 0) +
    (search ? 1 : 0);

  const resetAll = () => {
    setSearch('');
    setCategory('All');
    setBadgeFilter('All');
    setMaxPrice(15000);
    setSortBy('popular');
  };

  const inputStyle: React.CSSProperties = {
    background: '#fff',
    border: '1.5px solid #e8e8e4',
    borderRadius: 12,
    padding: '0.65rem 1rem',
    color: '#0a0a0a',
    fontSize: '0.85rem',
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
    transition: 'border-color 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s cubic-bezier(0.16,1,0.3,1)',
  };

  const gridColsClass =
    columns === 4
      ? 'repeat(auto-fill, minmax(250px, 1fr))'
      : columns === 3
      ? 'repeat(auto-fill, minmax(310px, 1fr))'
      : 'repeat(auto-fill, minmax(380px, 1fr))';

  return (
    <div>
      {showFilters && (
        <div style={{ marginBottom: '2.5rem' }}>
          {/* Main Controls Header */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              background: '#fcfcfb',
              padding: '1rem 1.25rem',
              borderRadius: 18,
              border: '1px solid #eeeee8',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              marginBottom: '1rem',
            }}
          >
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: 360 }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9a9a9a',
                }}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by model, style..."
                style={{
                  ...inputStyle,
                  width: '100%',
                  paddingLeft: '2.6rem',
                  paddingRight: search ? '2.5rem' : '1rem',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#0a0a0a';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.06)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e8e8e4';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <AnimatePresence>
                {search && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    onClick={() => setSearch('')}
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: '#f0f0ee',
                      border: 'none',
                      borderRadius: '50%',
                      width: 20,
                      height: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#6b6b6b',
                    }}
                  >
                    <X size={12} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Action Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
              {/* Sort Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9a9a9a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortKey)}
                  style={{
                    ...inputStyle,
                    width: 'auto',
                    minWidth: 155,
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Latest Drops</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>

              {/* Advanced Filter Drawer Button */}
              <motion.button
                onClick={() => setFilterOpen(!filterOpen)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '0.65rem 1.1rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  borderRadius: 12,
                  cursor: 'pointer',
                  border: `1.5px solid ${filterOpen || activeFilterCount > 0 ? '#0a0a0a' : '#e8e8e4'}`,
                  background: filterOpen || activeFilterCount > 0 ? '#0a0a0a' : '#fff',
                  color: filterOpen || activeFilterCount > 0 ? '#fff' : '#0a0a0a',
                  transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                }}
              >
                <SlidersHorizontal size={14} />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span
                    style={{
                      background: '#e11d48',
                      color: '#fff',
                      borderRadius: '50%',
                      width: 18,
                      height: 18,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                    }}
                  >
                    {activeFilterCount}
                  </span>
                )}
                <motion.span animate={{ rotate: filterOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown size={14} />
                </motion.span>
              </motion.button>

              {/* Layout Switcher (Desktop) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#f0f0ee',
                  padding: 3,
                  borderRadius: 10,
                  gap: 2,
                }}
                className="hidden md:flex"
              >
                <button
                  onClick={() => setColumns(4)}
                  title="Compact Grid"
                  style={{
                    background: columns === 4 ? '#fff' : 'transparent',
                    border: 'none',
                    borderRadius: 7,
                    padding: '6px',
                    cursor: 'pointer',
                    color: columns === 4 ? '#0a0a0a' : '#888',
                    display: 'flex',
                    boxShadow: columns === 4 ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  onClick={() => setColumns(3)}
                  title="Standard Grid"
                  style={{
                    background: columns === 3 ? '#fff' : 'transparent',
                    border: 'none',
                    borderRadius: 7,
                    padding: '6px',
                    cursor: 'pointer',
                    color: columns === 3 ? '#0a0a0a' : '#888',
                    display: 'flex',
                    boxShadow: columns === 3 ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  <Grid3X3 size={15} />
                </button>
                <button
                  onClick={() => setColumns(2)}
                  title="Spacious Grid"
                  style={{
                    background: columns === 2 ? '#fff' : 'transparent',
                    border: 'none',
                    borderRadius: 7,
                    padding: '6px',
                    cursor: 'pointer',
                    color: columns === 2 ? '#0a0a0a' : '#888',
                    display: 'flex',
                    boxShadow: columns === 2 ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  <Grid2X2 size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Category & Badge Pills */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
              marginBottom: '1rem',
            }}
          >
            {/* Category Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              {categories.map((cat) => {
                const isActive = category === cat;
                return (
                  <motion.button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    style={{
                      padding: '0.45rem 1.1rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      borderRadius: 100,
                      border: `1.5px solid ${isActive ? '#0a0a0a' : '#e5e5e0'}`,
                      background: isActive ? '#0a0a0a' : '#fff',
                      color: isActive ? '#fff' : '#555',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    {cat}
                  </motion.button>
                );
              })}
            </div>

            {/* Badges / Drop Type */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              {badges.map((b) => {
                const isActive = badgeFilter === b.id;
                return (
                  <motion.button
                    key={b.id}
                    onClick={() => setBadgeFilter(b.id)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '0.42rem 0.9rem',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      borderRadius: 100,
                      border: `1px solid ${isActive ? '#0a0a0a' : '#ebebe6'}`,
                      background: isActive ? '#1c1c1e' : '#f8f8f6',
                      color: isActive ? '#fff' : '#666',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    {b.icon}
                    <span>{b.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Expandable Advanced Filter Drawer */}
          <AnimatePresence>
            {filterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: smoothEase }}
                style={{ overflow: 'hidden' }}
              >
                <div
                  style={{
                    padding: '1.5rem',
                    background: '#f8f8f6',
                    border: '1.5px solid #eeeeea',
                    borderRadius: 16,
                    marginBottom: '1rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1.75rem',
                  }}
                >
                  {/* Price Slider */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#0a0a0a' }}>
                        Maximum Price
                      </span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#e11d48' }}>
                        ₱{maxPrice.toLocaleString()}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={4000}
                      max={15000}
                      step={500}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      style={{ width: '100%', marginBottom: 10 }}
                    />
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {pricePresets.map((p) => (
                        <button
                          key={p.label}
                          onClick={() => setMaxPrice(p.val)}
                          style={{
                            padding: '3px 9px',
                            borderRadius: 6,
                            fontSize: '0.68rem',
                            fontWeight: 600,
                            border: `1px solid ${maxPrice === p.val ? '#0a0a0a' : '#ddd'}`,
                            background: maxPrice === p.val ? '#0a0a0a' : '#fff',
                            color: maxPrice === p.val ? '#fff' : '#666',
                            cursor: 'pointer',
                          }}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Summary & Reset */}
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <p style={{ color: '#666', fontSize: '0.8rem', marginBottom: 12 }}>
                      Showing <strong>{filtered.length}</strong> matching sneakers based on your criteria.
                    </p>
                    {activeFilterCount > 0 && (
                      <motion.button
                        onClick={resetAll}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          alignSelf: 'flex-start',
                          padding: '0.5rem 1rem',
                          background: '#fff',
                          border: '1.5px solid #e0e0da',
                          borderRadius: 8,
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#0a0a0a',
                          cursor: 'pointer',
                        }}
                      >
                        <RotateCcw size={12} /> Clear All Filters
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Tags Strip (If Any Filter Active) */}
          {activeFilterCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                flexWrap: 'wrap',
                paddingTop: '0.25rem',
              }}
            >
              <span style={{ fontSize: '0.72rem', color: '#9a9a9a', fontWeight: 600 }}>Active Filters:</span>
              {category !== 'All' && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    background: '#f2f2ef',
                    border: '1px solid #e2e2dc',
                    padding: '2px 8px',
                    borderRadius: 100,
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: '#0a0a0a',
                  }}
                >
                  {category}
                  <button
                    onClick={() => setCategory('All')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0, color: '#888' }}
                  >
                    <X size={11} />
                  </button>
                </span>
              )}
              {badgeFilter !== 'All' && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    background: '#f2f2ef',
                    border: '1px solid #e2e2dc',
                    padding: '2px 8px',
                    borderRadius: 100,
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: '#0a0a0a',
                  }}
                >
                  {badgeFilter === 'new' ? 'New Drops' : badgeFilter === 'bestseller' ? 'Best Sellers' : 'On Sale'}
                  <button
                    onClick={() => setBadgeFilter('All')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0, color: '#888' }}
                  >
                    <X size={11} />
                  </button>
                </span>
              )}
              {maxPrice < 15000 && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    background: '#f2f2ef',
                    border: '1px solid #e2e2dc',
                    padding: '2px 8px',
                    borderRadius: 100,
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: '#0a0a0a',
                  }}
                >
                  Under ₱{maxPrice.toLocaleString()}
                  <button
                    onClick={() => setMaxPrice(15000)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0, color: '#888' }}
                  >
                    <X size={11} />
                  </button>
                </span>
              )}
              {search && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    background: '#f2f2ef',
                    border: '1px solid #e2e2dc',
                    padding: '2px 8px',
                    borderRadius: 100,
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: '#0a0a0a',
                  }}
                >
                  "{search}"
                  <button
                    onClick={() => setSearch('')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0, color: '#888' }}
                  >
                    <X size={11} />
                  </button>
                </span>
              )}
              <button
                onClick={resetAll}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#e11d48',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginLeft: 4,
                  textDecoration: 'underline',
                }}
              >
                Reset All
              </button>
            </motion.div>
          )}
        </div>
      )}

      {/* Grid Results */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: smoothEase }}
            style={{
              textAlign: 'center',
              padding: '5rem 1.5rem',
              background: '#fafaf8',
              borderRadius: 24,
              border: '1px dashed #dcdcd6',
            }}
          >
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ fontSize: '3.5rem', marginBottom: '1rem' }}
            >
              👟
            </motion.div>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: '#0a0a0a', marginBottom: 6 }}>
              NO MATCHING SNEAKERS FOUND
            </h3>
            <p style={{ color: '#888', fontSize: '0.9rem', maxWidth: 420, margin: '0 auto 1.5rem' }}>
              We couldn't find any sneakers matching your current filter selections. Try adjusting your search term or price ceiling.
            </p>
            <motion.button
              onClick={resetAll}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
              style={{ fontSize: '0.75rem', padding: '0.75rem 1.75rem' }}
            >
              RESET ALL FILTERS
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key={`grid-${category}-${badgeFilter}-${sortBy}-${maxPrice}-${search}-${columns}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: smoothEase }}
            style={{
              display: 'grid',
              gridTemplateColumns: gridColsClass,
              gap: '1.5rem',
            }}
          >
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
