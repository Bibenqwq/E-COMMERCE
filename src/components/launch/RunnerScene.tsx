import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

type RunnerSceneProps = {
  progress: { current: { value: number } };
};

function SteppingShoes({ progress }: RunnerSceneProps) {
  const pairRef = useRef<THREE.Group>(null);
  const shoeRefs = [useRef<THREE.Group>(null), useRef<THREE.Group>(null)];
  const { scene } = useGLTF('/models/free_sneaker.glb');
  const viewport = useThree((state) => state.viewport);
  const shoes = useMemo(() => {
    const bounds = new THREE.Box3().setFromObject(scene);
    const center = bounds.getCenter(new THREE.Vector3());
    const largestDimension = Math.max(...bounds.getSize(new THREE.Vector3()).toArray());
    const scale = largestDimension > 0 ? 2 / largestDimension : 1;

    return [scene.clone(true), scene.clone(true)].map((shoe) => {
      shoe.position.sub(center);
      return { shoe, scale };
    });
  }, [scene]);

  useFrame(({ clock }) => {
    if (!pairRef.current) return;

    const time = clock.elapsedTime * 5;
    const travel = viewport.width + 3;
    pairRef.current.position.x = -travel / 2 + progress.current.value * travel;

    shoeRefs.forEach((shoeRef, index) => {
      const shoe = shoeRef.current;
      if (!shoe) return;

      const step = Math.sin(time + index * Math.PI);
      shoe.position.y = -0.22 + Math.max(0, step) * 0.55;
      shoe.position.x = index === 0 ? -0.48 : 0.48;
      shoe.position.z = index === 0 ? 0.12 : -0.12;
      shoe.rotation.x = index === 0 ? 0.12 : -0.12;
      shoe.rotation.y = 0.25;
      shoe.rotation.z = step * 0.2;
    });
  });

  return (
    <group ref={pairRef}>
      {shoes.map(({ shoe, scale }, index) => (
        <group key={index} ref={shoeRefs[index]} scale={scale}>
          <primitive object={shoe} />
        </group>
      ))}
    </group>
  );
}

export default function RunnerScene({ progress }: RunnerSceneProps) {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 10], zoom: 100, near: 0.1, far: 100 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
    >
      <ambientLight intensity={1.35} />
      <directionalLight position={[3, 5, 6]} intensity={2.2} />
      <directionalLight position={[-3, 2, -3]} intensity={1.1} color="#f4a261" />
      <SteppingShoes progress={progress} />
    </Canvas>
  );
}

useGLTF.preload('/models/free_sneaker.glb');
