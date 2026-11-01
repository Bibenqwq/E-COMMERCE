import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Sparkles, Center } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Zap, Shield, Rotate3D, Layers, Play } from 'lucide-react';
import * as THREE from 'three';

// ─── 3D Dissected Air Cushioning Architecture ───────────────────────────────
function AirCapsuleSystem({
  isExploded,
  isCompressing,
}: {
  isExploded: boolean;
  isCompressing: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const capsuleRef = useRef<THREE.Group>(null);
  const plateRef = useRef<THREE.Mesh>(null);
  const soleRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }

    // Compression bounce animation when test mode is active
    if (capsuleRef.current) {
      if (isCompressing) {
        const bounce = Math.sin(state.clock.elapsedTime * 6) * 0.15;
        capsuleRef.current.position.y = (isExploded ? 0.9 : 0.2) + bounce;
        capsuleRef.current.scale.y = 1 - bounce * 0.8;
      } else {
        capsuleRef.current.position.y = THREE.MathUtils.lerp(
          capsuleRef.current.position.y,
          isExploded ? 0.9 : 0.2,
          delta * 4
        );
        capsuleRef.current.scale.y = THREE.MathUtils.lerp(
          capsuleRef.current.scale.y,
          1,
          delta * 4
        );
      }
    }

    if (plateRef.current) {
      plateRef.current.position.y = THREE.MathUtils.lerp(
        plateRef.current.position.y,
        isExploded ? -0.4 : -0.2,
        delta * 4
      );
    }

    if (soleRef.current) {
      soleRef.current.position.y = THREE.MathUtils.lerp(
        soleRef.current.position.y,
        isExploded ? -1.1 : -0.5,
        delta * 4
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* 1. UPPER INSOLE BED */}
      <mesh position={[0, isExploded ? 1.6 : 0.6, 0]}>
        <cylinderGeometry args={[1.4, 1.2, 0.12, 48]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* 2. TRANSLUCENT AIR-SOLE CAPSULE WITH INERT GAS */}
      <group ref={capsuleRef}>
        {/* Outer glass capsule */}
        <mesh>
          <capsuleGeometry args={[0.55, 1.4, 16, 32]} />
          <meshPhysicalMaterial
            color="#00f0ff"
            transmission={0.7}
            opacity={0.85}
            transparent
            roughness={0.1}
            metalness={0.1}
            ior={1.4}
            thickness={0.5}
          />
        </mesh>
        {/* Internal gas core */}
        <mesh scale={[0.85, 0.85, 0.85]}>
          <capsuleGeometry args={[0.55, 1.4, 16, 32]} />
          <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.35} />
        </mesh>
        {/* Pressurized micro-sparkles inside air unit */}
        <Sparkles count={30} scale={1.2} size={3} speed={0.8} color="#00f0ff" />
      </group>

      {/* 3. CARBON FIBER SHANK PLATE */}
      <mesh ref={plateRef}>
        <boxGeometry args={[1.6, 0.08, 1.2]} />
        <meshStandardMaterial color="#e11d48" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* 4. SOLID RUBBER PIVOT TRACTION OUTSOLE */}
      <mesh ref={soleRef}>
        <cylinderGeometry args={[1.5, 1.5, 0.18, 48]} />
        <meshStandardMaterial color="#c41e3a" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* 5. ROTATING ORBITAL TELEMETRY RINGS */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.4, 0]}>
        <ringGeometry args={[2.2, 2.22, 64]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export default function TechLab3D() {
  const [isExploded, setIsExploded] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  return (
    <section
      style={{
        position: 'relative',
        background: 'radial-gradient(ellipse 90% 70% at 50% 50%, #17171c 0%, #0c0c0e 60%, #050507 100%)',
        padding: '6rem 1.5rem',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr', gap: '3rem', alignItems: 'center' }} className="lg:grid-cols-2">
        {/* ── LEFT: Tech Description & Interactive Controls ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00f0ff', boxShadow: '0 0 10px #00f0ff' }} />
            <span style={{ color: '#00f0ff', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase' }}>
              THREE.JS 3D DISSECTED ARCHITECTURE
            </span>
          </div>

          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              color: '#ffffff',
              lineHeight: 0.95,
              margin: '0 0 1.25rem',
              letterSpacing: '0.02em',
            }}
          >
            NIKE AIR-SOLE<br />
            <span style={{ color: '#e11d48' }}>ENGINEERED MATRIX</span>
          </h2>

          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: 520, margin: '0 0 2rem' }}>
            Experience the internal anatomy of Air Jordan cushioning rendered in live 3D.
            Pressurized gas molecules encapsulated in ultra-tensile elastomer membranes provide
            maximum kinetic energy return with zero degradation over time.
          </p>

          {/* Interactive 3D Control Toggles */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2.5rem' }}>
            <button
              onClick={() => setIsExploded(!isExploded)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                borderRadius: 12,
                background: isExploded ? '#e11d48' : 'rgba(255,255,255,0.08)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.15)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
            >
              <Layers size={16} />
              {isExploded ? 'COLLAPSE LAYERS' : 'EXPLODE LAYERS'}
            </button>

            <button
              onClick={() => setIsCompressing(!isCompressing)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                borderRadius: 12,
                background: isCompressing ? '#00f0ff' : 'rgba(255,255,255,0.08)',
                color: isCompressing ? '#000000' : '#ffffff',
                border: '1px solid rgba(255,255,255,0.15)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
            >
              <Zap size={16} />
              {isCompressing ? 'STOP IMPACT TEST' : 'SIMULATE IMPACT'}
            </button>
          </div>

          {/* Technical Specs Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Pressure</div>
              <div style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 800 }}>25 PSI</div>
            </div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Energy Return</div>
              <div style={{ color: '#00f0ff', fontSize: '1.25rem', fontWeight: 800 }}>+84%</div>
            </div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Tensile Life</div>
              <div style={{ color: '#e11d48', fontSize: '1.25rem', fontWeight: 800 }}>5,000 KM</div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Interactive 3D Canvas ── */}
        <div
          style={{
            position: 'relative',
            height: '520px',
            borderRadius: 24,
            background: 'radial-gradient(circle at 50% 50%, #202026 0%, #101014 70%, #08080a 100%)',
            border: '1px solid rgba(255,255,255,0.12)',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          }}
        >
          {/* Drag hint */}
          <div
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              zIndex: 10,
              padding: '0.4rem 0.8rem',
              borderRadius: 20,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              fontSize: '0.68rem',
              color: 'rgba(255,255,255,0.7)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Rotate3D size={14} color="#00f0ff" />
            Drag to Rotate 3D Core
          </div>

          <Canvas camera={{ position: [0, 1.2, 4.5], fov: 42 }}>
            <ambientLight intensity={1.0} />
            <directionalLight position={[5, 8, 5]} intensity={2.0} />
            <pointLight position={[-4, 2, -2]} intensity={2.5} color="#00f0ff" />
            <pointLight position={[4, -2, 2]} intensity={2.0} color="#e11d48" />

            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
              <AirCapsuleSystem isExploded={isExploded} isCompressing={isCompressing} />
            </Float>

            <OrbitControls enablePan={false} enableZoom={true} minDistance={2.5} maxDistance={7} />
          </Canvas>
        </div>
      </div>
    </section>
  );
}
