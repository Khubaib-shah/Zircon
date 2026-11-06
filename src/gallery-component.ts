/**
 * Store Gallery Component (<store-gallery>)
 * Strictly aligned with designskill.md tokens, typography, and hierarchy.
 */

import { getGalleryItems, GalleryItem } from './runway-logic';

export class StoreGalleryElement extends HTMLElement {
  private activeLightboxItem: GalleryItem | null = null;

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  private render() {
    const items = getGalleryItems();

    this.innerHTML = `
      <section class="store-gallery" id="gallery" aria-label="Editorial Store Gallery">
        <div class="gallery__container">
          <header class="gallery__head">
            <span class="gallery__kicker">01 / STORE LOOKS</span>
            <div class="gallery__title-wrap">
              <div>
                <h2 class="gallery__title">Real Photos from Our Studios.</h2>
                <p class="gallery__sub">
                  Three signature streetwear styles shot at our Karachi and Lahore studios. Check out the clean cuts, heavy cotton fabric, and easy sneaker pairings.
                </p>
              </div>
              <span class="gallery__meta">Karachi & Lahore Studios · Drop 2026</span>
            </div>
          </header>

          <div class="gallery__grid">
            ${items
              .map(
                (item) => `
              <article class="gallery-card" data-gallery-id="${item.id}">
                <div class="gallery-card__media" data-open-lightbox="${item.id}" role="button" tabindex="0" aria-label="Open high resolution picture of ${this.escapeHtml(item.title)}">
                  <span class="gallery-card__index-chip">${item.index} / 03</span>
                  <span class="gallery-card__season-chip">${this.escapeHtml(item.season)}</span>
                  <img
                    src="${item.hiresImage}"
                    srcset="${item.image} 640w, ${item.hiresImage} 1080w"
                    sizes="(min-width: 1100px) 440px, (min-width: 750px) 340px, 92vw"
                    alt="${this.escapeHtml(item.title)}"
                    class="gallery-card__img"
                    loading="lazy"
                    decoding="async"
                  />
                  <span class="gallery-card__zoom-hint">
                    View Big Photo ↗
                  </span>
                </div>

                <div class="gallery-card__content">
                  <span class="gallery-card__kicker">${this.escapeHtml(item.tag)}</span>
                  <h3 class="gallery-card__title">${this.escapeHtml(item.title)}</h3>
                  <p class="gallery-card__desc">${this.escapeHtml(item.subtitle)}</p>

                  <div class="gallery-card__pieces" aria-label="Pieces in this look">
                    ${item.featuredPieces
                      .map((p) => `<span class="gallery-card__piece-tag">${this.escapeHtml(p)}</span>`)
                      .join('')}
                  </div>

                  <button
                    type="button"
                    class="gallery-card__btn"
                    data-jump-look="${item.runwayLookIndex}"
                    aria-label="See ${this.escapeHtml(item.title)} on the 3D Runway"
                  >
                    <span>See on 3D Runway</span>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                      <path d="M4 12L12 4M12 4H6M12 4V10" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              </article>
            `
              )
              .join('')}
          </div>
        </div>

        <dialog class="gallery-lightbox" id="gallery-lightbox" aria-label="High-resolution editorial view">
          <div class="gallery-lightbox__wrapper">
            <button type="button" class="gallery-lightbox__close" id="lightbox-close" aria-label="Close high-resolution view">×</button>
            <img src="" alt="" class="gallery-lightbox__img" id="lightbox-img" />
            <div class="gallery-lightbox__caption">
              <h4 class="gallery-lightbox__title" id="lightbox-title"></h4>
              <p class="gallery-lightbox__sub" id="lightbox-sub"></p>
            </div>
          </div>
        </dialog>
      </section>
    `;
  }

  private bindEvents() {
    const lightbox = this.querySelector('#gallery-lightbox') as HTMLDialogElement;
    const lightboxImg = this.querySelector('#lightbox-img') as HTMLImageElement;
    const lightboxTitle = this.querySelector('#lightbox-title') as HTMLElement;
    const lightboxSub = this.querySelector('#lightbox-sub') as HTMLElement;
    const closeBtn = this.querySelector('#lightbox-close') as HTMLButtonElement;

    const openLightbox = (item: GalleryItem) => {
      this.activeLightboxItem = item;
      if (lightbox && lightboxImg && lightboxTitle && lightboxSub) {
        lightboxImg.src = item.hiresImage;
        lightboxImg.alt = item.title;
        lightboxTitle.textContent = `${item.title} — ${item.season}`;
        lightboxSub.textContent = item.subtitle;
        if (typeof lightbox.showModal === 'function') {
          lightbox.showModal();
        } else {
          lightbox.setAttribute('open', '');
        }
      }
    };

    const closeLightbox = () => {
      if (lightbox) {
        if (typeof lightbox.close === 'function') {
          lightbox.close();
        } else {
          lightbox.removeAttribute('open');
        }
      }
      this.activeLightboxItem = null;
    };

    if (closeBtn) {
      closeBtn.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
      });
      lightbox.addEventListener('cancel', () => {
        this.activeLightboxItem = null;
      });
    }

    // Delegated clicks for Jump to Look and Open Lightbox
    this.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;

      // Jump to Runway look
      const jumpBtn = target.closest('[data-jump-look]') as HTMLElement;
      if (jumpBtn) {
        const lookIdx = parseInt(jumpBtn.dataset.jumpLook || '0', 10);
        const runway = document.querySelector('runway-section') as any;
        if (runway) {
          runway.scrollIntoView({ behavior: 'smooth' });
          if (typeof runway.go === 'function') {
            runway.go(lookIdx);
          }
        }
        return;
      }

      // Open Lightbox
      const media = target.closest('[data-open-lightbox]') as HTMLElement;
      if (media) {
        const id = media.dataset.openLightbox;
        const item = getGalleryItems().find((it) => it.id === id);
        if (item) openLightbox(item);
      }
    });

    // Keyboard support on media card (Enter/Space to open lightbox)
    this.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target as HTMLElement;
        const media = target.closest('[data-open-lightbox]') as HTMLElement;
        if (media) {
          e.preventDefault();
          const id = media.dataset.openLightbox;
          const item = getGalleryItems().find((it) => it.id === id);
          if (item) openLightbox(item);
        }
      }
    });
  }

  private escapeHtml(str: string): string {
    return str.replace(/[&<>'"]/g, (tag) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
    }[tag] || tag));
  }
}

if (!customElements.get('store-gallery')) {
  customElements.define('store-gallery', StoreGalleryElement);
}
