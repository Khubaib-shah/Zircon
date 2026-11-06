import React from 'react';

export const ManifestoStrip: React.FC = () => {
  return (
    <section className="manifesto-strip">
      <div className="manifesto-inner">
        <div className="manifesto-kicker">03 / CRAFTSMANSHIP</div>
        <div className="manifesto-content">
          <h2 className="manifesto-title">Premium Streetwear Made to Last.</h2>
          <p className="manifesto-text">
            Designed for everyday wear. Every piece is cut from heavyweight combed cotton with clean stitching that holds its shape wash after wash.
          </p>
          <div className="manifesto-pillars">
            <div className="manifesto-pillar">
              <span className="manifesto-pillar__num">01 / FABRIC</span>
              <span className="manifesto-pillar__title">Heavyweight Cotton</span>
              <span className="manifesto-pillar__desc">
                Dense cotton fleece that stays soft and keeps its structure over time.
              </span>
            </div>
            <div className="manifesto-pillar">
              <span className="manifesto-pillar__num">02 / FIT</span>
              <span className="manifesto-pillar__title">Relaxed Cut</span>
              <span className="manifesto-pillar__desc">
                Tailored with a clean drop-shoulder profile for effortless everyday comfort.
              </span>
            </div>
            <div className="manifesto-pillar">
              <span className="manifesto-pillar__num">03 / QUALITY</span>
              <span className="manifesto-pillar__title">Small Batches</span>
              <span className="manifesto-pillar__desc">
                Produced in limited runs with careful attention to every seam and finish.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

