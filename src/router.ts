/**
 * Client-Side Router for Runway Storefront
 * Manages view switching between Home, Shop, Lookbook, About, and Checkout.
 * Conforms to designskill.md and keeps state intact.
 */

export type AppRoute = 'home' | 'shop' | 'lookbook' | 'about' | 'checkout';

export class AppRouter {
  private currentRoute: AppRoute = 'home';
  private listeners: Array<(route: AppRoute) => void> = [];

  constructor() {
    window.addEventListener('hashchange', () => this.handleHashChange());
  }

  public init() {
    this.handleHashChange();
    this.bindNavLinks();
  }

  private parseHash(): AppRoute {
    const raw = window.location.hash.replace(/^#\/?/, '').toLowerCase().trim();
    if (raw === 'shop' || raw === 'catalog') return 'shop';
    if (raw === 'lookbook' || raw === 'campaigns' || raw === 'gallery') return 'lookbook';
    if (raw === 'about' || raw === 'atelier' || raw === 'story') return 'about';
    if (raw === 'checkout' || raw === 'pay') return 'checkout';
    return 'home';
  }

  public navigate(route: AppRoute, updateHash = true) {
    this.currentRoute = route;
    if (updateHash) {
      window.location.hash = route === 'home' ? '' : route;
    }
    this.applyRoute(route);
    this.notify(route);
  }

  private handleHashChange() {
    const hash = window.location.hash.toLowerCase();

    // Check modal shortcuts
    if (hash === '#size-guide') {
      const modal = document.querySelector('size-guide-modal') as any;
      if (modal && typeof modal.open === 'function') {
        modal.open();
        return;
      }
    }
    if (hash === '#care' || hash === '#shipping' || hash === '#returns') {
      const modal = document.querySelector('care-modal') as any;
      if (modal && typeof modal.open === 'function') {
        modal.open();
        return;
      }
    }

    const route = this.parseHash();
    this.currentRoute = route;
    this.applyRoute(route);
    this.notify(route);
  }

  private applyRoute(route: AppRoute) {
    // 1. Toggle page container elements
    const views = {
      home: document.getElementById('view-home'),
      shop: document.getElementById('view-shop'),
      lookbook: document.getElementById('view-lookbook'),
      about: document.getElementById('view-about'),
      checkout: document.getElementById('view-checkout'),
    };

    Object.entries(views).forEach(([name, el]) => {
      if (!el) return;
      const isActive = name === route;
      el.classList.toggle('is-active', isActive);
      if (isActive) {
        el.removeAttribute('hidden');
      } else {
        el.setAttribute('hidden', '');
      }
    });

    // 2. Synchronize navigation links in site header
    document.querySelectorAll('.site-header nav a').forEach((link) => {
      const href = link.getAttribute('href') || '';
      let linkRoute = 'home';
      if (href.includes('#shop') || href.includes('#catalog')) linkRoute = 'shop';
      else if (href.includes('#lookbook') || href.includes('#gallery')) linkRoute = 'lookbook';
      else if (href.includes('#about')) linkRoute = 'about';
      else if (href === './' || href === '#home' || href === '#') linkRoute = 'home';

      const isCurrent = linkRoute === route;
      if (isCurrent) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    // 3. Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 4. Re-render checkout if navigating to checkout view
    if (route === 'checkout') {
      const checkoutEl = document.querySelector('store-checkout') as any;
      if (checkoutEl && typeof checkoutEl.render === 'function') {
        checkoutEl.render();
      }
    }

    // 5. Trigger resize event so runway canvas / grid recalculates if returning to home
    if (route === 'home') {
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event('resize'));
      });
    }
  }

  private bindNavLinks() {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const link = target.closest('a') as HTMLAnchorElement | null;
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      if (href.startsWith('#')) {
        const route = href.replace(/^#\/?/, '').toLowerCase();
        if (route === 'size-guide') {
          e.preventDefault();
          const modal = document.querySelector('size-guide-modal') as any;
          if (modal) modal.open();
          return;
        }
        if (route === 'care' || route === 'shipping' || route === 'returns') {
          e.preventDefault();
          const modal = document.querySelector('care-modal') as any;
          if (modal) modal.open();
          return;
        }
      }
    });
  }

  public subscribe(cb: (route: AppRoute) => void) {
    this.listeners.push(cb);
  }

  private notify(route: AppRoute) {
    this.listeners.forEach((cb) => cb(route));
  }

  public get current(): AppRoute {
    return this.currentRoute;
  }
}

export const router = new AppRouter();
