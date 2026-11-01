import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

const links = [
  { label: 'Shop', href: '#product' },
  { label: 'Men', href: '/shop?category=men' },
  { label: 'Women', href: '/shop?category=women' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { toggleCart, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 24);
    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  return (
    <header className={`launch-nav${scrolled ? ' is-scrolled' : ''}`}>
      <a className="launch-wordmark" href="/" aria-label="Air Form home">AIR/FORM</a>
      <nav className="launch-nav-links" aria-label="Main navigation">
        {links.map((link) => (
          <a key={link.label} href={link.href}>{link.label}</a>
        ))}
        <button type="button" className="launch-cart" onClick={toggleCart}>
          <ShoppingBag size={15} aria-hidden="true" />
          <span>Cart</span>
          <span className="launch-cart-count" aria-label={`${totalItems} items in cart`}>{totalItems}</span>
        </button>
      </nav>
    </header>
  );
}
