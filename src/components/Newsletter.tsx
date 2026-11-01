import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const smoothEase = [0.16, 1, 0.3, 1] as const;

// ─── 3D Undulating Particle Wave in Three.js ────────────────────────────────
function ParticleWave() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 40;
  const numParticles = count * count;

  const positions = useMemo(() => {
    const pos = new Float32Array(numParticles * 3);
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        const index = (i * count + j) * 3;
        pos[index] = (i - count / 2) * 0.45;
        pos[index + 1] = 0;
        pos[index + 2] = (j - count / 2) * 0.45;
      }
    }
    return pos;
  }, [count, numParticles]);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      const t = clock.getElapsedTime() * 1.5;
      const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
          const index = (i * count + j) * 3;
          const u = i / count;
          const v = j / count;
          pos[index + 1] = Math.sin(u * 5 + t) * Math.cos(v * 5 + t) * 0.6;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={[0, -1, 0]} rotation={[-0.3, 0.4, 0]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={numParticles}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.065}
          color="#e11d48"
          transparent
          opacity={0.65}
          sizeAttenuation
        />
      </points>
      <Sparkles count={50} scale={10} size={2.5} speed={0.4} color="#ffffff" opacity={0.3} />
    </group>
  );
}

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    await new Promise((r) => setTimeout(r, 1200));
    setStatus('success');
  };

  return (
    <section
      style={{
        background: '#09090b',
        padding: '6rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── THREE.JS 3D BACKGROUND WAVE CANVAS ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.85,
        }}
      >
        <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <ParticleWave />
        </Canvas>
      </div>

      <div style={{ maxWidth: 540, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: smoothEase }}
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                background: 'rgba(225,29,72,0.12)',
                border: '1px solid rgba(225,29,72,0.3)',
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(225,29,72,0.2)',
              }}
            >
              <Mail size={22} color="#e11d48" />
            </div>
          </motion.div>

          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              color: '#fff',
              lineHeight: 1,
              marginBottom: '1rem',
              letterSpacing: '0.02em',
            }}
          >
            STAY IN THE LOOP
          </h2>
          <p
            style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.95rem',
              lineHeight: 1.7,
              marginBottom: '2rem',
            }}
          >
            Be first to know about private 3D sneaker drops, exclusive lab access, and Nike heritage releases.
          </p>

          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ scale: 0.85, opacity: 0, filter: 'blur(4px)' }}
                animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.5, ease: smoothEase }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  padding: '1rem 1.5rem',
                  background: 'rgba(34,197,94,0.12)',
                  border: '1px solid rgba(34,197,94,0.3)',
                  borderRadius: 12,
                  color: '#22c55e',
                }}
              >
                <CheckCircle size={18} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                  You're on the VIP list. Welcome to Nike Lab!
                </span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', position: 'relative' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === 'error') setStatus('idle');
                    }}
                    placeholder="Enter your email"
                    aria-label="Email address"
                    style={{
                      flex: 1,
                      padding: '0.875rem 1.25rem',
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.06)',
                      border: status === 'error' ? '1px solid #e11d48' : '1px solid rgba(255,255,255,0.15)',
                      color: '#fff',
                      fontSize: '0.9rem',
                      outline: 'none',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.25s ease',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    style={{
                      padding: '0.875rem 1.5rem',
                      borderRadius: 12,
                      background: '#ffffff',
                      color: '#000000',
                      border: 'none',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.25s ease',
                      flexShrink: 0,
                    }}
                  >
                    {status === 'loading' ? 'Joining...' : 'Subscribe'}
                    <ArrowRight size={16} />
                  </button>
                </div>
                {status === 'error' && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ color: '#e11d48', fontSize: '0.75rem', textAlign: 'left', margin: 0 }}
                  >
                    Please enter a valid email address.
                  </motion.p>
                )}
              </form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
