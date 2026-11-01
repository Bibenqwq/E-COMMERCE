import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// ─── 3D Rotating Cargo Box (Free Shipping) ──────────────────────────────────
function CargoBox() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.8;
      meshRef.current.rotation.x += delta * 0.4;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={0.6}>
      <mesh ref={meshRef}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.8}
          roughness={0.2}
          wireframe={false}
        />
        {/* Wireframe overlay */}
        <mesh>
          <boxGeometry args={[1.52, 1.52, 1.52]} />
          <meshBasicMaterial color="#e11d48" wireframe />
        </mesh>
      </mesh>
    </Float>
  );
}

// ─── 3D Rotating Shield (Authentic Guarantee) ───────────────────────────────
function ShieldBadge() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.7;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.5} floatIntensity={0.7}>
      <group ref={groupRef}>
        {/* Diamond / Octahedron crest */}
        <mesh>
          <octahedronGeometry args={[1.2, 0]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh scale={[1.35, 1.35, 1.35]}>
          <octahedronGeometry args={[1.2, 0]} />
          <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.3} />
        </mesh>
      </group>
    </Float>
  );
}

// ─── 3D Supersonic Speed Ring / Torus (Fast Delivery) ───────────────────────
function SpeedEnergy() {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ring1.current) ring1.current.rotation.x += delta * 1.4;
    if (ring2.current) {
      ring2.current.rotation.y += delta * 1.6;
      ring2.current.rotation.z += delta * 0.8;
    }
  });

  return (
    <Float speed={3} rotationIntensity={0.8} floatIntensity={0.8}>
      <group>
        <mesh ref={ring1}>
          <torusGeometry args={[1.1, 0.15, 16, 64]} />
          <meshStandardMaterial color="#3b82f6" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh ref={ring2}>
          <torusGeometry args={[0.75, 0.1, 16, 64]} />
          <meshStandardMaterial color="#60a5fa" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </Float>
  );
}

const features = [
  {
    title: 'Free Worldwide Shipping',
    desc: 'On all official Jordan orders over ₱5,000',
    component: CargoBox,
    accent: '#e11d48',
  },
  {
    title: '100% Authentic Guarantee',
    desc: 'Verified by Nike Lab RFID serialization',
    component: ShieldBadge,
    accent: '#f59e0b',
  },
  {
    title: 'Express 48H Delivery',
    desc: 'Air freight dispatch directly to your doorstep',
    component: SpeedEnergy,
    accent: '#3b82f6',
  },
];

export default function FeatureStrip3D() {
  return (
    <section style={{ background: '#0a0a0c', padding: '3.5rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {features.map((item, i) => {
          const Comp = item.component;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.25)' }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                padding: '1.25rem 1.5rem',
                borderRadius: 18,
                background: 'rgba(18, 18, 22, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(16px)',
                transition: 'all 0.3s ease',
              }}
            >
              {/* Interactive 3D Canvas Box */}
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 16,
                  background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.5) 100%)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  flexShrink: 0,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <Canvas camera={{ position: [0, 0, 3.8], fov: 45 }} style={{ width: '100%', height: '100%' }}>
                  <ambientLight intensity={1.2} />
                  <pointLight position={[3, 3, 3]} intensity={2.5} color={item.accent} />
                  <pointLight position={[-3, -3, 2]} intensity={1.5} color="#ffffff" />
                  <Comp />
                </Canvas>
              </div>

              <div>
                <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.25rem', letterSpacing: '0.02em' }}>
                  {item.title}
                </h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: '0.75rem', margin: 0, lineHeight: 1.5 }}>
                  {item.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
