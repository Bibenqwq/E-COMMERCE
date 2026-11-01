import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { products } from '../data/products';
import { useCartStore } from '../store/cartStore';
import type { ProductColor } from '../types';
import type { ShoeMotion } from '../components/launch/SneakerScene';
import FeatureRunner from '../components/launch/FeatureRunner';
import { useLaunchScroll } from '../hooks/useLaunchScroll';

const SneakerScene = lazy(() => import('../components/launch/SneakerScene'));
const product = products.find((item) => item.id === 'air-max-dn') ?? products[0];
const features = [
  {
    number: '01',
    name: 'Air cushioning',
    description: 'Every stride, softened. Responsive Air cushioning puts a little more spring in your step.',
    shape: 'air',
  },
  {
    number: '02',
    name: 'Breathable by design',
    description: 'An engineered mesh upper lets the air move while you do.',
    shape: 'mesh',
  },
  {
    number: '03',
    name: 'Light on your feet',
    description: 'A considered, lightweight build that never slows your next move.',
    shape: 'feather',
  },
  {
    number: '04',
    name: 'Grip that goes',
    description: 'A durable rubber outsole finds its footing, wherever the day takes you.',
    shape: 'grip',
  },
  {
    number: '05',
    name: 'Made for what’s next',
    description: 'Thoughtful material choices. A lighter step toward a better future.',
    shape: 'future',
  },
];

const colors = product.colors;
const sizes = product.sizes;

function makeMotionState(cameraZ = 4.65, offsetY = 0): { current: ShoeMotion } {
  return { current: { rotationY: 0.25, rotationX: -0.1, rotationZ: -0.12, cameraZ, offsetY } };
}

function ShoeCanvas({
  color,
  motion,
  label,
  className,
}: {
  color: string;
  motion: { current: ShoeMotion };
  label: string;
  className: string;
}) {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: '100px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={className} ref={containerRef}>
      {visible ? (
        <Suspense fallback={<div className="shoe-loader" role="status">Loading 3D shoe…</div>}>
          <SneakerScene color={color} motion={motion} label={label} className="shoe-canvas-inner" />
        </Suspense>
      ) : <div className="shoe-scene-placeholder" aria-hidden="true" />}
    </div>
  );
}

export default function HomePage() {
  const heroMotion = useMemo(() => makeMotionState(4.5, -0.35), []);
  const tourMotion = useMemo(() => makeMotionState(4.5), []);
  const productMotion = useMemo(() => makeMotionState(4.35), []);
  const tourRef = useRef<HTMLElement>(null);
  const featureStageRef = useRef<HTMLDivElement>(null);
  const featureTrackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const runnerProgress = useRef({ value: 0 });
  const calloutsRef = useRef<HTMLDivElement>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    colors.find((color) => color.name === 'Photon Dust') ?? colors[0],
  );
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [added, setAdded] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  useLaunchScroll({
    tour: tourRef,
    featureStage: featureStageRef,
    featureTrack: featureTrackRef,
    progress: progressRef,
    runnerProgress,
    callouts: calloutsRef,
    shoeMotion: tourMotion,
  });

  const handleAddToBag = () => {
    if (selectedSize === null) return;
    addItem(product, selectedColor, selectedSize, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  const handleSubscribe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubscribed(true);
  };

  const heroColor = colors.find((color) => color.name === 'Photon Dust') ?? colors[0];

  return (
    <>
      <link
        rel="preload"
        href="/models/free_sneaker_optimized.glb"
        as="fetch"
        crossOrigin="anonymous"
        fetchPriority="high"
      />
      <main className="launch-page">
      <section className="launch-hero" id="top" aria-labelledby="launch-title">
        <div className="launch-hero-copy">
          <p className="eyebrow">The new Air Max DN</p>
          <h1 id="launch-title">MOVE<br /><span>DIFFERENT.</span></h1>
          <p className="launch-hero-subtitle">A new feeling, from the ground up.</p>
        </div>
        <a className="button button-dark launch-hero-cta" href="#product">Shop now <span aria-hidden="true">↗</span></a>
        <div className="launch-hero-art">
          <div className="hero-orbit hero-orbit-one" />
          <div className="hero-orbit hero-orbit-two" />
          <ShoeCanvas color={heroColor.hex} motion={heroMotion} label="Air Max DN in Photon Dust, floating in a 3D product view" className="hero-shoe-canvas" />
          <span className="hero-side-note">AIR MAX DN / 2026</span>
        </div>
        <div className="launch-hero-bottom">
          <span>Designed for your next</span>
          <a href="#shoe-tour" aria-label="Scroll to explore the shoe">Scroll to explore <span aria-hidden="true">↓</span></a>
          <span>01 — 05</span>
        </div>
      </section>

      <section className="shoe-tour" id="shoe-tour" ref={tourRef} aria-labelledby="tour-heading">
        <div className="shoe-tour-heading">
          <p className="eyebrow">Visible innovation</p>
          <h2 id="tour-heading">MADE TO<br />MOVE YOU.</h2>
        </div>
        <div className="shoe-tour-canvas">
          <ShoeCanvas color={heroColor.hex} motion={tourMotion} label="360 degree Air Max DN shoe view" className="tour-shoe-canvas" />
        </div>
        <div className="shoe-callouts" ref={calloutsRef} aria-live="polite">
          <article className="shoe-callout" data-callout="0">
            <span className="callout-index">01 / CUSHIONING</span>
            <h3>Air, in motion.</h3>
            <p>Responsive cushioning, tuned for a smooth transition.</p>
          </article>
          <article className="shoe-callout" data-callout="1">
            <span className="callout-index">02 / UPPER</span>
            <h3>Room to breathe.</h3>
            <p>Lightweight mesh wraps the foot with breathable support.</p>
          </article>
          <article className="shoe-callout" data-callout="2">
            <span className="callout-index">03 / OUTSOLE</span>
            <h3>Find your footing.</h3>
            <p>Durable traction, made for the everyday unexpected.</p>
          </article>
        </div>
        <p className="tour-instruction">SCROLL TO ROTATE <span aria-hidden="true">↓</span></p>
      </section>

      <section className="feature-section" aria-label="Air Max DN features">
        <div className="feature-intro">
          <p className="eyebrow">The details</p>
          <h2>FIVE WAYS<br />TO FEEL IT.</h2>
          <p>Little things. A whole new feeling.</p>
        </div>
        <div className="feature-stage" ref={featureStageRef}>
          <div className="feature-track" ref={featureTrackRef}>
            {features.map((feature) => (
              <article className="feature-panel" key={feature.number}>
                <span className="feature-number">{feature.number}</span>
                <div className={`feature-object feature-object-${feature.shape}`} aria-hidden="true">
                  <span /><span /><span />
                  {feature.shape === 'air' && (
                    <div className="feature-air-flow">
                      <span /><span /><span /><span />
                      <i />
                    </div>
                  )}
                </div>
                <div className="feature-copy">
                  <p className="eyebrow">Air Max DN / {feature.number}</p>
                  <h3>{feature.name}</h3>
                  <p>{feature.description}</p>
                </div>
              </article>
            ))}
          </div>
          <FeatureRunner progress={runnerProgress} />
          <div className="feature-progress" aria-hidden="true">
            <span>01</span>
            <div className="feature-progress-track"><span ref={progressRef} /></div>
            <span>05</span>
          </div>
        </div>
      </section>

      <section className="product-section" id="product" aria-labelledby="product-heading">
        <div className="product-copy">
          <p className="eyebrow">Meet your new everyday</p>
          <h2 id="product-heading">AIR MAX DN</h2>
          <p className="product-price">₱8,295</p>
          <p className="product-description">
            A smooth ride. A fresh perspective. The Air Max DN brings responsive comfort and a clean, confident look to every day.
          </p>

          <fieldset className="product-color-field">
            <legend>Colorway <span>{selectedColor.name}</span></legend>
            <div className="color-swatches">
              {colors.map((color) => (
                <button
                  type="button"
                  className={`color-swatch${selectedColor.name === color.name ? ' is-selected' : ''}`}
                  key={color.name}
                  style={{ '--swatch-color': color.hex } as React.CSSProperties}
                  aria-label={`Select ${color.name}`}
                  aria-pressed={selectedColor.name === color.name}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="product-size-field">
            <legend>Select size <span>US</span></legend>
            <div className="size-grid">
              {sizes.map((size) => (
                <button
                  type="button"
                  className={`size-option${selectedSize === size ? ' is-selected' : ''}`}
                  key={size}
                  aria-pressed={selectedSize === size}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </fieldset>

          <button type="button" className="button button-dark add-to-bag" onClick={handleAddToBag} disabled={selectedSize === null}>
            <ShoppingBag size={17} aria-hidden="true" />
            {added ? 'Added to bag' : selectedSize === null ? 'Select a size' : 'Add to bag'}
          </button>
          <p className="product-footnote">Free delivery on orders over ₱5,000. Easy 30-day returns.</p>
        </div>

        <div className="product-visual">
          <div className="product-visual-label">
            <span>01 / 04</span>
            <span>{selectedColor.name}</span>
          </div>
          <ShoeCanvas color={selectedColor.hex} motion={productMotion} label={`Air Max DN in ${selectedColor.name}, 3D product view`} className="product-shoe-canvas" />
          <p className="product-visual-foot">AN ICON, REIMAGINED.</p>
        </div>
      </section>

      <footer className="launch-footer">
        <div className="footer-top">
          <div>
            <a className="footer-wordmark" href="#top" aria-label="Air Form home">AIR/FORM</a>
            <p>A little more movement. A little more life.</p>
          </div>
          <form
            className="newsletter-form"
            onSubmit={handleSubscribe}
          >
            <label htmlFor="launch-email">A good thing in your inbox.</label>
            <div className="newsletter-input-row">
              <input id="launch-email" type="email" placeholder="Email address" required />
              <button type="submit" aria-label="Subscribe to newsletter">{subscribed ? '✓' : '↗'}</button>
            </div>
            {subscribed && <span className="newsletter-success" role="status">You’re on the list.</span>}
          </form>
        </div>
        <div className="footer-bottom">
          <span>© 2026 AIR/FORM. All rights reserved.</span>
          <div><a href="#product">Help</a><a href="#product">Shipping</a><a href="#product">Privacy</a></div>
        </div>
      </footer>
      </main>
    </>
  );
}
