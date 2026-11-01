import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    number: '01',
    eyebrow: 'Air cushioning',
    title: ['SOFT LANDING.', 'HARD TAKEOFF.'],
    description: 'Responsive cushioning absorbs impact and returns energy with every step.',
  },
  {
    number: '02',
    eyebrow: 'Iconic by design',
    title: ['A CLASSIC', 'FROM EVERY ANGLE.'],
    description: 'A court-born silhouette, refined through details that never go out of rotation.',
  },
  {
    number: '03',
    eyebrow: 'Built for motion',
    title: ['YOUR MOVE.', 'YOUR MOMENT.'],
    description: 'Secure support and durable traction keep you ready for whatever comes next.',
  },
];

type ScrollModelState = {
  rotation: number;
  tilt: number;
  cameraZ: number;
};

function SneakerModel({ scrollState }: { scrollState: React.RefObject<ScrollModelState> }) {
  const { scene } = useGLTF('/models/free_sneaker.glb');
  const modelRef = useRef<THREE.Group>(null);
  const model = useMemo(() => {
    const clone = scene.clone(true);
    const bounds = new THREE.Box3().setFromObject(clone);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const largestDimension = Math.max(size.x, size.y, size.z);

    clone.position.sub(center);
    clone.scale.setScalar(largestDimension > 0 ? 3 / largestDimension : 1);
    return clone;
  }, [scene]);

  useFrame(({ camera }) => {
    if (!modelRef.current) return;

    modelRef.current.rotation.y = scrollState.current.rotation;
    modelRef.current.rotation.x = scrollState.current.tilt;
    camera.position.z = scrollState.current.cameraZ;
    camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={modelRef}>
      <primitive object={model} />
    </group>
  );
}

function ScrollShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const scrollState = useRef<ScrollModelState>({
    rotation: 0,
    tilt: -0.08,
    cameraZ: 4.6,
  });

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;
    if (!section || !stage || !track || !progress) return;

    const context = gsap.context(() => {
      ScrollTrigger.matchMedia({
        '(min-width: 768px) and (prefers-reduced-motion: no-preference)': () => {
          const horizontalDistance = () => track.scrollWidth - window.innerWidth;
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: stage,
              pin: true,
              pinType: 'transform',
              scrub: 1,
              start: 'top top',
              end: () => `+=${horizontalDistance()}`,
              invalidateOnRefresh: true,
            },
          });

          timeline.to(track, { x: () => -horizontalDistance(), ease: 'none' }, 0);
          timeline.to(progress, { scaleX: 1, ease: 'none' }, 0);
          timeline.to(
            scrollState.current,
            { rotation: Math.PI * 2, tilt: 0.12, cameraZ: 3.8, ease: 'none' },
            0,
          );
        },
        '(max-width: 767px) and (prefers-reduced-motion: no-preference)': () => {
          gsap.to(scrollState.current, {
            rotation: Math.PI * 0.65,
            tilt: 0.06,
            cameraZ: 4,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top 75%',
              end: 'bottom 55%',
              scrub: 1,
            },
          });
        },
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section className="scroll-showcase" ref={sectionRef} aria-label="Sneaker features">
      <header className="scroll-showcase-heading">
        <span className="scroll-showcase-kicker">Engineered to move</span>
        <h2>ONE ICON. EVERY ANGLE.</h2>
        <p>Scroll to explore the details that move you.</p>
      </header>

      <div className="scroll-showcase-stage" ref={stageRef}>
        <div className="scroll-showcase-model" aria-hidden="true">
          <Canvas camera={{ position: [0, 0, 4.6], fov: 36 }} dpr={[1, 1.5]}>
            <ambientLight intensity={1.5} />
            <directionalLight position={[4, 5, 5]} intensity={3} />
            <pointLight position={[-4, 1, -3]} intensity={2} color="#e11d48" />
            <Suspense fallback={null}>
              <SneakerModel scrollState={scrollState} />
            </Suspense>
          </Canvas>
        </div>

        <div className="scroll-showcase-track" ref={trackRef}>
          {features.map((feature) => (
            <article className="scroll-showcase-panel" key={feature.number}>
              <div className="scroll-showcase-copy">
                <span className="scroll-showcase-panel-number">{feature.number} / 03</span>
                <span className="scroll-showcase-panel-kicker">{feature.eyebrow}</span>
                <h3>
                  {feature.title.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </h3>
                <p>{feature.description}</p>
                {feature.number === '03' && (
                  <Link className="scroll-showcase-link" to="/shop">
                    Find your pair <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="scroll-showcase-progress" aria-hidden="true">
          <span>01</span>
          <div className="scroll-showcase-progress-track">
            <span ref={progressRef} />
          </div>
          <span>03</span>
        </div>
      </div>
    </section>
  );
}

export default function ScrollShowcase3D() {
  return <ScrollShowcase />;
}

useGLTF.preload('/models/free_sneaker.glb');
