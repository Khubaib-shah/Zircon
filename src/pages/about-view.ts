/**
 * Dedicated About / Atelier Page Component (<about-page>)
 * Detailed brand manifesto, textile specifications, sustainability commitments,
 * and showroom locations. Conforms strictly to designskill.md.
 */

export class AboutPageElement extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  private render() {
    this.className = 'about-page';
    this.innerHTML = `
      <div class="about-header">
        <div class="about-kicker">OUR STORY & STUDIOS</div>
        <h1 class="about-title">Simple, Clean, and Made to Last</h1>
        <p class="about-subtitle">
          Try the Look is an independent premium streetwear brand from Pakistan. We make comfortable, clean-cut clothes from high-quality heavy cotton, designed for everyday wear in Karachi, Lahore, and across Pakistan.
        </p>
      </div>

      <div class="about-grid">
        <div class="about-block">
          <span class="about-block__label">01 / WHY WE BUILD</span>
          <h2 class="about-block__heading">No loud logos. Just great fit and real quality.</h2>
          <p class="about-block__text">
            We don't make cheap clothes that lose shape after two washes. We focus on relaxed cuts, clean solid colors, and strong stitching that stays sharp every time you step out.
          </p>
          <p class="about-block__text">
            Whether you are hanging out with friends, traveling, or working in the studio, our streetwear feels soft, looks clean, and keeps you comfortable all day.
          </p>
        </div>

        <div class="about-block">
          <span class="about-block__label">02 / LIMITED BATCHES</span>
          <h2 class="about-block__heading">Small drops. No extra stock wasted.</h2>
          <p class="about-block__text">
            Instead of making thousands of cheap pieces like fast-fashion stores, we produce limited small batches of only 250 pieces per style. 
          </p>
          <p class="about-block__text">
            Every garment is carefully checked by our master tailors before it is packed. When a colorway sells out, it is gone for the season.
          </p>
        </div>
      </div>

      <div class="about-block" style="margin-bottom: 64px;">
        <span class="about-block__label">03 / OUR MATERIALS</span>
        <h2 class="about-block__heading">Pure heavyweight cotton and sturdy stitching.</h2>
        <div class="about-materials-grid">
          <div class="material-card">
            <div class="material-card__num">SPEC // 01</div>
            <h3 class="material-card__title">480 GSM Heavy Cotton Fleece</h3>
            <div class="material-card__spec">Knitted in Faisalabad & Lahore</div>
            <p class="material-card__desc">
              Custom-knit from 100% combed cotton. Extra heavy, soft on the inside, and warm enough for chilly evenings without feeling stiff.
            </p>
          </div>

          <div class="material-card">
            <div class="material-card__num">SPEC // 02</div>
            <h3 class="material-card__title">260 GSM Structured Jersey</h3>
            <div class="material-card__spec">Karachi Studio Cut</div>
            <p class="material-card__desc">
              Thick, durable t-shirt fabric that never clings or goes see-through. Washed before stitching so it does not shrink in the laundry.
            </p>
          </div>

          <div class="material-card">
            <div class="material-card__num">SPEC // 03</div>
            <h3 class="material-card__title">Reinforced Seams & Ribbing</h3>
            <div class="material-card__spec">Tailored in Karachi</div>
            <p class="material-card__desc">
              Double-needle flatlock seams and thick ribbed collars that stay crisp around your neck after dozens of washes.
            </p>
          </div>
        </div>
      </div>

      <div class="about-studios-strip">
        <div class="studio-card">
          <span class="studio-city">KARACHI STUDIO</span>
          <h3 class="studio-name">DHA Phase 6 Design Studio</h3>
          <p class="studio-address">
            Plot 14-C, Shahbaz Commercial, Phase 6<br />
            DHA, Karachi 75500, Pakistan<br />
            Mon – Sat, 11:00 AM – 9:00 PM PKT
          </p>
          <span class="studio-hours">Walk-ins and private styling by appointment</span>
        </div>

        <div class="studio-card">
          <span class="studio-city">LAHORE ATELIER</span>
          <h3 class="studio-name">Gulberg III Cutting Room</h3>
          <p class="studio-address">
            Building 28, MM Alam Road, Gulberg III<br />
            Lahore 54000, Pakistan<br />
            Mon – Sat, 12:00 PM – 9:30 PM PKT
          </p>
          <span class="studio-hours">Studio showroom and sample fittings</span>
        </div>
      </div>
    `;
  }
}

if (!customElements.get('about-page')) {
  customElements.define('about-page', AboutPageElement);
}
