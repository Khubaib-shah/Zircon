import React from 'react';
import { useCart } from '../../context/CartContext';
import { formatPkr, BagEntry } from '../../utils/runwayLogic';

interface BagDrawerProps {
  onCheckout: () => void;
  onExplore: () => void;
}

export const BagDrawer: React.FC<BagDrawerProps> = ({ onCheckout, onExplore }) => {
  const {
    isBagOpen,
    closeBag,
    entries,
    totals,
    findProduct,
    removeItem,
    stepQuantity,
    clearBag,
    exportShortlist,
  } = useCart();

  if (!isBagOpen) return null;

  return (
    <div className="bag-modal-overlay" onClick={closeBag}>
      <dialog
        id="bag-dialog"
        open
        onClick={(e) => e.stopPropagation()}
        aria-labelledby="bag-heading-title"
      >
        <div className="bag-header">
          <div className="bag-heading">
            <div className="bag-heading-left">
              <h2 id="bag-heading-title">Your Bag</h2>
              <span className="bag-count-chip" id="bag-count-chip">
                {totals.totalQuantity} {totals.totalQuantity === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              id="close-bag"
              aria-label="Close bag"
              type="button"
              onClick={closeBag}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <p className="bag-note">Free standard delivery on orders over Rs. 10,000.</p>
        </div>

        <div id="bag-items">
          {entries.length === 0 ? (
            <div className="bag-empty">
              <svg
                className="bag-empty__icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                aria-hidden="true"
              >
                <path d="M4 8h16l1 16H3L4 8zM8 8V6a4 4 0 0 1 8 0v2"></path>
              </svg>
              <h3 className="bag-empty__title">Your bag is empty</h3>
              <p className="bag-empty__desc">Explore our collection of essentials and footwear.</p>
              <button
                type="button"
                className="bag-empty__btn"
                id="bag-explore-btn"
                onClick={() => {
                  closeBag();
                  onExplore();
                }}
              >
                <span>View Collection</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          ) : (
            entries.map((entry: BagEntry) => {
              const match = findProduct(entry.id);
              if (!match) return null;
              const { product, variant } = match;
              const lineTotal = product.price * entry.quantity;

              return (
                <div className="bag-row" key={entry.id} data-variant-id={entry.id}>
                  <div className="bag-row__thumb">
                    <img src={product.image} alt={product.name} loading="lazy" decoding="async" />
                  </div>

                  <div className="bag-row__details">
                    <span className="bag-row__vendor">{product.type || 'Piece'}</span>
                    <h3 className="bag-row__title">{product.name}</h3>
                    <div className="bag-row__meta">
                      <span className="bag-row__size">Size {variant.o.join(' / ')}</span>
                      <span className="bag-row__unit-price">{formatPkr(product.price)} each</span>
                    </div>
                    <a
                      className="bag-row__link"
                      href="#shop"
                      onClick={(e) => {
                        e.preventDefault();
                        closeBag();
                        onExplore();
                      }}
                    >
                      <span>View in collection</span>
                      <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '2px' }}>
                        <path d="M4 12L12 4M12 4H6M12 4V10" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </div>

                  <div className="bag-row__actions">
                    <div className="bag-row__top-actions">
                      <span className="bag-row__line-total">{formatPkr(lineTotal)}</span>
                      <button
                        type="button"
                        className="bag-row__remove-btn"
                        aria-label={`Remove ${product.name}`}
                        onClick={() => removeItem(entry.id)}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>

                    <div className="bag-stepper">
                      <button
                        type="button"
                        className="bag-stepper__btn"
                        aria-label="Decrease quantity"
                        onClick={() => stepQuantity(entry.id, -1)}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      </button>
                      <span className="bag-stepper__qty">{entry.quantity}</span>
                      <button
                        type="button"
                        className="bag-stepper__btn"
                        aria-label="Increase quantity"
                        disabled={entry.quantity >= 20}
                        onClick={() => stepQuantity(entry.id, 1)}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="bag-footer">
          {entries.length > 0 && (
            <div id="bag-total">
              <div className="bag-summary">
                <div className="bag-summary__left">
                  <span className="bag-summary__count">
                    {totals.totalQuantity} {totals.totalQuantity === 1 ? 'item' : 'items'} in bag
                  </span>
                  <button type="button" className="bag-summary__clear" onClick={clearBag}>
                    Clear bag
                  </button>
                </div>
                <div className="bag-summary__right">
                  <span className="bag-summary__label">Subtotal</span>
                  <span className="bag-summary__amount">{totals.formattedSubtotal}</span>
                </div>
              </div>
            </div>
          )}

          <div className="bag-actions-group">
            <button
              type="button"
              id="checkout-bag-btn"
              disabled={entries.length === 0}
              onClick={() => {
                closeBag();
                onCheckout();
              }}
            >
              <span>Checkout</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '6px' }}>
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            <button
              type="button"
              id="export-bag"
              disabled={entries.length === 0}
              onClick={exportShortlist}
            >
              Save outfit list
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

