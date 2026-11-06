import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SPRING_K,
  SPRING_C,
  clamp,
  wrapAngle,
  computeRingSlot,
  computeBundleTotal,
  addBagEntry,
  formatUsd,
  type BagEntry,
} from './runway-logic';

test('spring constants match specification (K=95, critically damped C=2*sqrt(K))', () => {
  assert.equal(SPRING_K, 95);
  assert.ok(Math.abs(SPRING_C - 19.4935) < 0.01);
});

test('clamp restricts numbers within bounds', () => {
  assert.equal(clamp(5, 0, 10), 5);
  assert.equal(clamp(-2, 0, 10), 0);
  assert.equal(clamp(15, 0, 10), 10);
});

test('wrapAngle wraps angles to (-PI, PI]', () => {
  assert.equal(wrapAngle(0), 0);
  assert.ok(Math.abs(wrapAngle(Math.PI) - Math.PI) < 1e-9);
  assert.ok(Math.abs(wrapAngle(2 * Math.PI) - 0) < 1e-9);
  assert.ok(Math.abs(wrapAngle(3 * Math.PI) - Math.PI) < 1e-9);
});

test('computeRingSlot gives exact specified values for slot 0 (front)', () => {
  const W = 1000;
  const H = 700;
  const slot = computeRingSlot(0, 0, W, H, 1.08);

  // Front slot: x = 0.5W = 500, scale = 1.08, blur = 0, opacity = 1, zIndex = 1080
  assert.equal(slot.x, 500);
  assert.ok(Math.abs(slot.scale - 1.08) < 1e-3);
  assert.equal(slot.blur, 0);
  assert.equal(slot.opacity, 1);
  assert.equal(slot.zIndex, 1080);
});

test('computeRingSlot matches slot 1 and -1 symmetry and specifications', () => {
  const W = 1000;
  const H = 700;
  const slotPos1 = computeRingSlot(1, 0, W, H, 1.08);
  const slotNeg1 = computeRingSlot(-1, 0, W, H, 1.08);

  // Scale: ~0.952
  assert.ok(Math.abs(slotPos1.scale - 0.952) < 0.01);
  assert.ok(Math.abs(slotNeg1.scale - 0.952) < 0.01);

  // Blur: 1.8px
  assert.ok(Math.abs(slotPos1.blur - 1.8) < 0.01);

  // Symmetrical x around 0.5W: 0.795W and 0.205W
  assert.ok(Math.abs(slotPos1.x - 795) < 5);
  assert.ok(Math.abs(slotNeg1.x - 205) < 5);
});

test('computeBundleTotal calculates raw total and 10% discount in PKR', () => {
  const items = [
    { price: 24500 },
    { price: 6500 },
    { price: 14500 },
  ];
  const { rawTotal, discountedTotal } = computeBundleTotal(items, 10);
  assert.equal(rawTotal, 45500);
  assert.equal(discountedTotal, 40950);
});

test('addBagEntry updates quantities and caps at 20', () => {
  let entries: BagEntry[] = [];
  entries = addBagEntry(entries, 57015167025457);
  assert.equal(entries.length, 1);
  assert.equal(entries[0].quantity, 1);

  // Adding same variant increments
  entries = addBagEntry(entries, 57015167025457);
  assert.equal(entries[0].quantity, 2);

  // Add up to cap
  for (let i = 0; i < 25; i++) {
    entries = addBagEntry(entries, 57015167025457);
  }
  assert.equal(entries[0].quantity, 20);
});

test('addBagEntry throws on invalid non-integer id', () => {
  assert.throws(() => addBagEntry([], 'invalid' as unknown as number));
});

test('formatPkr formats accurately with integer comma separators', async () => {
  const { formatPkr } = await import('./runway-logic');
  assert.equal(formatPkr(149), 'Rs. 149');
  assert.equal(formatPkr(24500), 'Rs. 24,500');
  assert.equal(formatPkr(40950), 'Rs. 40,950');
});

test('filterCatalog correctly filters by category and search term', async () => {
  const { CATALOG_PRODUCTS, filterCatalog } = await import('./catalog-data');
  assert.equal(CATALOG_PRODUCTS.length, 8);

  const footwear = filterCatalog(CATALOG_PRODUCTS, 'footwear');
  assert.equal(footwear.length, 3);
  assert.ok(footwear.every((p) => p.type === 'Footwear'));

  const apparel = filterCatalog(CATALOG_PRODUCTS, 'apparel');
  assert.equal(apparel.length, 5);
  assert.ok(apparel.every((p) => p.type === 'Apparel'));

  const searchResults = filterCatalog(CATALOG_PRODUCTS, 'all', 'hoodie');
  assert.equal(searchResults.length, 2);
});

test('sortCatalog accurately sorts by price ascending and descending in PKR', async () => {
  const { CATALOG_PRODUCTS, sortCatalog } = await import('./catalog-data');
  const asc = sortCatalog(CATALOG_PRODUCTS, 'price-asc');
  assert.equal(asc[0].price, 6500);
  assert.equal(asc[asc.length - 1].price, 24500);

  const desc = sortCatalog(CATALOG_PRODUCTS, 'price-desc');
  assert.equal(desc[0].price, 24500);
  assert.equal(desc[desc.length - 1].price, 6500);
});

test('removeBagEntry removes target variant', async () => {
  const { removeBagEntry } = await import('./runway-logic');
  const initial = [
    { id: 101, quantity: 2 },
    { id: 202, quantity: 1 },
  ];
  const updated = removeBagEntry(initial, 101);
  assert.equal(updated.length, 1);
  assert.equal(updated[0].id, 202);
});

test('updateBagQuantity updates quantity or removes if quantity <= 0', async () => {
  const { updateBagQuantity } = await import('./runway-logic');
  let entries = [{ id: 101, quantity: 2 }];
  entries = updateBagQuantity(entries, 101, 5);
  assert.equal(entries[0].quantity, 5);

  // Clamps at 20
  entries = updateBagQuantity(entries, 101, 35);
  assert.equal(entries[0].quantity, 20);

  // Removes if 0 or negative
  entries = updateBagQuantity(entries, 101, 0);
  assert.equal(entries.length, 0);
});

test('calculateBagTotals computes correct totals and currency string', async () => {
  const { calculateBagTotals } = await import('./runway-logic');
  const catalog = [
    { price: 24500, variants: [{ id: 101 }, { id: 102 }] },
    { price: 6500, variants: [{ id: 201 }] },
  ];
  const entries = [
    { id: 101, quantity: 2 }, // 2 * 24500 = 49000
    { id: 201, quantity: 1 }, // 1 * 6500 = 6500
  ];
  const totals = calculateBagTotals(entries, catalog);
  assert.equal(totals.totalQuantity, 3);
  assert.equal(totals.itemCount, 2);
  assert.equal(totals.subtotal, 55500);
  assert.equal(totals.formattedSubtotal, 'Rs. 55,500');
});

test('getGalleryItems returns exactly 3 curated editorial items with required fields', async () => {
  const { getGalleryItems, getGalleryItemById } = await import('./runway-logic');
  const items = getGalleryItems();
  assert.equal(items.length, 3);
  
  items.forEach((item, idx) => {
    assert.ok(item.id.startsWith('editorial-'));
    assert.equal(item.index, `0${idx + 1}`);
    assert.ok(item.title.length > 0);
    assert.ok(item.image.includes('https://'));
    assert.ok(item.hiresImage.includes('https://'));
    assert.ok(Number.isInteger(item.runwayLookIndex) && item.runwayLookIndex >= 0);
    assert.ok(Array.isArray(item.featuredPieces) && item.featuredPieces.length > 0);
  });

  const item1 = getGalleryItemById('editorial-01');
  assert.ok(item1);
  assert.equal(item1?.title, 'The City Edit');
  assert.equal(item1?.runwayLookIndex, 0);

  const missing = getGalleryItemById('non-existent');
  assert.equal(missing, undefined);
});

test('calculateCheckoutTotals computes correct shipping and promo discounts in PKR', async () => {
  const { calculateCheckoutTotals, SHIPPING_METHODS } = await import('./runway-logic');
  
  // Standard free delivery
  const standard = calculateCheckoutTotals(15000, 0, 0);
  assert.equal(standard.subtotal, 15000);
  assert.equal(standard.shipping, 0);
  assert.equal(standard.discount, 0);
  assert.equal(standard.total, 15000);
  assert.equal(standard.formattedShipping, 'Free Delivery (Rs. 0)');
  assert.equal(standard.formattedTotal, 'Rs. 15,000');

  // Express shipping + 10% discount
  const expressWithDiscount = calculateCheckoutTotals(40000, 450, 10);
  assert.equal(expressWithDiscount.subtotal, 40000);
  assert.equal(expressWithDiscount.shipping, 450);
  assert.equal(expressWithDiscount.discount, 4000);
  assert.equal(expressWithDiscount.total, 36450);
  assert.equal(expressWithDiscount.formattedDiscount, '-Rs. 4,000');
  assert.equal(expressWithDiscount.formattedTotal, 'Rs. 36,450');

  assert.equal(SHIPPING_METHODS.length, 3);
  assert.equal(SHIPPING_METHODS[0].id, 'standard');
});

test('validation and formatting helpers work properly for Pakistani market', async () => {
  const { isValidEmail, isValidPakistaniPhone, formatCreditCardNumber, formatExpiry, generateOrderId } = await import('./runway-logic');

  assert.ok(isValidEmail('customer@gmail.com'));
  assert.ok(isValidEmail('atelier@trythelook.pk'));
  assert.ok(!isValidEmail('invalid-email'));
  assert.ok(!isValidEmail(''));

  assert.ok(isValidPakistaniPhone('03001234567'));
  assert.ok(isValidPakistaniPhone('+923001234567'));
  assert.ok(isValidPakistaniPhone('0321-9876543'));
  assert.ok(!isValidPakistaniPhone('12345'));
  assert.ok(!isValidPakistaniPhone('021-3456789'));

  assert.equal(formatCreditCardNumber('4111222233334444'), '4111 2222 3333 4444');
  assert.equal(formatExpiry('1228'), '12/28');

  const orderId = generateOrderId();
  assert.ok(orderId.startsWith('PK-2026-'));
  assert.equal(orderId.length, 13);
});


