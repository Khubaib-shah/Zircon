import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatPkr } from '../utils/runwayLogic';

interface CampaignLook {
  id: string;
  index: string;
  season: string;
  title: string;
  summary: string;
  image: string;
  hiresImage: string;
  runwayLookIndex: number;
  pieces: Array<{
    name: string;
    variantId: number;
    price: number;
    size: string;
  }>;
}

const CAMPAIGN_LOOKS: CampaignLook[] = [
  {
    id: 'campaign-01',
    index: '01',
    season: 'Autumn / Winter 2026',
    title: 'The City Edit',
    summary: 'All-black streetwear for everyday wear. Pairs the Air Jordan 12 Retro with our heavyweight tee and brushed fleece sweatshirt.',
    image: 'https://reel-ref-try-the-look.vercel.app/assets/model-1-640.webp',
    hiresImage: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-1.webp',
    runwayLookIndex: 0,
    pieces: [
      { name: 'Air Jordan 12 Retro', variantId: 57015167090993, price: 24500, size: '42' },
      { name: 'Tshirt', variantId: 56835911647537, price: 6500, size: 'M' },
      { name: 'Sweatshirt', variantId: 56835806462257, price: 14500, size: 'M' },
    ],
  },
  {
    id: 'campaign-02',
    index: '02',
    season: 'Spring / Summer 2026',
    title: 'Gallery Opening',
    summary: 'Relaxed fit with clean contrast. Tatum 5 Orbit sneakers paired with our black hoodie and combed cotton tee.',
    image: 'https://reel-ref-try-the-look.vercel.app/assets/model-5-640.webp',
    hiresImage: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-5.webp',
    runwayLookIndex: 1,
    pieces: [
      { name: 'Tatum 5 Orbit', variantId: 57015166796081, price: 24500, size: '42' },
      { name: 'Hoodie Black', variantId: 56836251746609, price: 16500, size: 'M' },
      { name: 'Tshirt', variantId: 56835911647537, price: 6500, size: 'M' },
    ],
  },
  {
    id: 'campaign-03',
    index: '03',
    season: '2026 Release',
    title: 'Studio Day',
    summary: 'Built for everyday comfort in the studio. Heavyweight 480 GSM cotton fleece paired with classic court footwear.',
    image: 'https://reel-ref-try-the-look.vercel.app/assets/model-6-640.webp',
    hiresImage: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-6.webp',
    runwayLookIndex: 3,
    pieces: [
      { name: 'Hoodie Black', variantId: 56836251746609, price: 16500, size: 'M' },
      { name: 'Air Jordan 12 Retro', variantId: 57015167090993, price: 24500, size: '42' },
      { name: 'Tshirt', variantId: 56835911647537, price: 6500, size: 'M' },
    ],
  },
  {
    id: 'campaign-04',
    index: '04',
    season: '2026 Release',
    title: 'Weekend Transit',
    summary: 'Warm layers for cooler days. Relaxed fleece hoodie balanced with Luka 5 sneakers.',
    image: 'https://reel-ref-try-the-look.vercel.app/assets/model-2-640.webp',
    hiresImage: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-2.webp',
    runwayLookIndex: 5,
    pieces: [
      { name: 'Hoodie', variantId: 56836002251057, price: 16500, size: 'M' },
      { name: 'Luka 5', variantId: 57015176429873, price: 24500, size: '42' },
      { name: 'Tshirt', variantId: 56835911647537, price: 6500, size: 'M' },
    ],
  },
];

interface LookbookPageProps {
  onJumpToRunway?: (lookIndex: number) => void;
}

export const LookbookPage: React.FC<LookbookPageProps> = ({ onJumpToRunway }) => {
  const { addItems } = useCart();
  const [inspectModal, setInspectModal] = useState<CampaignLook | null>(null);
  const [addedLooks, setAddedLooks] = useState<Record<string, boolean>>({});

  const handleAddLook = (c: CampaignLook) => {
    addItems(c.pieces.map((p) => ({ id: p.variantId, quantity: 1 })));
    setAddedLooks((prev) => ({ ...prev, [c.id]: true }));
    setTimeout(() => {
      setAddedLooks((prev) => ({ ...prev, [c.id]: false }));
    }, 2000);
  };

  return (
    <div className="lookbook-page">
      <div className="lookbook-header">
        <div className="lookbook-kicker">LOOKBOOK</div>
        <h1 className="lookbook-title">Photos from Our Studio</h1>
        <p className="lookbook-desc">
          Four complete outfits from our latest collection. Explore the pieces in each look and add them to your bag.
        </p>
      </div>

      <div className="lookbook-campaigns">
        {CAMPAIGN_LOOKS.map((c) => {
          const isAdded = addedLooks[c.id];

          return (
            <article className="campaign-row" key={c.id} data-campaign-id={c.id}>
              <div
                className="campaign-media"
                role="button"
                tabIndex={0}
                onClick={() => setInspectModal(c)}
              >
                <span className="campaign-badge">{c.season}</span>
                <img src={c.image} alt={c.title} loading="lazy" decoding="async" />
                <div className="campaign-inspect-hint">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                  <span>View Photo</span>
                </div>
              </div>

              <div className="campaign-info">
                <span className="campaign-index">{c.index} / 04</span>
                <h2 className="campaign-name">{c.title}</h2>
                <span className="campaign-season">{c.season}</span>
                <p className="campaign-summary">{c.summary}</p>

                <div className="campaign-pieces-list">
                  <span className="campaign-pieces-heading">Pieces in this look</span>
                  {c.pieces.map((p) => (
                    <div className="campaign-piece-item" key={p.name}>
                      <span>{p.name} (Size {p.size})</span>
                      <span>{formatPkr(p.price)}</span>
                    </div>
                  ))}
                </div>

                <div className="campaign-actions">
                  <button
                    type="button"
                    className="campaign-btn-primary"
                    onClick={() => handleAddLook(c)}
                  >
                    {isAdded ? (
                      <>
                        <span>Added to Bag</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                          <path d="M4 8h16l1 16H3L4 8zM8 8V6a4 4 0 0 1 8 0v2" />
                        </svg>
                        <span>Add Look to Bag</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="campaign-btn-secondary"
                    onClick={() => onJumpToRunway && onJumpToRunway(c.runwayLookIndex)}
                  >
                    <span>View Look</span>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px' }}>
                      <path d="M4 12L12 4M12 4H6M12 4V10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {inspectModal && (
        <div className="bag-modal-overlay" onClick={() => setInspectModal(null)}>
          <dialog className="gallery-lightbox" open onClick={(e) => e.stopPropagation()}>
            <div className="gallery-lightbox__inner">
              <button
                type="button"
                className="gallery-lightbox__close"
                id="close-inspect"
                aria-label="Close photo"
                onClick={() => setInspectModal(null)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <div className="gallery-lightbox__content">
                <img src={inspectModal.hiresImage} alt={inspectModal.title} className="gallery-lightbox__img" />
                <div className="gallery-lightbox__info">
                  <span className="gallery-lightbox__season">{inspectModal.season}</span>
                  <h3 className="gallery-lightbox__title">{inspectModal.title}</h3>
                  <p className="gallery-lightbox__desc">{inspectModal.summary}</p>
                </div>
              </div>
            </div>
          </dialog>
        </div>
      )}
    </div>
  );
};

