import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, useGLTF, useProgress } from '@react-three/drei';
import { gsap } from 'gsap';
import * as THREE from 'three';

export type ShoeMotion = {
  rotationY: number;
  rotationX: number;
  rotationZ: number;
  cameraZ: number;
  offsetY: number;
};

type SneakerSceneProps = {
  color: string;
  motion: { current: ShoeMotion };
  className?: string;
  label: string;
};

function SneakerModel({ color, motion }: Pick<SneakerSceneProps, 'color' | 'motion'>) {
  const { scene } = useGLTF('/models/free_sneaker_optimized.glb');
  const modelRef = useRef<THREE.Group>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const shoe = useMemo(() => {
    const clone = scene.clone(true);
    const bounds = new THREE.Box3().setFromObject(clone);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const largestDimension = Math.max(size.x, size.y, size.z);

    clone.position.sub(center);
    clone.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        const coloredMaterials = materials.map((material) => {
          const instance = material.clone();
          return instance;
        });
        object.material = Array.isArray(object.material) ? coloredMaterials : coloredMaterials[0];
      }
    });

    return { scene: clone, scale: largestDimension > 0 ? 3.35 / largestDimension : 1 };
  }, [scene]);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReduceMotion(preference.matches);
    updatePreference();
    preference.addEventListener('change', updatePreference);
    return () => preference.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    return () => {
      shoe.scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
    };
  }, [shoe]);

  useEffect(() => {
    const tweens: gsap.core.Tween[] = [];
    const targetColor = new THREE.Color(color);
    shoe.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => {
          if ('color' in material && material.color instanceof THREE.Color) {
            tweens.push(gsap.to(material.color, {
              r: targetColor.r,
              g: targetColor.g,
              b: targetColor.b,
              duration: 0.55,
              ease: 'power2.out',
            }));
          }
        });
      }
    });
    return () => tweens.forEach((tween) => tween.kill());
  }, [color, shoe]);

  useFrame(({ camera, clock }) => {
    if (modelRef.current) {
      const idle = reduceMotion ? 0 : Math.sin(clock.elapsedTime * 0.65) * 0.035;
      modelRef.current.rotation.y = motion.current.rotationY + idle;
      modelRef.current.rotation.x = motion.current.rotationX;
      modelRef.current.rotation.z = motion.current.rotationZ;
      modelRef.current.position.y = motion.current.offsetY + (reduceMotion ? 0 : Math.sin(clock.elapsedTime * 0.85) * 0.035);
    }

    camera.position.z = motion.current.cameraZ;
    camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={modelRef} scale={shoe.scale}>
      <primitive object={shoe.scene} />
    </group>
  );
}

export default function SneakerScene({
  color,
  motion,
  className,
  label,
}: SneakerSceneProps) {
  const { active, progress } = useProgress();

  return (
    <div className={className}>
      <Canvas
        aria-label={label}
        role="img"
        camera={{ position: [0, 0, motion.current.cameraZ], fov: 34 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={1.35} />
        <directionalLight castShadow position={[4, 6, 5]} intensity={2.5} />
        <directionalLight position={[-4, 2, -3]} intensity={1.4} color="#f4a261" />
        <pointLight position={[0, -2, 4]} intensity={0.5} color="#ffffff" />
        <Suspense fallback={null}>
          <SneakerModel color={color} motion={motion} />
          <ContactShadows position={[0, -1.35, 0]} opacity={0.2} scale={4.5} blur={2.5} far={2.5} />
        </Suspense>
      </Canvas>
      {active && (
        <div className="shoe-loader" role="status" aria-live="polite">
          <span className="shoe-loader-dot" />
          Loading 3D shoe{progress > 0 ? ` · ${Math.round(progress)}%` : '…'}
        </div>
      )}
    </div>
  );
}
