import React, { useState } from 'react';
import { getGalleryItems, GalleryItem } from '../../utils/runwayLogic';

interface StudioGalleryProps {
  onJumpToLook?: (lookIndex: number) => void;
}

export const StudioGallery: React.FC<StudioGalleryProps> = ({ onJumpToLook }) => {
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const items = getGalleryItems();

  return (
    <section className="store-gallery" id="gallery" aria-label="Studio Gallery">
      <div className="gallery__container">
        <header className="gallery__head">
          <span className="gallery__kicker">01 / STUDIO</span>
          <div className="gallery__title-wrap">
            <div>
              <h2 className="gallery__title">Photos from Our Studio.</h2>
              <p className="gallery__sub">
                Everyday streetwear shot in our studio. Clean cuts, heavyweight cotton, and easy pairings.
              </p>
            </div>
            <span className="gallery__meta">2026 Collection</span>
          </div>
        </header>

        <div className="gallery__grid">
          {items.map((item) => (
            <article className="gallery-card" key={item.id} data-gallery-id={item.id}>
              <div
                className="gallery-card__media"
                role="button"
                tabIndex={0}
                aria-label={`View photo of ${item.title}`}
                onClick={() => setActiveItem(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveItem(item);
                  }
                }}
              >
                <span className="gallery-card__index-chip">{item.index} / 03</span>
                <span className="gallery-card__season-chip">{item.season}</span>
                <img
                  src={item.hiresImage}
                  srcSet={`${item.image} 640w, ${item.hiresImage} 1080w`}
                  sizes="(min-width: 1100px) 440px, (min-width: 750px) 340px, 92vw"
                  alt={item.title}
                  className="gallery-card__img"
                  loading="lazy"
                  decoding="async"
                />
                <span className="gallery-card__zoom-hint">
                  <span>View Photo</span>
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    aria-hidden="true"
                    style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '3px' }}
                  >
                    <path d="M4 12L12 4M12 4H6M12 4V10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>

              <div className="gallery-card__content">
                <span className="gallery-card__kicker">{item.tag}</span>
                <h3 className="gallery-card__title">{item.title}</h3>
                <p className="gallery-card__desc">{item.subtitle}</p>

                <div className="gallery-card__pieces" aria-label="Pieces in this look">
                  {item.featuredPieces.map((p) => (
                    <span className="gallery-card__piece-tag" key={p}>
                      {p}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  className="gallery-card__btn"
                  onClick={() => onJumpToLook && onJumpToLook(item.runwayLookIndex)}
                  aria-label={`View ${item.title}`}
                >
                  <span>View Look</span>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M4 12L12 4M12 4H6M12 4V10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {activeItem && (
        <div className="bag-modal-overlay" onClick={() => setActiveItem(null)}>
          <dialog
            className="gallery-lightbox"
            open
            aria-label="Studio photo view"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="gallery-lightbox__wrapper">
              <button
                type="button"
                className="gallery-lightbox__close"
                id="lightbox-close"
                aria-label="Close photo"
                onClick={() => setActiveItem(null)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <img
                src={activeItem.hiresImage}
                alt={activeItem.title}
                className="gallery-lightbox__img"
              />
              <div className="gallery-lightbox__caption">
                <h4 className="gallery-lightbox__title">
                  {activeItem.title} — {activeItem.season}
                </h4>
                <p className="gallery-lightbox__sub">{activeItem.subtitle}</p>
              </div>
            </div>
          </dialog>
        </div>
      )}
    </section>
  );
};

