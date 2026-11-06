/**
 * Dedicated Lookbook Page Component (<lookbook-page>)
 * Displays curated seasonal campaigns, piece-by-piece styling breakdowns,
 * high-resolution lookbook zoom, and one-click ensemble styling.
 */

import { shoppingBag } from '../shopping-bag';
import { formatPkr } from '../runway-logic';

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
    summary: 'A clean all-black streetwear outfit for city evenings. Combines the Air Jordan 12 Retro sneakers with our heavyweight drop-shoulder t-shirt and soft brushed loopback fleece sweatshirt.',
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
    summary: 'Relaxed fit with clean contrast. The white Tatum 5 Orbit sneakers give crisp pop against our deep black hoodie and breathable summer cotton tee.',
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
    season: 'Capsule 04',
    title: 'Studio Day',
    summary: 'Comfortable everyday wear made for long work days in the studio. Heavyweight 480 GSM cotton fleece paired with clean athletic footwear.',
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
    season: 'Street Archive',
    title: 'Mountain Transit',
    summary: 'Cozy and warm for cold travels. An oversized warm hoodie balanced with lightweight Luka 5 sneakers for smooth daily movement.',
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

export class LookbookPageElement extends HTMLElement {
  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  private render() {
    this.className = 'lookbook-page';
    this.innerHTML = `
      <div class="lookbook-header">
        <div class="lookbook-kicker">EDITORIAL LOOKBOOK</div>
        <h1 class="lookbook-title">Campaign Archive</h1>
        <p class="lookbook-desc">
          Four styled streetwear outfits photographed in real natural light. See each piece, check the prices in Pakistani Rupees, and add the full look directly to your bag.
        </p>
      </div>

      <div class="lookbook-campaigns">
        ${CAMPAIGN_LOOKS.map(
          (c) => `
          <article class="campaign-row" data-campaign-id="${c.id}">
            <div class="campaign-media" data-hires="${c.hiresImage}" data-title="${c.title}" data-season="${c.season}">
              <span class="campaign-badge">${c.season}</span>
              <img src="${c.image}" alt="${c.title}" loading="lazy" decoding="async" />
              <div class="campaign-inspect-hint">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                <span>Inspect Silhouette</span>
              </div>
            </div>

            <div class="campaign-info">
              <span class="campaign-index">${c.index} / 04</span>
              <h2 class="campaign-name">${c.title}</h2>
              <span class="campaign-season">${c.season}</span>
              <p class="campaign-summary">${c.summary}</p>

              <div class="campaign-pieces-list">
                <span class="campaign-pieces-heading">Styled Garments:</span>
                ${c.pieces
                  .map(
                    (p) => `
                  <div class="campaign-piece-item">
                    <span>${p.name} (Size ${p.size})</span>
                    <span>${formatPkr(p.price)}</span>
                  </div>
                `
                  )
                  .join('')}
              </div>

              <div class="campaign-actions">
                <button type="button" class="campaign-btn-primary" data-action="add-look" data-campaign-id="${c.id}">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 8h16l1 16H3L4 8zM8 8V6a4 4 0 0 1 8 0v2"/></svg>
                  <span>Add Look to Bag</span>
                </button>
                <button type="button" class="campaign-btn-secondary" data-action="view-runway" data-runway-index="${c.runwayLookIndex}">
                  <span>View in 3D ↗</span>
                </button>
              </div>
            </div>
          </article>
        `
        ).join('')}
      </div>
    `;
  }

  private bindEvents() {
    this.addEventListener('click', async (e) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Click media to open lightbox
      const media = target.closest('.campaign-media') as HTMLElement | null;
      if (media) {
        const hires = media.dataset.hires;
        const title = media.dataset.title;
        const season = media.dataset.season;
        if (hires) {
          this.openInspectModal(hires, title || '', season || '');
        }
        return;
      }

      // Add full look to bag
      const addBtn = target.closest('[data-action="add-look"]') as HTMLElement | null;
      if (addBtn) {
        const campaignId = addBtn.dataset.campaignId;
        const campaign = CAMPAIGN_LOOKS.find((c) => c.id === campaignId);
        if (campaign) {
          const originalText = addBtn.innerHTML;
          addBtn.innerHTML = `<span>Saving look...</span>`;
          try {
            await shoppingBag.add(
              campaign.pieces.map((p) => ({
                id: p.variantId,
                quantity: 1,
              }))
            );
            addBtn.innerHTML = `<span>Look in Bag ✓</span>`;
            setTimeout(() => {
              addBtn.innerHTML = originalText;
            }, 2000);
          } catch (err: any) {
            shoppingBag.notify(err.message || 'Error adding look');
            addBtn.innerHTML = originalText;
          }
        }
        return;
      }

      // View in 3D Runway
      const runwayBtn = target.closest('[data-action="view-runway"]') as HTMLElement | null;
      if (runwayBtn) {
        const lookIdx = parseInt(runwayBtn.dataset.runwayIndex || '0', 10);
        window.location.hash = 'home';
        setTimeout(() => {
          const runway = document.querySelector('runway-section') as any;
          if (runway && typeof runway.go === 'function') {
            runway.go(lookIdx);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
        return;
      }
    });
  }

  private openInspectModal(hires: string, title: string, season: string) {
    let dialog = document.getElementById('lookbook-inspect-dialog') as HTMLDialogElement | null;
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.id = 'lookbook-inspect-dialog';
      dialog.className = 'gallery-lightbox';
      document.body.appendChild(dialog);
    }

    dialog.innerHTML = `
      <div class="gallery-lightbox__inner">
        <button type="button" class="gallery-lightbox__close" id="close-inspect" aria-label="Close dialog">×</button>
        <div class="gallery-lightbox__content">
          <img src="${hires}" alt="${title}" class="gallery-lightbox__img" />
          <div class="gallery-lightbox__info">
            <span class="gallery-lightbox__season">${season}</span>
            <h3 class="gallery-lightbox__title">${title}</h3>
            <p class="gallery-lightbox__desc">Captured in architectural ambient lighting. High-contrast silhouette study with zero retouched geometry.</p>
          </div>
        </div>
      </div>
    `;

    dialog.querySelector('#close-inspect')?.addEventListener('click', () => {
      dialog?.close();
    });

    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });

    dialog.showModal();
  }
}

if (!customElements.get('lookbook-page')) {
  customElements.define('lookbook-page', LookbookPageElement);
}
