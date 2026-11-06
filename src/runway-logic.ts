/**
 * Decoupled pure logic for Runway Carousel & Styling Bag
 */

export const SPRING_K = 95;
export const SPRING_C = 2 * Math.sqrt(SPRING_K); // ~19.49

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function wrapAngle(rad: number): number {
  const twoPi = 2 * Math.PI;
  let res = rad % twoPi;
  if (res <= -Math.PI) res += twoPi;
  if (res > Math.PI) res -= twoPi;
  return res;
}

export function computeRingSlot(
  slotIndex: number,
  cur: number,
  W: number,
  H: number,
  fs = 1.08
) {
  const step = (2 * Math.PI) / 12; // 30 deg
  const cx = 0.5 * W;
  const R = 0.62 * W;
  const P = 1.65 * W;
  const floor = H - 34;
  const horizon = 0.36 * H;

  const phi = wrapAngle((slotIndex - cur) * step);
  const z = R * (1 - Math.cos(phi));
  const persp = P / (P + z);
  const sl = Math.abs(phi) / step;
  const scale = persp * (1 + (fs - 1) * clamp(1 - sl, 0, 1));
  const x = cx + R * Math.sin(phi) * persp;
  const feet = horizon + (floor - horizon) * persp;
  const bottom = H - feet;
  const blur = sl <= 1 ? 1.8 * sl : Math.min(1.8 + (sl - 1) * 2, 6.5);
  const opacity = clamp((Math.cos(phi) + 0.55) / 0.3, 0, 1);
  const zIndex = Math.round(scale * 1000);

  return { phi, z, persp, sl, scale, x, bottom, blur, opacity, zIndex };
}

export function computeBundleTotal(items: { price: number }[], discountPercent = 10) {
  const sum = items.reduce((acc, it) => acc + it.price, 0);
  const discounted = sum * ((100 - discountPercent) / 100);
  return {
    rawTotal: sum,
    discountedTotal: Math.round(discounted * 100) / 100,
  };
}

export interface BagEntry {
  id: number;
  quantity: number;
}

export function addBagEntry(entries: BagEntry[], variantId: number, quantity = 1): BagEntry[] {
  if (!Number.isSafeInteger(variantId)) {
    throw new Error('Please choose an available size.');
  }
  const qty = Number.isSafeInteger(quantity) && quantity > 0 ? quantity : 1;
  const next = entries.map(e => ({ ...e }));
  const existing = next.find(e => e.id === variantId);
  if (existing) {
    existing.quantity = Math.min(20, existing.quantity + qty);
  } else {
    if (next.length >= 50) return next;
    next.push({ id: variantId, quantity: Math.min(20, qty) });
  }
  return next;
}

export function removeBagEntry(entries: BagEntry[], variantId: number): BagEntry[] {
  return entries.filter(e => e.id !== variantId);
}

export function updateBagQuantity(entries: BagEntry[], variantId: number, newQuantity: number): BagEntry[] {
  if (!Number.isSafeInteger(newQuantity) || newQuantity <= 0) {
    return removeBagEntry(entries, variantId);
  }
  const clampedQty = Math.min(20, newQuantity);
  return entries.map(e => (e.id === variantId ? { ...e, quantity: clampedQty } : { ...e }));
}

export interface CatalogItemForTotals {
  price: number;
  variants: { id: number }[];
}

export function calculateBagTotals(
  entries: BagEntry[],
  catalogItems: CatalogItemForTotals[]
): { totalQuantity: number; itemCount: number; subtotal: number; formattedSubtotal: string } {
  let subtotal = 0;
  let totalQuantity = 0;

  for (const entry of entries) {
    const item = catalogItems.find(p => p.variants && p.variants.some(v => v.id === entry.id));
    if (item && Number.isFinite(item.price)) {
      subtotal += item.price * entry.quantity;
      totalQuantity += entry.quantity;
    }
  }

  const roundedSubtotal = Math.round(subtotal * 100) / 100;
  return {
    totalQuantity,
    itemCount: entries.length,
    subtotal: roundedSubtotal,
    formattedSubtotal: formatPkr(roundedSubtotal),
  };
}

export function formatPkr(amount: number): string {
  const rounded = Math.round(amount);
  return `Rs. ${rounded.toLocaleString('en-PK')}`;
}

// Backward-compatible alias for existing imports
export const formatUsd = formatPkr;

export interface GalleryItem {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  season: string;
  tag: string;
  image: string;
  hiresImage: string;
  runwayLookIndex: number;
  runwayLookName: string;
  featuredPieces: string[];
}

export const EDITORIAL_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'editorial-01',
    index: '01',
    title: 'The City Edit',
    subtitle: 'Heavy charcoal fleece sweatshirt paired with wide jeans and retro Air Jordan sneakers. Shot at our Lahore studio.',
    season: 'Drop 01 · Lahore',
    tag: 'Look 01',
    image: 'https://reel-ref-try-the-look.vercel.app/assets/model-1-640.webp',
    hiresImage: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-1.webp',
    runwayLookIndex: 0,
    runwayLookName: 'The City Edit',
    featuredPieces: ['Air Jordan 12 Retro', 'Tshirt', 'Sweatshirt'],
  },
  {
    id: 'editorial-02',
    index: '02',
    title: 'Gallery Opening',
    subtitle: 'Oversized black hoodie and soft cotton tee with clean white sneakers. Designed for relaxed daily wear in Karachi.',
    season: 'Drop 02 · Karachi',
    tag: 'Look 02',
    image: 'https://reel-ref-try-the-look.vercel.app/assets/model-5-640.webp',
    hiresImage: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-5.webp',
    runwayLookIndex: 1,
    runwayLookName: 'Gallery Opening',
    featuredPieces: ['Tatum 5 Orbit', 'Hoodie Black', 'Tshirt'],
  },
  {
    id: 'editorial-03',
    index: '03',
    title: 'Studio Day',
    subtitle: 'All-black streetwear look with our heavyweight cotton hoodie and Luka sneakers. Simple, comfortable fit for city life.',
    season: 'Drop 03 · Islamabad',
    tag: 'Look 03',
    image: 'https://reel-ref-try-the-look.vercel.app/assets/model-6-640.webp',
    hiresImage: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-6.webp',
    runwayLookIndex: 3,
    runwayLookName: 'Studio Day',
    featuredPieces: ['Hoodie', 'Luka 5', 'Tshirt'],
  },
];

export function getGalleryItems(): GalleryItem[] {
  return EDITORIAL_GALLERY_ITEMS;
}

export function getGalleryItemById(id: string): GalleryItem | undefined {
  return EDITORIAL_GALLERY_ITEMS.find((it) => it.id === id);
}

export interface ShippingMethod {
  id: string;
  name: string;
  estimate: string;
  price: number;
  description: string;
}

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Standard Courier (TCS / Trax)',
    estimate: '3–4 Working Days',
    price: 0,
    description: 'Free home delivery across Pakistan on orders over Rs. 10,000',
  },
  {
    id: 'express',
    name: 'Express Courier (Karachi & Lahore)',
    estimate: '1–2 Working Days',
    price: 500,
    description: 'Fast delivery to your doorstep with SMS tracking updates',
  },
  {
    id: 'same_day',
    name: 'VIP Same-Day Delivery (Karachi & Lahore)',
    estimate: 'Same Day Delivery',
    price: 900,
    description: 'Direct rider delivery to your home or office address',
  },
];

export interface CheckoutTotals {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  formattedSubtotal: string;
  formattedShipping: string;
  formattedDiscount: string;
  formattedTotal: string;
}

export function calculateCheckoutTotals(
  subtotal: number,
  shippingPrice: number,
  promoDiscountPercent: number = 0
): CheckoutTotals {
  const safeSubtotal = Math.max(0, subtotal);
  const safeShipping = Math.max(0, shippingPrice);
  const discountAmount = Math.round(safeSubtotal * (promoDiscountPercent / 100));
  const total = Math.max(0, safeSubtotal - discountAmount + safeShipping);

  return {
    subtotal: safeSubtotal,
    shipping: safeShipping,
    discount: discountAmount,
    total,
    formattedSubtotal: formatPkr(safeSubtotal),
    formattedShipping: safeShipping === 0 ? 'Free Delivery (Rs. 0)' : formatPkr(safeShipping),
    formattedDiscount: discountAmount > 0 ? `-${formatPkr(discountAmount)}` : 'Rs. 0',
    formattedTotal: formatPkr(total),
  };
}

export function generateOrderId(): string {
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `PK-2026-${randomSuffix}`;
}

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPakistaniPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const clean = phone.replace(/[\s-]/g, '');
  return /^(03[0-9]{9}|\+923[0-9]{9})$/.test(clean);
}

export function formatCreditCardNumber(value: string): string {
  const digitsOnly = value.replace(/\D/g, '').slice(0, 16);
  const parts = [];
  for (let i = 0; i < digitsOnly.length; i += 4) {
    parts.push(digitsOnly.substring(i, i + 4));
  }
  return parts.join(' ');
}

export function formatExpiry(value: string): string {
  const digitsOnly = value.replace(/\D/g, '').slice(0, 4);
  if (digitsOnly.length >= 3) {
    return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;
  }
  return digitsOnly;
}

