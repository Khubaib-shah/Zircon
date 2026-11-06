import React from 'react';

export const AboutPage: React.FC = () => {
  return (
    <div className="about-page">
      <div className="about-header">
        <div className="about-kicker">ABOUT ZIRCON</div>
        <h1 className="about-title">Premium Streetwear Made to Last.</h1>
        <p className="about-subtitle">
          Zircon is an independent streetwear studio. We focus on heavyweight fabrics, clean cuts, and durable construction made for everyday wear.
        </p>
      </div>

      <div className="about-grid">
        <div className="about-block">
          <span className="about-block__label">01 / DESIGN</span>
          <h2 className="about-block__heading">Minimal cuts built for daily wear.</h2>
          <p className="about-block__text">
            We keep our designs clean and understated. Every garment is tailored with a relaxed silhouette, solid tones, and reinforced stitching that holds its shape over time.
          </p>
        </div>

        <div className="about-block">
          <span className="about-block__label">02 / PRODUCTION</span>
          <h2 className="about-block__heading">Small batches, carefully finished.</h2>
          <p className="about-block__text">
            Each release is produced in limited runs so we can focus on fabric weight, seam strength, and consistent sizing across every piece.
          </p>
        </div>
      </div>

      <div className="about-block" style={{ marginBottom: '64px' }}>
        <span className="about-block__label">03 / MATERIALS</span>
        <h2 className="about-block__heading">Heavyweight cotton and clean construction.</h2>
        <div className="about-materials-grid">
          <div className="material-card">
            <div className="material-card__num">01 / FLEECE</div>
            <h3 className="material-card__title">480 GSM Cotton Fleece</h3>
            <div className="material-card__spec">100% Combed Cotton</div>
            <p className="material-card__desc">
              Dense loopback fleece with a soft brushed interior for warmth and lasting structure.
            </p>
          </div>

          <div className="material-card">
            <div className="material-card__num">02 / JERSEY</div>
            <h3 className="material-card__title">260 GSM Heavy Jersey</h3>
            <div className="material-card__spec">Pre-Shrunk Cotton</div>
            <p className="material-card__desc">
              Breathable heavyweight jersey washed before cutting to prevent shrinkage.
            </p>
          </div>

          <div className="material-card">
            <div className="material-card__num">03 / DETAILS</div>
            <h3 className="material-card__title">Reinforced Ribbing</h3>
            <div className="material-card__spec">Double-Needle Seams</div>
            <p className="material-card__desc">
              Sturdy ribbed collars and cuffs designed to stay flat and hold their fit wash after wash.
            </p>
          </div>
        </div>
      </div>

      <div className="about-studios-strip">
        <div className="studio-card">
          <span className="studio-city">KARACHI STUDIO</span>
          <h3 className="studio-name">DHA Phase 6</h3>
          <p className="studio-address">
            Shahbaz Commercial, Phase 6<br />
            DHA, Karachi<br />
            Mon – Sat, 11:00 AM – 8:00 PM
          </p>
        </div>

        <div className="studio-card">
          <span className="studio-city">LAHORE STUDIO</span>
          <h3 className="studio-name">Gulberg III</h3>
          <p className="studio-address">
            MM Alam Road, Gulberg III<br />
            Lahore<br />
            Mon – Sat, 12:00 PM – 8:00 PM
          </p>
        </div>
      </div>
    </div>
  );
};

