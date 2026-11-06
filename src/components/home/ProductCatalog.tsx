import React, { useState } from 'react';
import { CATALOG_PRODUCTS, filterCatalog, sortCatalog, CatalogProduct } from '../../data/catalogData';
import { formatPkr } from '../../utils/runwayLogic';
import { useCart } from '../../context/CartContext';

interface ProductCatalogProps {
  id?: string;
  onJumpToLook?: (lookIndex: number) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ id = 'catalog', onJumpToLook }) => {
  const { addItem } = useCart();
  const [category, setCategory] = useState<'all' | 'footwear' | 'apparel'>('all');
  const [sort, setSort] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [search, setSearch] = useState('');
  const [selectedVariants, setSelectedVariants] = useState<Record<string, number>>({});
  const [addedStatus, setAddedStatus] = useState<Record<string, boolean>>({});

  let filtered = filterCatalog(CATALOG_PRODUCTS, category, search);
  filtered = sortCatalog(filtered, sort);

  const handleVariantSelect = (productId: string, variantId: number) => {
    setSelectedVariants((prev) => ({ ...prev, [productId]: variantId }));
  };

  const handleAddToCart = (product: CatalogProduct) => {
    const variantId = selectedVariants[product.id] || product.variants[0].id;
    addItem(variantId, 1);
    setAddedStatus((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedStatus((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="catalog-section" id={id} aria-labelledby={`${id}-title`}>
      <div className="catalog__container">
        <header className="catalog__head">
          <span className="catalog__kicker">02 / COLLECTION</span>
          <div className="catalog__title-wrap">
            <div>
              <h2 className="catalog__title" id={`${id}-title`}>
                Our Collection.
              </h2>
              <p className="catalog__sub">
                Essential pieces from our latest release. Select your size to add to bag.
              </p>
            </div>
          </div>
        </header>

        <div className="catalog__bar">
          <div className="catalog__tabs" role="tablist" aria-label="Product categories">
            <button
              type="button"
              className={`catalog__tab ${category === 'all' ? 'is-active' : ''}`}
              role="tab"
              aria-selected={category === 'all'}
              onClick={() => setCategory('all')}
            >
              All (8)
            </button>
            <button
              type="button"
              className={`catalog__tab ${category === 'footwear' ? 'is-active' : ''}`}
              role="tab"
              aria-selected={category === 'footwear'}
              onClick={() => setCategory('footwear')}
            >
              Footwear (3)
            </button>
            <button
              type="button"
              className={`catalog__tab ${category === 'apparel' ? 'is-active' : ''}`}
              role="tab"
              aria-selected={category === 'apparel'}
              onClick={() => setCategory('apparel')}
            >
              Apparel (5)
            </button>
          </div>

          <div className="catalog__actions">
            <div className="catalog__search-wrap">
              <svg className="catalog__search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="search"
                className="catalog__search"
                placeholder="Search collection..."
                aria-label="Search collection"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="catalog__sort"
              aria-label="Sort collection"
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
            >
              <option value="default">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="catalog__grid" role="region" aria-label="Collection grid">
          {filtered.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '60px 0', textAlign: 'center', color: 'var(--rw-c-muted, #66625c)' }}>
              <p style={{ fontSize: '14px', marginBottom: '8px' }}>
                No items matched "{search}".
              </p>
              <button
                type="button"
                className="catalog__tab"
                style={{ display: 'inline-block' }}
                onClick={() => setSearch('')}
              >
                Clear search
              </button>
            </div>
          ) : (
            filtered.map((product) => {
              const selectedVar = selectedVariants[product.id] || product.variants[0].id;
              const isAdded = addedStatus[product.id];

              return (
                <article className="cat-card" key={product.id} data-product-id={product.id}>
                  {product.tag && (
                    <span className="cat-card__tag">
                      <span className="cat-card__tag-text">{product.tag}</span>
                    </span>
                  )}
                  <div
                    className="cat-card__media-link"
                    role="button"
                    tabIndex={0}
                    aria-label={`View ${product.name} in Look 0${product.runwayLook + 1}`}
                    onClick={() => onJumpToLook && onJumpToLook(product.runwayLook)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onJumpToLook && onJumpToLook(product.runwayLook);
                      }
                    }}
                  >
                    <img src={product.image} alt={product.name} className="cat-card__img" loading="lazy" decoding="async" />
                  </div>
                  <div className="cat-card__body">
                    <span className="cat-card__vendor">{product.vendor}</span>
                    <h3 className="cat-card__title">{product.name}</h3>
                    <div className="cat-card__meta">
                      <span className="cat-card__price">{formatPkr(product.price)}</span>
                      <button
                        type="button"
                        className="cat-card__look-badge"
                        title={`View in ${product.runwayLookName}`}
                        onClick={() => onJumpToLook && onJumpToLook(product.runwayLook)}
                      >
                        <span>Look 0{product.runwayLook + 1}</span>
                        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '2px' }}>
                          <path d="M4 12L12 4M12 4H6M12 4V10" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                    <div className="cat-card__sizes">
                      <span className="cat-card__sizes-label">Size</span>
                      <div className="cat-card__pills">
                        {product.variants.map((v) => (
                          <div className="cat-pill" key={v.id}>
                            <input
                              type="radio"
                              id={`pill-${product.id}-${v.id}`}
                              name={`size-${product.id}`}
                              value={v.id}
                              checked={v.id === selectedVar}
                              onChange={() => handleVariantSelect(product.id, v.id)}
                            />
                            <label htmlFor={`pill-${product.id}-${v.id}`}>{v.o[0]}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`cat-card__btn ${isAdded ? 'is-added' : ''}`}
                      aria-label={`Add ${product.name} to bag`}
                      onClick={() => handleAddToCart(product)}
                    >
                      {isAdded ? (
                        <>
                          <span>Added to bag</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </>
                      ) : (
                        <>
                          <span>Add to bag</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </div>

        <footer className="catalog__footer">
          <div className="catalog__footer-brand">
            <img src="/assets/zircon-logo.png" width="28" height="28" alt="Zircon" style={{ objectFit: 'contain' }} />
            <p className="catalog__footer-copy">Zircon · Premium streetwear made to last.</p>
          </div>
          <button type="button" className="catalog__top-btn" onClick={scrollToTop} aria-label="Back to top">
            <span>Back to Top</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px' }}>
              <line x1="12" y1="19" x2="12" y2="5"></line>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
          </button>
        </footer>
      </div>
    </section>
  );
};

