// @ts-nocheck
/**
 * Shopping Bag Module
 * Implements shopping bag functionality: adding, removing, updating quantity,
 * calculating totals, rendering #bag-dialog, and exporting shortlist.
 * Strictly adheres to designskill.md.
 */

import {
  addBagEntry,
  removeBagEntry,
  updateBagQuantity,
  calculateBagTotals,
  formatUsd,
  type BagEntry,
} from './runway-logic';

export interface CatalogVariant {
  id: number;
  a: boolean;
  o: string[];
}

export interface CatalogItem {
  id: string;
  name: string;
  type: string;
  price: number;
  image: string;
  sizes: string[];
  variants: CatalogVariant[];
  url: string;
}

export const INLINED_CATALOG = {
  source: 'https://nike-makknzjs.myshopify.com/pages/runway',
  items: [
    {
      id: 'tatum-5-orbit-copy',
      name: 'Air Jordan 12 Retro',
      type: 'Footwear',
      price: 24500,
      image: 'https://reel-ref-try-the-look.vercel.app/assets/source-tatum-5-orbit-copy.webp',
      sizes: ['40', '41', '42', '43', '44', '45', '46'],
      variants: [
        { id: 57015167025457, a: true, o: ['40'] },
        { id: 57015167058225, a: true, o: ['41'] },
        { id: 57015167090993, a: true, o: ['42'] },
        { id: 57015167123761, a: true, o: ['43'] },
        { id: 57015167156529, a: true, o: ['44'] },
        { id: 57015167189297, a: true, o: ['45'] },
        { id: 57015167222065, a: true, o: ['46'] },
      ],
      url: 'https://nike-makknzjs.myshopify.com/products/tatum-5-orbit-copy',
    },
    {
      id: 'tshirt',
      name: 'Tshirt',
      type: 'Apparel',
      price: 6500,
      image: 'https://reel-ref-try-the-look.vercel.app/assets/source-tshirt.webp',
      sizes: ['S', 'L', 'M', 'XL'],
      variants: [
        { id: 56835911582001, a: true, o: ['S'] },
        { id: 56835911614769, a: true, o: ['L'] },
        { id: 56835911647537, a: true, o: ['M'] },
        { id: 56835911680305, a: true, o: ['XL'] },
      ],
      url: 'https://nike-makknzjs.myshopify.com/products/tshirt',
    },
    {
      id: 'sweatshirt',
      name: 'Sweatshirt',
      type: 'Apparel',
      price: 14500,
      image: 'https://reel-ref-try-the-look.vercel.app/assets/source-sweatshirt.webp',
      sizes: ['S', 'L', 'M', 'XL'],
      variants: [
        { id: 56835806396721, a: true, o: ['S'] },
        { id: 56835806429489, a: true, o: ['L'] },
        { id: 56835806462257, a: true, o: ['M'] },
        { id: 56835806495025, a: true, o: ['XL'] },
      ],
      url: 'https://nike-makknzjs.myshopify.com/products/sweatshirt',
    },
    {
      id: 'tatum-5-orbit',
      name: 'Tatum 5 Orbit',
      type: 'Footwear',
      price: 24500,
      image: 'https://reel-ref-try-the-look.vercel.app/assets/source-tatum-5-orbit.webp',
      sizes: ['40', '41', '42', '43', '44', '45', '46'],
      variants: [
        { id: 57015166730545, a: true, o: ['40'] },
        { id: 57015166763313, a: true, o: ['41'] },
        { id: 57015166796081, a: true, o: ['42'] },
        { id: 57015166828849, a: true, o: ['43'] },
        { id: 57015166861617, a: true, o: ['44'] },
        { id: 57015166894385, a: true, o: ['45'] },
        { id: 57015166927153, a: true, o: ['46'] },
      ],
      url: 'https://nike-makknzjs.myshopify.com/products/tatum-5-orbit',
    },
    {
      id: 'hoodie-black',
      name: 'Hoodie Black',
      type: 'Apparel',
      price: 16500,
      image: 'https://reel-ref-try-the-look.vercel.app/assets/source-hoodie-black.webp',
      sizes: ['S', 'L', 'M', 'XL'],
      variants: [
        { id: 56836251681073, a: true, o: ['S'] },
        { id: 56836251713841, a: true, o: ['L'] },
        { id: 56836251746609, a: true, o: ['M'] },
        { id: 56836251779377, a: true, o: ['XL'] },
      ],
      url: 'https://nike-makknzjs.myshopify.com/products/hoodie-black',
    },
    {
      id: 'sweatshirt-plus',
      name: 'Sweatshirt Plus',
      type: 'Apparel',
      price: 14500,
      image: 'https://reel-ref-try-the-look.vercel.app/assets/source-sweatshirt-plus.webp',
      sizes: ['S', 'L', 'M', 'XL'],
      variants: [
        { id: 56836143743281, a: true, o: ['S'] },
        { id: 56836143776049, a: true, o: ['L'] },
        { id: 56836143808817, a: true, o: ['M'] },
        { id: 56836143841585, a: true, o: ['XL'] },
      ],
      url: 'https://nike-makknzjs.myshopify.com/products/sweatshirt-plus',
    },
    {
      id: 'hoodie',
      name: 'Hoodie',
      type: 'Apparel',
      price: 16500,
      image: 'https://reel-ref-try-the-look.vercel.app/assets/source-hoodie.webp',
      sizes: ['S', 'L', 'M', 'XL'],
      variants: [
        { id: 56836002185521, a: true, o: ['S'] },
        { id: 56836002218289, a: true, o: ['L'] },
        { id: 56836002251057, a: true, o: ['M'] },
        { id: 56836002283825, a: true, o: ['XL'] },
      ],
      url: 'https://nike-makknzjs.myshopify.com/products/hoodie',
    },
    {
      id: 'air-jordan-12-retro-copy',
      name: 'Luka 5',
      type: 'Footwear',
      price: 24500,
      image: 'https://reel-ref-try-the-look.vercel.app/assets/source-air-jordan-12-retro-copy.webp',
      sizes: ['40', '41', '42', '43', '44', '45', '46'],
      variants: [
        { id: 57015176364337, a: true, o: ['40'] },
        { id: 57015176397105, a: true, o: ['41'] },
        { id: 57015176429873, a: true, o: ['42'] },
        { id: 57015176462641, a: true, o: ['43'] },
        { id: 57015176495409, a: true, o: ['44'] },
        { id: 57015176528177, a: true, o: ['45'] },
        { id: 57015176560945, a: true, o: ['46'] },
      ],
      url: 'https://nike-makknzjs.myshopify.com/products/air-jordan-12-retro-copy',
    },
  ],
};

export class ShoppingBag {
  private readonly storageKey = 'runway-styling-bag-v3';
  private entries: BagEntry[] = [];
  private hideTimer: any = null;

  constructor() {
    this.load();
  }

  private load() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.entries = parsed
            .filter(
              (e) =>
                e &&
                Number.isSafeInteger(e.id) &&
                Number.isSafeInteger(e.quantity) &&
                e.quantity > 0 &&
                e.quantity <= 20 &&
                this.findProduct(e.id)
            )
            .slice(0, 50);
        }
      }
    } catch (_) {
      this.entries = [];
    }
  }

  private save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.entries));
    } catch (_) {}
  }

  public findProduct(variantId: number): { product: CatalogItem; variant: CatalogVariant } | null {
    for (const product of INLINED_CATALOG.items) {
      const variant = product.variants.find((v) => v.id === variantId && v.a === true);
      if (variant) {
        return { product, variant };
      }
    }
    return null;
  }

  public notify(message: string) {
    const status = document.getElementById('bag-status');
    if (!status) return;
    status.textContent = message;
    status.classList.add('is-on');
    clearTimeout(this.hideTimer);
    this.hideTimer = setTimeout(() => {
      status.classList.remove('is-on');
    }, 2500);
  }

  public async add(items: { id: number; quantity?: number }[]) {
    if (!Array.isArray(items) || items.length === 0) return;

    for (const item of items) {
      if (!Number.isSafeInteger(item.id)) {
        throw new Error('Please choose an available size.');
      }
      const match = this.findProduct(item.id);
      if (!match) {
        throw new Error('Please choose an available size.');
      }
      const qty = item.quantity && item.quantity > 0 ? item.quantity : 1;
      this.entries = addBagEntry(this.entries, item.id, qty);
    }

    this.save();
    await this.render();
    this.notify(
      items.length === 1
        ? 'Piece saved to your styling bag'
        : 'Look saved to your styling bag'
    );
  }

  public async remove(variantId: number) {
    const match = this.findProduct(variantId);
    this.entries = removeBagEntry(this.entries, variantId);
    this.save();
    await this.render();
    if (match) {
      this.notify(`Removed ${match.product.name} from styling bag`);
    }
  }

  public async setQuantity(variantId: number, quantity: number) {
    this.entries = updateBagQuantity(this.entries, variantId, quantity);
    this.save();
    await this.render();
  }

  public async stepQuantity(variantId: number, delta: number) {
    const current = this.entries.find((e) => e.id === variantId);
    if (!current) return;
    const newQty = current.quantity + delta;
    await this.setQuantity(variantId, newQty);
  }

  public async clear() {
    this.entries = [];
    this.save();
    await this.render();
    this.notify('Styling bag cleared');
  }

  public getTotals() {
    return calculateBagTotals(this.entries, INLINED_CATALOG.items);
  }

  public get currentEntries(): BagEntry[] {
    return this.entries.map((e) => ({ ...e }));
  }

  public async render() {
    // Purge any stale variants
    this.entries = this.entries.filter((e) => this.findProduct(e.id));

    const totals = this.getTotals();

    // 1. Update all cart count badges in header and elsewhere
    document.querySelectorAll('[data-cart-count]').forEach((el) => {
      el.textContent = String(totals.totalQuantity);
    });

    // 2. Update modal header count chip if available
    const headerChip = document.getElementById('bag-count-chip');
    if (headerChip) {
      headerChip.textContent = `${totals.totalQuantity} ${
        totals.totalQuantity === 1 ? 'piece' : 'pieces'
      }`;
    }

    // 3. Render items list or empty state inside #bag-items
    const list = document.getElementById('bag-items');
    if (list) {
      list.replaceChildren();

      if (this.entries.length === 0) {
        const emptyWrap = document.createElement('div');
        emptyWrap.className = 'bag-empty';
        emptyWrap.innerHTML = `
          <svg class="bag-empty__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true">
            <path d="M4 8h16l1 16H3L4 8zM8 8V6a4 4 0 0 1 8 0v2"></path>
          </svg>
          <h3 class="bag-empty__title">Your cart is empty</h3>
          <p class="bag-empty__desc">Browse our collection to add oversized tees, hoodies, or sneakers to your bag.</p>
          <button type="button" class="bag-empty__btn" id="bag-explore-btn">
            <span>Explore Collection</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        `;
        const exploreBtn = emptyWrap.querySelector('#bag-explore-btn');
        if (exploreBtn) {
          exploreBtn.addEventListener('click', () => {
            this.close();
            const catalog = document.getElementById('catalog');
            if (catalog) {
              catalog.scrollIntoView({ behavior: 'smooth' });
            }
          });
        }
        list.appendChild(emptyWrap);
      } else {
        for (const entry of this.entries) {
          const match = this.findProduct(entry.id);
          if (!match) continue;
          const { product, variant } = match;
          const lineTotal = product.price * entry.quantity;

          const row = document.createElement('div');
          row.className = 'bag-row';
          row.dataset.variantId = String(entry.id);

          // Thumbnail
          const thumb = document.createElement('div');
          thumb.className = 'bag-row__thumb';
          const img = document.createElement('img');
          img.src = product.image;
          img.alt = product.name;
          img.loading = 'lazy';
          img.decoding = 'async';
          thumb.appendChild(img);

          // Details
          const details = document.createElement('div');
          details.className = 'bag-row__details';

          const vendor = document.createElement('span');
          vendor.className = 'bag-row__vendor';
          vendor.textContent = product.type || 'Piece';

          const title = document.createElement('h3');
          title.className = 'bag-row__title';
          title.textContent = product.name;

          const meta = document.createElement('div');
          meta.className = 'bag-row__meta';
          meta.innerHTML = `
            <span class="bag-row__size">Size ${variant.o.join(' / ')}</span>
            <span class="bag-row__unit-price">${formatUsd(product.price)} each</span>
          `;

          const link = document.createElement('a');
          const parsedUrl = new URL(product.url);
          if (parsedUrl.hostname !== 'nike-makknzjs.myshopify.com') {
            throw new Error('Invalid product URL');
          }
          link.className = 'bag-row__link';
          link.href = parsedUrl.href;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.innerHTML = `View piece ↗`;

          details.append(vendor, title, meta, link);

          // Actions Column (stepper, total, remove)
          const actions = document.createElement('div');
          actions.className = 'bag-row__actions';

          const topActions = document.createElement('div');
          topActions.className = 'bag-row__top-actions';

          const lineTotalEl = document.createElement('span');
          lineTotalEl.className = 'bag-row__line-total';
          lineTotalEl.textContent = formatUsd(lineTotal);

          const removeBtn = document.createElement('button');
          removeBtn.type = 'button';
          removeBtn.className = 'bag-row__remove-btn';
          removeBtn.innerHTML = '×';
          removeBtn.setAttribute('aria-label', `Remove ${product.name} Size ${variant.o.join(' / ')}`);
          removeBtn.addEventListener('click', () => this.remove(entry.id));

          topActions.append(lineTotalEl, removeBtn);

          // Stepper
          const stepper = document.createElement('div');
          stepper.className = 'bag-stepper';

          const minusBtn = document.createElement('button');
          minusBtn.type = 'button';
          minusBtn.className = 'bag-stepper__btn';
          minusBtn.innerHTML = '−';
          minusBtn.setAttribute('aria-label', `Decrease quantity for ${product.name}`);
          minusBtn.addEventListener('click', () => this.stepQuantity(entry.id, -1));

          const qtyEl = document.createElement('span');
          qtyEl.className = 'bag-stepper__qty';
          qtyEl.textContent = String(entry.quantity);

          const plusBtn = document.createElement('button');
          plusBtn.type = 'button';
          plusBtn.className = 'bag-stepper__btn';
          plusBtn.innerHTML = '+';
          plusBtn.setAttribute('aria-label', `Increase quantity for ${product.name}`);
          plusBtn.disabled = entry.quantity >= 20;
          plusBtn.addEventListener('click', () => this.stepQuantity(entry.id, 1));

          stepper.append(minusBtn, qtyEl, plusBtn);
          actions.append(topActions, stepper);

          row.append(thumb, details, actions);
          list.appendChild(row);
        }
      }
    }

    // 4. Update Summary Section
    const totalEl = document.getElementById('bag-total');
    if (totalEl) {
      if (this.entries.length === 0) {
        totalEl.innerHTML = '';
      } else {
        totalEl.innerHTML = `
          <div class="bag-summary">
            <div class="bag-summary__left">
              <span class="bag-summary__count">${totals.totalQuantity} ${
          totals.totalQuantity === 1 ? 'item' : 'items'
        } in cart</span>
              <button type="button" class="bag-summary__clear" id="bag-clear-btn">Clear cart</button>
            </div>
            <div class="bag-summary__right">
              <span class="bag-summary__label">Subtotal</span>
              <span class="bag-summary__amount">${totals.formattedSubtotal}</span>
            </div>
          </div>
        `;
        const clearBtn = totalEl.querySelector('#bag-clear-btn');
        if (clearBtn) {
          clearBtn.addEventListener('click', () => this.clear());
        }
      }
    }

    // 5. Update Action Buttons
    const exportBtn = document.getElementById('export-bag') as HTMLButtonElement | null;
    if (exportBtn) {
      exportBtn.disabled = this.entries.length === 0;
    }
    const checkoutBtn = document.getElementById('checkout-bag-btn') as HTMLButtonElement | null;
    if (checkoutBtn) {
      checkoutBtn.disabled = this.entries.length === 0;
    }

    // 6. Keep store-checkout in sync if mounted
    const checkoutEl = document.querySelector('store-checkout') as any;
    if (checkoutEl && typeof checkoutEl.render === 'function') {
      checkoutEl.render();
    }
  }

  public async open() {
    await this.render();
    const dialog = document.getElementById('bag-dialog') as HTMLDialogElement | null;
    if (dialog && typeof dialog.showModal === 'function') {
      dialog.classList.remove('is-closing');
      if (!dialog.open) {
        dialog.showModal();
      }
    }
  }

  public close() {
    const dialog = document.getElementById('bag-dialog') as HTMLDialogElement | null;
    if (dialog && typeof dialog.close === 'function' && dialog.open) {
      if (dialog.classList.contains('is-closing')) return;
      dialog.classList.add('is-closing');
      setTimeout(() => {
        try {
          dialog.close();
        } catch (_) {}
        dialog.classList.remove('is-closing');
      }, 260);
    }
  }

  public async exportShortlist() {
    if (this.entries.length === 0) return;
    const totals = this.getTotals();
    const dateStr = new Date().toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const lines = [
      '====================================================',
      '           RUNWAY PAKISTAN — SAVED OUTFIT           ',
      '====================================================',
      `Date: ${dateStr}`,
      `Total Items: ${totals.totalQuantity}`,
      `Subtotal: ${totals.formattedSubtotal}`,
      '',
      'Delivery: Cash on Delivery & Bank Transfer across Pakistan.',
      'WhatsApp Support: +92 300 1234567 | 10 AM to 8 PM PKT',
      '----------------------------------------------------',
      '',
      ...this.entries.map((e, index) => {
        const match = this.findProduct(e.id);
        if (!match) return '';
        const { product, variant } = match;
        const lineTotal = formatUsd(product.price * e.quantity);
        return [
          `#0${index + 1} ${product.name.toUpperCase()}`,
          `    Size: ${variant.o.join(' / ')}`,
          `    Quantity: ${e.quantity}`,
          `    Price: ${formatUsd(product.price)} each (${lineTotal} total)`,
          `    Link: ${product.url}`,
        ].join('\n');
      }),
      '',
      '====================================================',
    ].filter(Boolean);

    const blob = new Blob([lines.join('\n\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'runway-pakistan-outfit.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    this.notify('Outfit list downloaded');
  }

  public initDOM() {
    // Open button
    const openBtn = document.getElementById('open-bag');
    if (openBtn) {
      openBtn.addEventListener('click', () => {
        this.open().catch((e) => this.notify(e.message));
      });
    }

    // Close button
    const closeBtn = document.getElementById('close-bag');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.close();
      });
    }

    // Backdrop click & Escape cancel
    const dialog = document.getElementById('bag-dialog') as HTMLDialogElement | null;
    if (dialog) {
      dialog.addEventListener('click', (event) => {
        if (event.target === dialog) {
          const rect = dialog.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          ) {
            this.close();
          }
        }
      });

      dialog.addEventListener('cancel', (event) => {
        event.preventDefault();
        this.close();
      });
    }

    // Export shortlist button
    const exportBtn = document.getElementById('export-bag');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.exportShortlist().catch((e) => this.notify(e.message));
      });
    }

    // Checkout button
    const checkoutBtn = document.getElementById('checkout-bag-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        this.close();
        window.location.hash = 'checkout';
      });
    }

    // Initial render
    this.render().catch((e) => this.notify(e.message));
  }
}

// Global Singleton Instance
export const shoppingBag = new ShoppingBag();

// Export as window.RunwayBag for seamless compatibility with runway & catalog sections
if (typeof window !== 'undefined') {
  window.RunwayBag = {
    add: (items) => shoppingBag.add(items),
    remove: (variantId) => shoppingBag.remove(variantId),
    setQuantity: (variantId, qty) => shoppingBag.setQuantity(variantId, qty),
    stepQuantity: (variantId, delta) => shoppingBag.stepQuantity(variantId, delta),
    clear: () => shoppingBag.clear(),
    render: () => shoppingBag.render(),
    open: () => shoppingBag.open(),
    close: () => shoppingBag.close(),
    exportShortlist: () => shoppingBag.exportShortlist(),
    get entries() {
      return shoppingBag.currentEntries;
    },
    get totals() {
      return shoppingBag.getTotals();
    },
  };
}
