import { CATALOG_PRODUCTS, type CatalogProduct, type CatalogVariant } from '../data/catalogData';

export interface BagEntry {
  id: number;
  quantity: number;
}

export interface BagTotals {
  totalQuantity: number;
  itemCount: number;
  subtotal: number;
  formattedSubtotal: string;
}

export function addBagEntry(entries: BagEntry[], variantId: number, quantity = 1): BagEntry[] {
  if (!Number.isSafeInteger(variantId)) {
    throw new Error('Please choose an available size.');
  }
  const qty = Number.isSafeInteger(quantity) && quantity > 0 ? quantity : 1;
  const next = entries.map((e) => ({ ...e }));
  const existing = next.find((e) => e.id === variantId);
  if (existing) {
    existing.quantity = Math.min(20, existing.quantity + qty);
  } else {
    if (next.length >= 50) return next;
    next.push({ id: variantId, quantity: Math.min(20, qty) });
  }
  return next;
}

export function removeBagEntry(entries: BagEntry[], variantId: number): BagEntry[] {
  return entries.filter((e) => e.id !== variantId);
}

export function updateBagQuantity(entries: BagEntry[], variantId: number, newQuantity: number): BagEntry[] {
  if (!Number.isSafeInteger(newQuantity) || newQuantity <= 0) {
    return removeBagEntry(entries, variantId);
  }
  const clampedQty = Math.min(20, newQuantity);
  return entries.map((e) => (e.id === variantId ? { ...e, quantity: clampedQty } : { ...e }));
}

export function calculateBagTotals(
  entries: BagEntry[],
  catalogItems: CatalogProduct[]
): BagTotals {
  let subtotal = 0;
  let totalQuantity = 0;

  for (const entry of entries) {
    const item = catalogItems.find((p) => p.variants && p.variants.some((v) => v.id === entry.id));
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

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gallery-look-1',
    index: '01',
    title: 'The City Edit',
    subtitle: 'All-black streetwear featuring relaxed cuts and dense cotton fleece.',
    season: 'Autumn / Winter 2026',
    tag: 'Studio Look 01',
    image: 'https://reel-ref-try-the-look.vercel.app/assets/model-1-640.webp',
    hiresImage: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-1.webp',
    runwayLookIndex: 0,
    runwayLookName: 'The City Edit',
    featuredPieces: ['Air Jordan 12 Retro', 'Tshirt', 'Sweatshirt'],
  },
  {
    id: 'gallery-look-2',
    index: '02',
    title: 'Gallery Opening',
    subtitle: 'High contrast styling with crisp white court footwear and structured outerwear.',
    season: 'Spring / Summer 2026',
    tag: 'Studio Look 02',
    image: 'https://reel-ref-try-the-look.vercel.app/assets/model-5-640.webp',
    hiresImage: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-5.webp',
    runwayLookIndex: 1,
    runwayLookName: 'Gallery Opening',
    featuredPieces: ['Tatum 5 Orbit', 'Hoodie Black', 'Tshirt'],
  },
  {
    id: 'gallery-look-3',
    index: '03',
    title: 'Studio Day',
    subtitle: 'Designed for daily comfort. Heavyweight 480 GSM cotton fleece paired with court shoes.',
    season: '2026 Release',
    tag: 'Studio Look 03',
    image: 'https://reel-ref-try-the-look.vercel.app/assets/model-6-640.webp',
    hiresImage: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-6.webp',
    runwayLookIndex: 3,
    runwayLookName: 'Studio Day',
    featuredPieces: ['Hoodie Black', 'Air Jordan 12 Retro', 'Tshirt'],
  },
];

export function getGalleryItems(): GalleryItem[] {
  return [...GALLERY_ITEMS];
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimate: string;
}

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Standard Courier',
    description: 'Tracked delivery nationwide',
    price: 350,
    estimate: '2–4 business days',
  },
  {
    id: 'express',
    name: 'Express Courier',
    description: 'Priority courier dispatch',
    price: 650,
    estimate: '1–2 business days',
  },
  {
    id: 'same_day',
    name: 'Same Day Studio Courier (Karachi & Lahore)',
    description: 'Direct studio dispatch within city limits',
    price: 950,
    estimate: 'Same evening (orders before 2 PM)',
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
  shippingFee: number,
  discountPercent = 0
): CheckoutTotals {
  const discount = Math.round((subtotal * discountPercent) / 100);
  const effectiveShipping = subtotal >= 10000 ? 0 : shippingFee;
  const total = Math.max(0, subtotal - discount + effectiveShipping);

  return {
    subtotal,
    shipping: effectiveShipping,
    discount,
    total,
    formattedSubtotal: formatPkr(subtotal),
    formattedShipping: effectiveShipping === 0 ? 'Free' : formatPkr(effectiveShipping),
    formattedDiscount: discount > 0 ? `- ${formatPkr(discount)}` : 'Rs. 0',
    formattedTotal: formatPkr(total),
  };
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPakistaniPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  return /^(03\d{9}|923\d{9}|3\d{9})$/.test(cleaned);
}

export function formatCreditCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').substring(0, 16);
  const parts = [];
  for (let i = 0; i < digits.length; i += 4) {
    parts.push(digits.substring(i, i + 4));
  }
  return parts.join(' ');
}

export function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').substring(0, 4);
  if (digits.length >= 3) {
    return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
  }
  return digits;
}

export function generateOrderId(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  let randStr = '';
  for (let i = 0; i < 4; i++) {
    randStr += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  const num = Math.floor(1000 + Math.random() * 9000);
  return `ZR-${randStr}-${num}`;
}

