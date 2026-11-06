import React from 'react';

interface CareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CareModal: React.FC<CareModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="bag-modal-overlay" onClick={onClose}>
      <dialog
        id="care-dialog"
        className="care-dialog"
        open
        onClick={(e) => e.stopPropagation()}
      >
        <div className="care-modal-header">
          <h2 className="care-modal-title">Shipping, Exchanges & Care</h2>
          <button
            type="button"
            className="care-modal-close"
            id="close-care-modal"
            aria-label="Close modal"
            onClick={onClose}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="care-modal-body">
          <div className="care-section">
            <h3 className="care-section-title">01 / Delivery</h3>
            <p className="care-section-text">
              Orders ship nationwide via tracked courier. Delivery takes 1–2 business days in major cities and 2–4 business days elsewhere. Free standard shipping on orders over Rs. 10,000.
            </p>
          </div>

          <div className="care-section">
            <h3 className="care-section-title">02 / 7-Day Exchanges</h3>
            <p className="care-section-text">
              Unworn items with original tags can be exchanged within 7 days of delivery. Contact our support team to arrange a size replacement.
            </p>
          </div>

          <div className="care-section">
            <h3 className="care-section-title">03 / Garment Care</h3>
            <p className="care-section-text">
              Wash cold inside-out on a gentle cycle. Hang dry in shade and iron inside-out on low heat. Do not bleach.
            </p>
          </div>

          <div className="care-section">
            <h3 className="care-section-title">04 / Contact</h3>
            <p className="care-section-text">
              Reach us Monday to Saturday (10 AM – 8 PM PKT) at <strong>support@zircon.pk</strong>.
            </p>
          </div>
        </div>
      </dialog>
    </div>
  );
};

