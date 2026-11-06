import React, { useEffect, useRef } from 'react';
import { useCart } from '../../context/CartContext';
import { RUNWAY_INNER_HTML } from './runwayTemplate';
import './runway-element';

interface RunwaySectionProps {
  onJumpToLook?: (lookIndex: number) => void;
  onExploreCatalog?: () => void;
}

export const RunwaySection: React.FC<RunwaySectionProps> = () => {
  const { addItem, showNotification } = useCart();
  const hostRef = useRef<HTMLDivElement>(null);

  // Wire React Cart to window.RunwayBag so native runway element calls trigger CartContext
  useEffect(() => {
    (window as any).RunwayBag = {
      add: async (items: { id: number; quantity?: number }[]) => {
        items.forEach((item) => {
          addItem(item.id, item.quantity || 1);
        });
        showNotification(
          items.length > 1
            ? `Full look added to styling bag (${items.length} pieces)`
            : 'Added to styling bag'
        );
      },
    };
  }, [addItem, showNotification]);

  // Insert original runway markup and initialize element
  useEffect(() => {
    if (!hostRef.current) return;
    const container = hostRef.current;
    
    // Check if customElement already populated
    let el = container.querySelector('runway-section') as HTMLElement | null;
    if (!el) {
      el = document.createElement('runway-section') as HTMLElement;
      el.id = 'Runway-template--28035983671601__the_runway_wdM8BG';
      el.className = 'rw rw--add-icon rw--popup rw--list has-dividers has-border';
      el.setAttribute('data-feel', 'balanced');
      el.setAttribute('data-blur', 'true');
      el.setAttribute('data-mblur', 'true');
      el.setAttribute('data-style', 'ring');
      el.setAttribute('data-mstyle', 'classic');
      el.setAttribute('data-fit', 'true');
      el.setAttribute('data-height-mode', 'original');
      el.setAttribute('data-height-vh', '100');
      el.setAttribute('data-mheight-mode', 'custom');
      el.setAttribute('data-mheight-vh', '109');
      el.setAttribute('data-reflect', 'false');
      el.setAttribute('data-autoplay', 'true');
      el.setAttribute('data-speed', '5000');
      el.setAttribute('data-after-add', 'stay');
      el.setAttribute('data-bundle-code', '');
      el.setAttribute('data-msg-choose', 'Pick a size for: [items]');
      el.setAttribute('data-msg-error', 'Couldn’t add to bag. Please try again.');
      el.setAttribute('data-msg-soldout', 'Sold out');
      
      el.style.cssText = `
        --rw-c-stage: #ffffff;
        --rw-c-panel: #ffffff;
        --rw-c-text: #151413;
        --rw-c-muted: #66625c;
        --rw-c-accent: #0e0e0e;
        --rw-c-on-accent: #ffffff;
        --rw-c-line: #c8c8c8;
        --rw-card: #DFDFDF;
        --rw-hf: var(--font-heading--family, inherit);
        --rw-hw: 400;
        --rw-h-d: 46px; --rw-h-m: 24px;
        --rw-sub-d: 12px; --rw-sub-m: 12px;
        --rw-eyebrow-d: 11px; --rw-eyebrow-m: 10px;
        --rw-label-d: 10px; --rw-label-m: 9px;
        --rw-chip-d: 17px; --rw-chip-m: 18px;
        --rw-ph-d: 18px; --rw-ph-m: 16px;
        --rw-pt-size-d: 13px; --rw-pt-size-m: 12px;
        --rw-price-d: 12px; --rw-price-m: 12px;
        --rw-opt-d: 11px; --rw-opt-m: 11px;
        --rw-total-d: 16px; --rw-total-m: 16px;
        --rw-thumb-d: 92px; --rw-thumb-m: 62px;
        --rw-tag-top: 18px; --rw-tag-left: 0px;
        --rw-thumb-radius: 0px;
        --rw-morph: 900ms; --rw-bar-r: 20px;
        --rw-panel-w: 380px;
        --rw-panel-pad-d: 32px;
        --rw-radius: 0px;
        --rw-max: none;
        --rw-speed: 5s;
        --rw-ax: 40%;
        --rw-btn-radius: 0px; --rw-pill-radius: 30px; --rw-add-radius: 20px;
      `;

      el.innerHTML = RUNWAY_INNER_HTML;
      container.appendChild(el);
    }
  }, []);

  return (
    <div
      ref={hostRef}
      className="runway-host-wrapper relative w-full overflow-hidden bg-white text-[#151413]"
    />
  );
};
