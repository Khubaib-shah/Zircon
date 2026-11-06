/**
 * Luxury Brand Footer Component (<store-footer>)
 * Architectural 4-column brand footer with newsletter VIP subscription,
 * collections directory, customer care modal shortcuts, and studio provenance.
 */

import { shoppingBag } from '../shopping-bag';
import { isValidEmail } from '../runway-logic';

export class StoreFooterElement extends HTMLElement {
  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  private render() {
    this.className = 'store-footer';
    this.innerHTML = `
      <div class="footer-inner">
        <!-- Col 1: Brand & VIP Newsletter -->
        <div class="footer-col">
          <div class="footer-brand">TRY THE LOOK — RUNWAY</div>
          <p class="footer-tagline">
            Independent Pakistani luxury streetwear studio. Heavyweight pure cotton, clean cuts, and pieces made to last. Designed and crafted in Karachi and Lahore.
          </p>
          <form class="footer-newsletter-form" id="newsletter-form" novalidate>
            <input
              type="email"
              id="newsletter-email"
              class="footer-newsletter-input"
              placeholder="Enter email for private drops & VIP access"
              required
            />
            <button type="submit" class="footer-newsletter-btn">Join VIP</button>
          </form>
        </div>

        <!-- Col 2: Collections & Campaigns -->
        <div class="footer-col">
          <span class="footer-col-title">COLLECTIONS</span>
          <ul class="footer-links">
            <li><a href="#home">3D Runway Stage</a></li>
            <li><a href="#shop">Complete Shop & Archive</a></li>
            <li><a href="#lookbook">Streetwear Lookbook</a></li>
            <li><a href="#lookbook">Karachi & Lahore Studios</a></li>
          </ul>
        </div>

        <!-- Col 3: Customer Care & Policy Modals -->
        <div class="footer-col">
          <span class="footer-col-title">CUSTOMER CARE</span>
          <ul class="footer-links">
            <li><button type="button" id="footer-size-guide-btn">Size & Measurement Guide</button></li>
            <li><button type="button" id="footer-care-btn">Delivery Across Pakistan</button></li>
            <li><button type="button" id="footer-returns-btn">7-Day Easy Size Exchanges</button></li>
            <li><a href="#about">Studio Showrooms & Ateliers</a></li>
          </ul>
        </div>

        <!-- Col 4: Atelier Provenance & Currency -->
        <div class="footer-col">
          <span class="footer-col-title">PAKISTAN STUDIOS</span>
          <ul class="footer-links">
            <li><a href="#about">DHA Phase 6, Karachi</a></li>
            <li><a href="#about">Gulberg III, Lahore</a></li>
            <li><a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer">WhatsApp: +92 300 1234567</a></li>
            <li><a href="mailto:support@trythelook.pk">support@trythelook.pk</a></li>
          </ul>
          <div style="margin-top: 12px; display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #66625c;">Currency:</span>
            <select class="currency-select" id="currency-select">
              <option value="PKR" selected>PKR (Rs.)</option>
              <option value="USD">USD ($)</option>
              <option value="AED">AED (د.إ)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div>© 2026 TRY THE LOOK STUDIO. ALL RIGHTS RESERVED. NATIONWIDE COURIER DELIVERY (TCS & TRAX).</div>
        <div style="display: flex; gap: 20px;">
          <a href="#about" style="color: inherit; text-decoration: none;">Privacy Policy</a>
          <a href="#about" style="color: inherit; text-decoration: none;">Terms of Service</a>
          <a href="#about" style="color: inherit; text-decoration: none;">Ateliers & Sourcing</a>
        </div>
      </div>
    `;
  }

  private bindEvents() {
    // Newsletter Submit
    const form = this.querySelector('#newsletter-form') as HTMLFormElement | null;
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = this.querySelector('#newsletter-email') as HTMLInputElement | null;
        const email = input?.value.trim() || '';
        if (isValidEmail(email)) {
          shoppingBag.notify(`VIP salon access confirmed for ${email}`);
          if (input) input.value = '';
        } else {
          shoppingBag.notify('Please provide a valid email address.');
        }
      });
    }

    // Modal Triggers
    this.querySelector('#footer-size-guide-btn')?.addEventListener('click', () => {
      const modal = document.querySelector('size-guide-modal') as any;
      if (modal && typeof modal.open === 'function') modal.open();
    });

    const openCareModal = () => {
      const modal = document.querySelector('care-modal') as any;
      if (modal && typeof modal.open === 'function') modal.open();
    };

    this.querySelector('#footer-care-btn')?.addEventListener('click', openCareModal);
    this.querySelector('#footer-returns-btn')?.addEventListener('click', openCareModal);

    // Currency Switcher
    this.querySelector('#currency-select')?.addEventListener('change', (e: any) => {
      shoppingBag.notify(`Display currency switched to ${e.target.value}`);
    });
  }
}

if (!customElements.get('store-footer')) {
  customElements.define('store-footer', StoreFooterElement);
}
