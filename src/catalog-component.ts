// @ts-nocheck
import { CATALOG_PRODUCTS, filterCatalog, sortCatalog, type CatalogProduct } from './catalog-data';
import { shoppingBag } from './shopping-bag';
import { formatPkr } from './runway-logic';

export class ProductCatalogElement extends HTMLElement {
  private currentCategory: 'all' | 'footwear' | 'apparel' = 'all';
  private currentSort: 'default' | 'price-asc' | 'price-desc' = 'default';
  private searchQuery = '';
  private selectedVariants: Record<string, number> = {};

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  private render() {
    this.innerHTML = `
      <section class="catalog-section" id="catalog" aria-labelledby="catalog-title">
        <div class="catalog__container">
          <header class="catalog__head">
            <span class="catalog__kicker">02 / ALL CLOTHES & SNEAKERS</span>
            <div class="catalog__title-wrap">
              <div>
                <h2 class="catalog__title" id="catalog-title">Everything in Stock.</h2>
                <p class="catalog__sub">Every piece from our latest drop. Select your size, add to your bag, and pay with Cash on Delivery anywhere in Pakistan.</p>
              </div>
            </div>
          </header>

          <div class="catalog__bar">
            <div class="catalog__tabs" role="tablist" aria-label="Product categories">
              <button type="button" class="catalog__tab is-active" data-cat="all" role="tab" aria-selected="true">All Items (8)</button>
              <button type="button" class="catalog__tab" data-cat="footwear" role="tab" aria-selected="false">Shoes (3)</button>
              <button type="button" class="catalog__tab" data-cat="apparel" role="tab" aria-selected="false">Clothes (5)</button>
            </div>

            <div class="catalog__actions">
              <div class="catalog__search-wrap">
                <svg class="catalog__search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input type="search" class="catalog__search" placeholder="Search shirts, hoodies, shoes..." aria-label="Search catalog items" />
              </div>

              <select class="catalog__sort" aria-label="Sort collection">
                <option value="default">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div class="catalog__grid" id="catalog-grid" role="region" aria-label="Catalog items grid">
            <!-- Dynamic product cards -->
          </div>

          <footer class="catalog__footer">
            <div class="catalog__footer-brand">
              <img src="https://reel-ref-try-the-look.vercel.app/assets/nike-logo.svg" width="56" height="20" alt="Runway Pakistan" style="object-fit: contain;" />
              <p class="catalog__footer-copy">Runway Pakistan Collection · Made for everyday wear. Free delivery across Pakistan on orders over Rs. 10,000.</p>
            </div>
            <button type="button" class="catalog__top-btn" id="catalog-top-btn" aria-label="Back to top">
              <span>Back to Top ↑</span>
            </button>
          </footer>
        </div>
      </section>
    `;

    this.renderGrid();
  }

  private renderGrid() {
    const grid = this.querySelector('#catalog-grid');
    if (!grid) return;

    let items = filterCatalog(CATALOG_PRODUCTS, this.currentCategory, this.searchQuery);
    items = sortCatalog(items, this.currentSort);

    if (items.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 60px 0; text-align: center; color: var(--rw-c-muted, #66625c);">
          <p style="font-size: 14px; margin-bottom: 8px;">No items matched "${this.escapeHtml(this.searchQuery)}".</p>
          <button type="button" class="catalog__tab" id="reset-search" style="display: inline-block;">Clear search</button>
        </div>
      `;
      const resetBtn = grid.querySelector('#reset-search');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          const searchInput = this.querySelector('.catalog__search') as HTMLInputElement;
          if (searchInput) searchInput.value = '';
          this.searchQuery = '';
          this.renderGrid();
        });
      }
      return;
    }

    grid.innerHTML = items.map((product) => this.renderCardHtml(product)).join('');
  }

  private renderCardHtml(product: CatalogProduct): string {
    const selectedVariant = this.selectedVariants[product.id] || product.variants[0].id;
    const tagHtml = product.tag
      ? `<span class="cat-card__tag"><span class="cat-card__tag-text">${product.tag}</span></span>`
      : '';

    const pillsHtml = product.variants
      .map((v) => {
        const isChecked = v.id === selectedVariant;
        return `
          <div class="cat-pill">
            <input type="radio" id="pill-${product.id}-${v.id}" name="size-${product.id}" value="${v.id}" ${isChecked ? 'checked' : ''} data-product="${product.id}" data-variant="${v.id}" />
            <label for="pill-${product.id}-${v.id}">${v.o[0]}</label>
          </div>
        `;
      })
      .join('');

    return `
      <article class="cat-card" data-product-id="${product.id}">
        ${tagHtml}
        <a href="${product.url}" target="_blank" rel="noopener noreferrer" class="cat-card__media-link" aria-label="View ${product.name}">
          <img src="${product.image}" alt="${product.name}" class="cat-card__img" loading="lazy" decoding="async" />
        </a>
        <div class="cat-card__body">
          <span class="cat-card__vendor">${product.vendor}</span>
          <h3 class="cat-card__title">
            <a href="${product.url}" target="_blank" rel="noopener noreferrer">${product.name}</a>
          </h3>
          <div class="cat-card__meta">
            <span class="cat-card__price">${formatPkr(product.price)}</span>
            <button type="button" class="cat-card__look-badge" data-jump-look="${product.runwayLook}" title="View in ${product.runwayLookName}">
              Look 0${product.runwayLook + 1} ↗
            </button>
          </div>
          <div class="cat-card__sizes">
            <span class="cat-card__sizes-label">Available Sizes</span>
            <div class="cat-card__pills">
              ${pillsHtml}
            </div>
          </div>
          <button type="button" class="cat-card__btn" data-add-catalog="${product.id}" aria-label="Add ${product.name} to bag">
            <span>Add to bag</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </article>
    `;
  }

  private bindEvents() {
    // Category Tabs
    const tabs = this.querySelectorAll('.catalog__tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        tabs.forEach((t) => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        const current = e.currentTarget as HTMLElement;
        current.classList.add('is-active');
        current.setAttribute('aria-selected', 'true');
        this.currentCategory = (current.dataset.cat as 'all' | 'footwear' | 'apparel') || 'all';
        this.renderGrid();
      });
    });

    // Search
    const searchInput = this.querySelector('.catalog__search') as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        this.searchQuery = searchInput.value;
        this.renderGrid();
      });
    }

    // Sort
    const sortSelect = this.querySelector('.catalog__sort') as HTMLSelectElement;
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        this.currentSort = (sortSelect.value as 'default' | 'price-asc' | 'price-desc') || 'default';
        this.renderGrid();
      });
    }

    // Grid Delegated Click Events (Size change, Add to Bag, Jump to Runway)
    this.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      if (target && target.matches('input[data-variant]')) {
        const prodId = target.dataset.product;
        const variantId = Number(target.dataset.variant);
        if (prodId && variantId) {
          this.selectedVariants[prodId] = variantId;
        }
      }
    });

    this.addEventListener('click', async (e) => {
      const target = e.target as HTMLElement;

      // Jump to Runway look
      const jumpBtn = target.closest('[data-jump-look]') as HTMLElement;
      if (jumpBtn) {
        const lookIdx = parseInt(jumpBtn.dataset.jumpLook || '0', 10);
        const runway = document.querySelector('runway-section') as any;
        if (runway) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          if (typeof runway.go === 'function') {
            runway.go(lookIdx);
          }
        }
        return;
      }

      // Add to bag from catalog card
      const addBtn = target.closest('[data-add-catalog]') as HTMLButtonElement;
      if (addBtn) {
        const prodId = addBtn.dataset.addCatalog;
        const product = CATALOG_PRODUCTS.find((p) => p.id === prodId);
        if (!product) return;

        const variantId = this.selectedVariants[product.id] || product.variants[0].id;
        addBtn.disabled = true;
        const origText = addBtn.innerHTML;
        addBtn.innerHTML = `
          <span>Saving...</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="rw__i-spin" aria-hidden="true" style="animation: rw-spin .8s linear infinite;">
            <path d="M12 3a9 9 0 1 1-9 9"></path>
          </svg>
        `;

        try {
          if (window.RunwayBag && typeof window.RunwayBag.add === 'function') {
            await window.RunwayBag.add([{ id: variantId, quantity: 1 }]);
          }
          addBtn.classList.add('is-added');
          addBtn.innerHTML = `
            <span>Saved in bag</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          `;
          setTimeout(() => {
            addBtn.disabled = false;
            addBtn.classList.remove('is-added');
            addBtn.innerHTML = origText;
          }, 2400);
        } catch (err: any) {
          addBtn.disabled = false;
          addBtn.innerHTML = `<span>Error: ${err?.message || 'Try again'}</span>`;
          setTimeout(() => {
            addBtn.innerHTML = origText;
          }, 3000);
        }
      }

      // Back to Top button
      const topBtn = target.closest('#catalog-top-btn');
      if (topBtn) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  private escapeHtml(str: string): string {
    return str.replace(/[&<>'"]/g, (tag) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
    }[tag] || tag));
  }
}

if (!customElements.get('product-catalog')) {
  customElements.define('product-catalog', ProductCatalogElement);
}
