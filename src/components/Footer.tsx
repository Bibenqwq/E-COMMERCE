import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, X, Send, ArrowUpRight } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const smoothEase = [0.16, 1, 0.3, 1] as const;

// ─── 3D Rotating Constellation Lattice in Footer ────────────────────────────
function ConstellationField() {
  const meshRef = useRef<THREE.Points>(null);
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
      meshRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <group>
      <Sparkles count={60} scale={12} size={2.2} speed={0.2} color="#ffffff" opacity={0.25} />
    </group>
  );
}

const footerLinks = {
  Shop: [
    { label: 'All Products', href: '/shop' },
    { label: 'New Arrivals', href: '/shop?badge=new' },
    { label: 'Best Sellers', href: '/shop?badge=bestseller' },
    { label: 'Collections', href: '/shop' },
  ],
  Support: [
    { label: 'Contact Us', href: '#' },
    { label: 'Size Guide', href: '#' },
    { label: 'Shipping & Returns', href: '#' },
    { label: 'FAQ', href: '#' },
  ],
  Company: [
    { label: 'About Us', href: '/#about' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Careers', href: '#' },
  ],
};

const socials = [
  { icon: X, href: '#', label: 'X' },
  { icon: Send, href: '#', label: 'Telegram' },
  { icon: Globe, href: '#', label: 'Web' },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: '#070709',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── THREE.JS 3D CONSTELLATION BACKGROUND ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.7 }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ConstellationField />
        </Canvas>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '4.5rem 1.5rem 2rem', position: 'relative', zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: smoothEase }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3.5rem',
          }}
        >
          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'inline-block', marginBottom: '1rem' }}>
              <motion.svg
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                viewBox="0 0 80 30"
                style={{ width: 56, height: 20, fill: '#ffffff', display: 'block' }}
              >
                <path d="M9.333 0L0 22.5l29.867-8.4C36.133 12 40.933 8.1 38.4 4.5c-2.667-3.9-10.267-2.1-15.867 1.5L9.333 0zM80 0L20 22.5l9.867-2.7L80 0z" />
              </motion.svg>
            </Link>
            <p
              style={{
                color: 'rgba(255,255,255,0.45)',
                fontSize: '0.825rem',
                lineHeight: 1.65,
                maxWidth: 220,
                marginBottom: '1.25rem',
              }}
            >
              Just Do It. Powered by real-time Three.js 3D web technology.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {socials.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  style={{
                    width: 36,
                    height: 36,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          {Object.entries(footerLinks).map(([col, links]) => (
            <div key={col}>
              <h4
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  marginBottom: '1.25rem',
                }}
              >
                {col}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.href}
                      style={{
                        color: 'rgba(255,255,255,0.5)',
                        textDecoration: 'none',
                        fontSize: '0.85rem',
                        transition: 'all 0.25s ease',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 2,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#ffffff';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                        e.currentTarget.style.transform = 'translateX(0px)';
                      }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            color: 'rgba(255,255,255,0.35)',
            fontSize: '0.75rem',
          }}
        >
          <span>© {new Date().getFullYear()} Nike 3D Experience. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#e11d48' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#e11d48', boxShadow: '0 0 6px #e11d48' }} />
              Three.js Active
            </span>
            <span>WebGL 2.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
