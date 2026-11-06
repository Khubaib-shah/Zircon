/**
 * Brand Manifesto Strip Component (<manifesto-strip>)
 * Editorial brand statement anchoring the transition from the 3D runway
 * to the campaign gallery and product archive.
 */

export class ManifestoStripElement extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  private render() {
    this.className = 'manifesto-strip';
    this.innerHTML = `
      <div class="manifesto-inner">
        <div class="manifesto-kicker">03 / OUR QUALITY PROMISE</div>
        <div class="manifesto-content">
          <h2 class="manifesto-title">Made in Pakistan. Premium Streetwear Made to Last.</h2>
          <p class="manifesto-text">
            We design modern streetwear for everyday life in Pakistan. Every hoodie, shirt, and sweatshirt is made from 100% thick combed cotton with clean stitching in Karachi and Lahore. Built to stay fresh, wash after wash.
          </p>
          <div class="manifesto-pillars">
            <div class="manifesto-pillar">
              <span class="manifesto-pillar__num">01 / HEAVY COTTON</span>
              <span class="manifesto-pillar__title">Thick & Soft Fabric</span>
              <span class="manifesto-pillar__desc">Heavyweight cotton fleece that feels soft and keeps its shape for years.</span>
            </div>
            <div class="manifesto-pillar">
              <span class="manifesto-pillar__num">02 / RELAXED FIT</span>
              <span class="manifesto-pillar__title">Modern Comfort</span>
              <span class="manifesto-pillar__desc">Cut with a relaxed fit so you look stylish and stay comfortable all day.</span>
            </div>
            <div class="manifesto-pillar">
              <span class="manifesto-pillar__num">03 / LOCAL ATELIER</span>
              <span class="manifesto-pillar__title">Made in Karachi & Lahore</span>
              <span class="manifesto-pillar__desc">Crafted in small limited batches so you always wear something unique.</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

if (!customElements.get('manifesto-strip')) {
  customElements.define('manifesto-strip', ManifestoStripElement);
}
