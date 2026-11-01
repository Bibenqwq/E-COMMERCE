import { lazy, Suspense, useEffect, useRef, useState } from 'react';

const RunnerScene = lazy(() => import('./RunnerScene'));

type FeatureRunnerProps = {
  progress: { current: { value: number } };
};

export default function FeatureRunner({ progress }: FeatureRunnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
    const updateEnabled = () => setEnabled(media.matches);

    updateEnabled();
    media.addEventListener('change', updateEnabled);
    return () => media.removeEventListener('change', updateEnabled);
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!enabled || !element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setNearViewport(true);
        observer.disconnect();
      }
    }, { rootMargin: '250px' });

    observer.observe(element);
    return () => observer.disconnect();
  }, [enabled]);

  return (
    <div className="feature-runner" ref={containerRef} aria-hidden="true">
      {enabled && nearViewport && (
        <Suspense fallback={null}>
          <RunnerScene progress={progress} />
        </Suspense>
      )}
    </div>
  );
}
