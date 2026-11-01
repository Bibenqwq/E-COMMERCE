import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  CreditCard,
  Smartphone,
  Banknote,
  ChevronRight,
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
  Tag,
  Truck,
  Printer,
  Copy,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { formatPrice } from '../data/products';
import Footer from '../components/Footer';

const smoothEase = [0.16, 1, 0.3, 1] as const;

type Step = 'info' | 'shipping' | 'payment' | 'confirm';

const STEPS: { key: Step; label: string }[] = [
  { key: 'info', label: 'Information' },
  { key: 'shipping', label: 'Shipping' },
  { key: 'payment', label: 'Payment' },
  { key: 'confirm', label: 'Confirmation' },
];

const SHIPPING_OPTIONS = [
  {
    id: 'standard',
    label: 'Standard Ground Delivery',
    desc: '3–5 business days via J&T Express',
    price: 299,
    eta: '3-5 Business Days',
  },
  {
    id: 'express',
    label: 'Nike Priority Express',
    desc: '1–2 business days via LBC Express',
    price: 499,
    eta: '1-2 Business Days',
  },
  {
    id: 'free',
    label: 'Nike Member Free Shipping',
    desc: '5–7 business days nationwide',
    price: 0,
    eta: '5-7 Business Days',
  },
];

const PAYMENT_METHODS = [
  {
    id: 'gcash',
    icon: Smartphone,
    label: 'GCash',
    desc: 'Instant mobile payment via GCash e-wallet',
    badge: 'Popular in PH',
    color: '#007dfc',
  },
  {
    id: 'maya',
    icon: Smartphone,
    label: 'Maya',
    desc: 'Pay using your Maya account or wallet',
    badge: 'Instant',
    color: '#00b86b',
  },
  {
    id: 'card',
    icon: CreditCard,
    label: 'Credit / Debit Card',
    desc: 'Visa, Mastercard, American Express',
    badge: 'Secure 256-Bit',
    color: '#0a0a0a',
  },
  {
    id: 'cod',
    icon: Banknote,
    label: 'Cash on Delivery (COD)',
    desc: 'Pay cash upon parcel arrival at your doorstep',
    badge: 'No Prepayment',
    color: '#ca8a04',
  },
];

const stepVariants = {
  enter: { opacity: 0, x: 30, filter: 'blur(3px)' },
  center: { opacity: 1, x: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, x: -30, filter: 'blur(3px)' },
};

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('info');
  const [payment, setPayment] = useState('gcash');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [orderNumber] = useState(() => `NK-${Math.floor(100000 + Math.random() * 900000)}`);
  const [orderDate] = useState(() => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));

  // Form Fields
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: 'Metro Manila',
    zip: '',
    // Card simulation
    cardNumber: '4532 •••• •••• 8821',
    cardName: '',
    cardExpiry: '12/28',
    cardCvc: '•••',
    gcashPhone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Promo Code State
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; percentOff?: number; fixedOff?: number; freeShip?: boolean } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [copiedOrder, setCopiedOrder] = useState(false);

  const subtotal = getTotalPrice();
  const rawShipping = SHIPPING_OPTIONS.find((s) => s.id === shippingMethod)?.price ?? 299;
  const isFreeShipQualified = subtotal >= 5000 || appliedPromo?.freeShip;
  const shipping = isFreeShipQualified ? 0 : rawShipping;

  // Discount calculation
  let discountAmount = 0;
  if (appliedPromo?.percentOff) {
    discountAmount = Math.round((subtotal * appliedPromo.percentOff) / 100);
  } else if (appliedPromo?.fixedOff) {
    discountAmount = appliedPromo.fixedOff;
  }

  const total = Math.max(0, subtotal - discountAmount + shipping);
  const currentIdx = STEPS.findIndex((s) => s.key === step);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: '' }));
  };

  const handleApplyPromo = () => {
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'JUSTDOIT' || code === 'NIKE20') {
      setAppliedPromo({ code, percentOff: 20 });
      setPromoCode('');
    } else if (code === 'NIKE10') {
      setAppliedPromo({ code, percentOff: 10 });
      setPromoCode('');
    } else if (code === 'FREESHIP') {
      setAppliedPromo({ code, freeShip: true });
      setPromoCode('');
    } else if (code === 'PINOY500') {
      setAppliedPromo({ code, fixedOff: 500 });
      setPromoCode('');
    } else {
      setPromoError('Invalid promo code. Try "NIKE20" or "FREESHIP".');
    }
  };

  const handleQuickFill = () => {
    setForm({
      firstName: 'Juan',
      lastName: 'Dela Cruz',
      email: 'juan.delacruz@gmail.com',
      phone: '09171234567',
      address: '28th Street, Bonifacio Global City',
      city: 'Taguig City',
      province: 'Metro Manila',
      zip: '1634',
      cardNumber: '4532 8920 1192 8821',
      cardName: 'Juan Dela Cruz',
      cardExpiry: '08/29',
      cardCvc: '382',
      gcashPhone: '09171234567',
    });
    setErrors({});
  };

  const validate = (rules: Record<string, (v: string) => boolean | string>) => {
    const errs: Record<string, string> = {};
    for (const [k, rule] of Object.entries(rules)) {
      const r = rule(form[k as keyof typeof form] || '');
      if (r !== true) errs[k] = r as string;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (
      step === 'info' &&
      !validate({
        firstName: (v) => (v.trim() ? true : 'First name is required'),
        lastName: (v) => (v.trim() ? true : 'Last name is required'),
        email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? true : 'Valid email is required'),
        phone: (v) => (/^[0-9+ ]{10,14}$/.test(v) ? true : 'Valid phone number is required'),
      })
    )
      return;

    if (
      step === 'shipping' &&
      !validate({
        address: (v) => (v.trim() ? true : 'Street address is required'),
        city: (v) => (v.trim() ? true : 'City is required'),
        zip: (v) => (/^\d{4}$/.test(v) ? true : '4-digit postal code required'),
      })
    )
      return;

    if (currentIdx < STEPS.length - 1) {
      setStep(STEPS[currentIdx + 1].key);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const Field = ({
    name,
    label,
    placeholder,
    type = 'text',
  }: {
    name: string;
    label: string;
    placeholder: string;
    type?: string;
  }) => (
    <div>
      <label
        style={{
          display: 'block',
          color: errors[name] ? '#ef4444' : '#666',
          fontSize: '0.72rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 6,
        }}
      >
        {errors[name] || label}
      </label>
      <input
        type={type}
        name={name}
        value={form[name as keyof typeof form]}
        onChange={handleInput}
        placeholder={placeholder}
        style={{
          width: '100%',
          background: '#fff',
          border: `1.5px solid ${errors[name] ? '#ef4444' : '#e5e5e0'}`,
          borderRadius: 12,
          padding: '0.75rem 1rem',
          color: '#0a0a0a',
          fontSize: '0.875rem',
          outline: 'none',
          fontFamily: 'Inter, sans-serif',
          transition: 'all 0.25s ease',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#0a0a0a';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.06)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = errors[name] ? '#ef4444' : '#e5e5e0';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
    </div>
  );

  // If cart is empty and not on confirmation page
  if (items.length === 0 && step !== 'confirm') {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#fff',
          paddingTop: 66,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: smoothEase }}
          style={{ textAlign: 'center', padding: '2rem' }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              background: '#f5f5f3',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}
          >
            <ShoppingBag size={36} color="#999" />
          </div>
          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '3rem',
              color: '#0a0a0a',
              marginBottom: 8,
            }}
          >
            YOUR BAG IS EMPTY
          </h2>
          <p style={{ color: '#888', marginBottom: '1.75rem', maxWidth: 360 }}>
            Before checking out, please select sneakers from our catalog.
          </p>
          <Link to="/shop" className="btn-primary">
            GO TO SNEAKER SHOP
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f8f8f6', paddingTop: 66 }}>
      {/* ── TOP HEADER & QUICK STATS ── */}
      <div
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #eeeee8',
          padding: '1.25rem 1.5rem',
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link
              to="/shop"
              style={{
                color: '#666',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                textDecoration: 'none',
                fontSize: '0.825rem',
                fontWeight: 600,
              }}
            >
              <ArrowLeft size={15} /> Return to Shop
            </Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#16a34a', fontSize: '0.8rem', fontWeight: 700 }}>
            <Lock size={14} /> 256-Bit SSL Encrypted Checkout
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(2.75rem, 6vw, 4.5rem)',
              color: '#0a0a0a',
              margin: '0 0 0.25rem',
              lineHeight: 1,
            }}
          >
            NIKE OFFICIAL CHECKOUT
          </h1>
          <p style={{ color: '#888', fontSize: '0.875rem' }}>
            Complete your order with official Nike packaging and guaranteed authenticity.
          </p>
        </div>

        {/* ── STEPPER PROGRESS BAR ── */}
        {step !== 'confirm' && (
          <div style={{ maxWidth: 640, margin: '0 auto 3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
              {/* Connected track */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '8%',
                  right: '8%',
                  height: 2,
                  background: '#e0e0da',
                  transform: 'translateY(-50%)',
                  zIndex: 1,
                }}
              />
              <motion.div
                animate={{
                  width: `${(currentIdx / (STEPS.length - 2)) * 84}%`,
                }}
                transition={{ duration: 0.4, ease: smoothEase }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '8%',
                  height: 3,
                  background: '#0a0a0a',
                  transform: 'translateY(-50%)',
                  zIndex: 2,
                }}
              />

              {STEPS.slice(0, 3).map((s, i) => {
                const isPassed = i < currentIdx;
                const isCurrent = i === currentIdx;
                return (
                  <div
                    key={s.key}
                    style={{
                      position: 'relative',
                      zIndex: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <motion.div
                      animate={{
                        scale: isCurrent ? 1.15 : 1,
                        background: isPassed ? '#0a0a0a' : isCurrent ? '#0a0a0a' : '#ffffff',
                        borderColor: isPassed || isCurrent ? '#0a0a0a' : '#d8d8d0',
                        color: isPassed || isCurrent ? '#ffffff' : '#888',
                      }}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        border: '2px solid',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        boxShadow: isCurrent ? '0 4px 14px rgba(0,0,0,0.2)' : 'none',
                      }}
                    >
                      {isPassed ? '✓' : i + 1}
                    </motion.div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: isCurrent ? 800 : 600,
                        color: isCurrent ? '#0a0a0a' : '#888',
                      }}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── MAIN CONTENT GRID ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '2rem',
            alignItems: 'start',
          }}
          className={step === 'confirm' ? '' : 'lg:grid-cols-checkout'}
        >
          {/* Left: Step Card */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 24,
              padding: '2.5rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              border: '1px solid #eeeee8',
            }}
          >
            <AnimatePresence mode="wait">
              {/* ── 1. INFORMATION STEP ── */}
              {step === 'info' && (
                <motion.div
                  key="info"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: smoothEase }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <h2
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: '2rem',
                        color: '#0a0a0a',
                        margin: 0,
                      }}
                    >
                      CONTACT & DELIVERY INFORMATION
                    </h2>
                    <button
                      onClick={handleQuickFill}
                      style={{
                        background: '#f2f2ef',
                        border: '1px solid #e0e0da',
                        borderRadius: 8,
                        padding: '6px 12px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        color: '#0a0a0a',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Sparkles size={12} color="#e11d48" /> Autofill Demo Data
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    <Field name="firstName" label="First Name" placeholder="Juan" />
                    <Field name="lastName" label="Last Name" placeholder="Dela Cruz" />
                    <div style={{ gridColumn: '1 / -1' }}>
                      <Field name="email" label="Email Address (For Order Tracking)" placeholder="juan.delacruz@gmail.com" type="email" />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <Field name="phone" label="Philippine Mobile Number" placeholder="0917XXXXXXX" type="tel" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── 2. SHIPPING STEP ── */}
              {step === 'shipping' && (
                <motion.div
                  key="shipping"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: smoothEase }}
                >
                  <h2
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: '2rem',
                      color: '#0a0a0a',
                      marginBottom: '1.5rem',
                    }}
                  >
                    SHIPPING DESTINATION & METHOD
                  </h2>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <Field name="address" label="Street Address / Building / Unit" placeholder="Unit 14B, One Bonifacio High Street" />
                    </div>
                    <Field name="city" label="City / Municipality" placeholder="Taguig City" />
                    <div>
                      <label
                        style={{
                          display: 'block',
                          color: '#666',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          marginBottom: 6,
                        }}
                      >
                        Province / Region
                      </label>
                      <select
                        name="province"
                        value={form.province}
                        onChange={handleInput}
                        style={{
                          width: '100%',
                          background: '#fff',
                          border: '1.5px solid #e5e5e0',
                          borderRadius: 12,
                          padding: '0.75rem 1rem',
                          color: '#0a0a0a',
                          fontSize: '0.875rem',
                          outline: 'none',
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        <option value="Metro Manila">Metro Manila (NCR)</option>
                        <option value="Cebu">Cebu (Central Visayas)</option>
                        <option value="Davao">Davao del Sur (Mindanao)</option>
                        <option value="Pampanga">Pampanga (Central Luzon)</option>
                        <option value="Cavite">Cavite (Calabarzon)</option>
                        <option value="Laguna">Laguna (Calabarzon)</option>
                        <option value="Iloilo">Iloilo (Western Visayas)</option>
                      </select>
                    </div>
                    <Field name="zip" label="Postal / ZIP Code" placeholder="1634" />
                  </div>

                  <h3
                    style={{
                      color: '#0a0a0a',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '1rem',
                    }}
                  >
                    Select Courier Delivery Speed
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    {SHIPPING_OPTIONS.map((opt) => {
                      const isSelected = shippingMethod === opt.id;
                      const effectivePrice = isFreeShipQualified && opt.id === 'free' ? 0 : opt.price;
                      return (
                        <motion.label
                          key={opt.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1.1rem 1.25rem',
                            borderRadius: 16,
                            cursor: 'pointer',
                            border: `2px solid ${isSelected ? '#0a0a0a' : '#eeeeea'}`,
                            background: isSelected ? '#fafaf8' : '#ffffff',
                            boxShadow: isSelected ? '0 4px 14px rgba(0,0,0,0.05)' : 'none',
                            transition: 'all 0.25s ease',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <input
                              type="radio"
                              name="shipping"
                              value={opt.id}
                              checked={isSelected}
                              onChange={() => setShippingMethod(opt.id)}
                              style={{ width: 18, height: 18, accentColor: '#0a0a0a', cursor: 'pointer' }}
                            />
                            <div>
                              <div style={{ color: '#0a0a0a', fontSize: '0.92rem', fontWeight: 800 }}>
                                {opt.label}
                              </div>
                              <div style={{ color: '#777', fontSize: '0.78rem' }}>{opt.desc}</div>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span
                              style={{
                                color: effectivePrice === 0 ? '#16a34a' : '#0a0a0a',
                                fontWeight: 800,
                                fontSize: '0.95rem',
                              }}
                            >
                              {effectivePrice === 0 ? 'FREE' : formatPrice(effectivePrice)}
                            </span>
                            <div style={{ color: '#999', fontSize: '0.7rem' }}>{opt.eta}</div>
                          </div>
                        </motion.label>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* ── 3. PAYMENT STEP ── */}
              {step === 'payment' && (
                <motion.div
                  key="payment"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: smoothEase }}
                >
                  <h2
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: '2rem',
                      color: '#0a0a0a',
                      marginBottom: '0.5rem',
                    }}
                  >
                    SELECT PAYMENT METHOD
                  </h2>
                  <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1.75rem' }}>
                    Transactions are processed in Philippine Pesos (PHP) with encrypted protection.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '2rem' }}>
                    {PAYMENT_METHODS.map(({ id, icon: Icon, label, desc, badge, color }) => {
                      const isSelected = payment === id;
                      return (
                        <motion.div
                          key={id}
                          onClick={() => setPayment(id)}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          style={{
                            padding: '1.1rem 1.25rem',
                            borderRadius: 16,
                            cursor: 'pointer',
                            border: `2px solid ${isSelected ? '#0a0a0a' : '#eeeeea'}`,
                            background: isSelected ? '#fafaf8' : '#ffffff',
                            transition: 'all 0.25s ease',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <input
                              type="radio"
                              name="payment"
                              value={id}
                              checked={isSelected}
                              onChange={() => setPayment(id)}
                              style={{ width: 18, height: 18, accentColor: '#0a0a0a', cursor: 'pointer' }}
                            />
                            <div
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: 10,
                                background: isSelected ? color : '#f2f2ef',
                                color: isSelected ? '#fff' : '#444',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.25s',
                              }}
                            >
                              <Icon size={20} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ color: '#0a0a0a', fontSize: '0.92rem', fontWeight: 800 }}>
                                  {label}
                                </span>
                                <span
                                  style={{
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    background: isSelected ? '#0a0a0a' : '#eeeeea',
                                    color: isSelected ? '#fff' : '#666',
                                    padding: '2px 8px',
                                    borderRadius: 100,
                                  }}
                                >
                                  {badge}
                                </span>
                              </div>
                              <div style={{ color: '#777', fontSize: '0.78rem' }}>{desc}</div>
                            </div>
                          </div>

                          {/* Expanded details for payment simulation */}
                          {isSelected && id === 'gcash' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e5df' }}
                            >
                              <p style={{ color: '#007dfc', fontSize: '0.8rem', fontWeight: 700, marginBottom: 8 }}>
                                📱 GCash Mobile Payment Gateway
                              </p>
                              <input
                                type="tel"
                                placeholder="Enter registered GCash mobile number (09XXXXXXXXX)"
                                value={form.gcashPhone || form.phone}
                                onChange={(e) => setForm((p) => ({ ...p, gcashPhone: e.target.value }))}
                                style={{
                                  width: '100%',
                                  padding: '0.65rem 1rem',
                                  borderRadius: 10,
                                  border: '1.5px solid #007dfc',
                                  fontSize: '0.85rem',
                                  outline: 'none',
                                }}
                              />
                            </motion.div>
                          )}

                          {isSelected && id === 'card' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e5df' }}
                            >
                              {/* Simulated Card Graphic */}
                              <div
                                style={{
                                  background: 'linear-gradient(135deg, #1c1c22, #0d0d12)',
                                  color: '#fff',
                                  borderRadius: 14,
                                  padding: '1.25rem',
                                  maxWidth: 320,
                                  marginBottom: '1rem',
                                  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                                  <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em' }}>NIKE MEMBER CARD</span>
                                  <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>VISA</span>
                                </div>
                                <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: '0.15em', marginBottom: '1rem' }}>
                                  {form.cardNumber}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                                  <div>
                                    <div style={{ color: '#888' }}>CARDHOLDER</div>
                                    <div style={{ fontWeight: 700 }}>{form.cardName || `${form.firstName} ${form.lastName}` || 'JUAN DELA CRUZ'}</div>
                                  </div>
                                  <div>
                                    <div style={{ color: '#888' }}>EXPIRES</div>
                                    <div style={{ fontWeight: 700 }}>{form.cardExpiry}</div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* ── 4. CONFIRMATION RECEIPT STEP ── */}
              {step === 'confirm' && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: smoothEase }}
                  style={{ textAlign: 'center', padding: '1rem 0' }}
                >
                  {/* Celebratory Check */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 18, delay: 0.15 }}
                    style={{
                      width: 88,
                      height: 88,
                      borderRadius: '50%',
                      background: 'rgba(22, 163, 74, 0.12)',
                      border: '2px solid rgba(22, 163, 74, 0.3)',
                      color: '#16a34a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.5rem',
                    }}
                  >
                    <CheckCircle size={46} />
                  </motion.div>

                  <h2
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: '3.5rem',
                      color: '#0a0a0a',
                      lineHeight: 1,
                      margin: '0 0 0.5rem',
                    }}
                  >
                    ORDER CONFIRMED!
                  </h2>
                  <p style={{ color: '#666', fontSize: '1rem', maxWidth: 440, margin: '0 auto 2rem' }}>
                    Thank you, <strong>{form.firstName || 'Customer'}</strong>! We’ve received your order and our logistics team is preparing your package.
                  </p>

                  {/* Order Status Tracker */}
                  <div
                    style={{
                      background: '#fafaf8',
                      border: '1px solid #eeeee8',
                      borderRadius: 20,
                      padding: '2rem 1.5rem',
                      maxWidth: 680,
                      margin: '0 auto 2.5rem',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: 700, textTransform: 'uppercase' }}>
                          Official Tracking Number
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '1.1rem', fontWeight: 800, color: '#0a0a0a' }}>
                          {orderNumber}
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(orderNumber);
                              setCopiedOrder(true);
                              setTimeout(() => setCopiedOrder(false), 2000);
                            }}
                            title="Copy Tracking Number"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', padding: 2 }}
                          >
                            <Copy size={15} />
                          </button>
                          {copiedOrder && <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>Copied!</span>}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: 700, textTransform: 'uppercase' }}>Date</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0a0a0a' }}>{orderDate}</div>
                      </div>
                    </div>

                    {/* Progress Bar Timeline */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, position: 'relative', textAlign: 'center' }}>
                      {[
                        { title: 'Order Placed', time: 'Just Now', active: true },
                        { title: 'Packaging', time: 'In Progress', active: true },
                        { title: 'Courier Transit', time: 'Expected Tomorrow', active: false },
                        { title: 'Delivered', time: '2–3 Days', active: false },
                      ].map((st, idx) => (
                        <div key={st.title} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              background: st.active ? '#0a0a0a' : '#e0e0da',
                              color: '#fff',
                              fontSize: '0.65rem',
                              fontWeight: 800,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginBottom: 6,
                            }}
                          >
                            {st.active ? '✓' : idx + 1}
                          </div>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: st.active ? '#0a0a0a' : '#888' }}>
                            {st.title}
                          </span>
                          <span style={{ fontSize: '0.65rem', color: '#aaa' }}>{st.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => window.print()}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '0.85rem 1.75rem',
                        borderRadius: 100,
                        border: '1.5px solid #d0d0c8',
                        background: '#ffffff',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        color: '#0a0a0a',
                      }}
                    >
                      <Printer size={15} /> Print Receipt
                    </button>
                    <Link
                      to="/shop"
                      className="btn-primary"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                    >
                      EXPLORE MORE SNEAKERS <ChevronRight size={15} />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons at bottom of form */}
            {step !== 'confirm' && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '2.5rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid #eeeee8',
                }}
              >
                <button
                  onClick={step === 'info' ? () => navigate(-1) : () => setStep(STEPS[currentIdx - 1].key)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#666',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    padding: 0,
                  }}
                >
                  <ArrowLeft size={16} /> Previous
                </button>

                {step === 'payment' ? (
                  <motion.button
                    onClick={() => {
                      setStep('confirm');
                      clearCart();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    id="place-order-btn"
                    className="btn-primary"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    style={{ fontSize: '0.85rem', padding: '0.95rem 2.25rem' }}
                  >
                    PLACE ORDER · {formatPrice(total)}
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handleNext}
                    className="btn-primary"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}
                  >
                    CONTINUE TO {STEPS[currentIdx + 1]?.label.toUpperCase()} <ChevronRight size={16} />
                  </motion.button>
                )}
              </div>
            )}
          </div>

          {/* Right: Sticky Order Summary */}
          {step !== 'confirm' && (
            <div
              style={{
                position: 'sticky',
                top: 86,
                background: '#ffffff',
                borderRadius: 24,
                padding: '2rem',
                border: '1px solid #eeeee8',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              }}
            >
              <h3
                style={{
                  color: '#0a0a0a',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  marginBottom: '1.5rem',
                }}
              >
                Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
              </h3>

              {/* Items List */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  maxHeight: 280,
                  overflowY: 'auto',
                  marginBottom: '1.5rem',
                  paddingRight: 4,
                }}
              >
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedColor.name}-${item.selectedSize}`}
                    style={{ display: 'flex', gap: '0.875rem', alignItems: 'center' }}
                  >
                    <div
                      style={{
                        width: 58,
                        height: 58,
                        borderRadius: 10,
                        background: '#f5f5f3',
                        overflow: 'hidden',
                        border: '1px solid #eeeee8',
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          color: '#0a0a0a',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.product.name}
                      </div>
                      <div style={{ color: '#888', fontSize: '0.72rem' }}>
                        {item.selectedColor.name} · US {item.selectedSize} · Qty {item.quantity}
                      </div>
                    </div>
                    <div style={{ color: '#0a0a0a', fontWeight: 800, fontSize: '0.85rem' }}>
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Box */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Coupon (e.g. NIKE20)"
                    style={{
                      flex: 1,
                      padding: '0.6rem 0.85rem',
                      borderRadius: 10,
                      border: '1.5px solid #e5e5e0',
                      fontSize: '0.8rem',
                      outline: 'none',
                      textTransform: 'uppercase',
                    }}
                  />
                  <button
                    onClick={handleApplyPromo}
                    style={{
                      background: '#0a0a0a',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 10,
                      padding: '0.6rem 1rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    APPLY
                  </button>
                </div>
                {promoError && (
                  <div style={{ color: '#ef4444', fontSize: '0.72rem', marginTop: 4 }}>
                    {promoError}
                  </div>
                )}
                {appliedPromo && (
                  <div
                    style={{
                      marginTop: 6,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      background: '#ecfdf5',
                      border: '1px solid #a7f3d0',
                      padding: '2px 8px',
                      borderRadius: 100,
                      fontSize: '0.72rem',
                      color: '#065f46',
                      fontWeight: 700,
                    }}
                  >
                    <Tag size={11} /> Code {appliedPromo.code} Applied!
                  </div>
                )}
              </div>

              {/* Breakdown */}
              <div
                style={{
                  borderTop: '1px solid #f0f0ec',
                  paddingTop: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', fontSize: '0.85rem' }}>
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontSize: '0.85rem', fontWeight: 700 }}>
                    <span>Promo Discount</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', fontSize: '0.85rem' }}>
                  <span>Shipping</span>
                  <span style={{ color: shipping === 0 ? '#16a34a' : '#666', fontWeight: shipping === 0 ? 700 : 400 }}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: '1px solid #f0f0ec',
                    paddingTop: '1rem',
                    marginTop: '0.5rem',
                    alignItems: 'baseline',
                  }}
                >
                  <span style={{ color: '#0a0a0a', fontWeight: 800, fontSize: '1rem' }}>Total</span>
                  <span style={{ color: '#0a0a0a', fontWeight: 900, fontSize: '1.4rem' }}>
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Assurance Mini-badge */}
              <div
                style={{
                  marginTop: '1.5rem',
                  background: '#f8f8f6',
                  borderRadius: 12,
                  padding: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: '0.72rem',
                  color: '#666',
                }}
              >
                <ShieldCheck size={18} color="#16a34a" style={{ flexShrink: 0 }} />
                <span>Includes official Nike PH warranty and replacement guarantee.</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
