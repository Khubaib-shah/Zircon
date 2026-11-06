import React from 'react';
import { useCart } from '../../context/CartContext';

interface HeaderProps {
  currentRoute: string;
  navigate: (route: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, navigate }) => {
  const { totals, openBag } = useCart();

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, route: string) => {
    e.preventDefault();
    navigate(route);
  };

  return (
    <header className="site-header shopify-section-group-header-group">
      <a
        href="./"
        className="brand"
        aria-label="Zircon home"
        onClick={(e) => handleNav(e, 'home')}
      >
        <img
          src="/assets/zircon-logo.png"
          width="30"
          height="30"
          alt="Zircon"
          className="brand__logo"
        />
        <span className="brand__name">ZIRCON</span>
      </a>

      <nav aria-label="Main navigation">
        <a
          href="./"
          aria-current={currentRoute === 'home' ? 'page' : undefined}
          onClick={(e) => handleNav(e, 'home')}
        >
          Runway
        </a>
        <a
          href="#shop"
          aria-current={currentRoute === 'shop' ? 'page' : undefined}
          onClick={(e) => handleNav(e, 'shop')}
        >
          Collection
        </a>
        <a
          href="#lookbook"
          aria-current={currentRoute === 'lookbook' ? 'page' : undefined}
          onClick={(e) => handleNav(e, 'lookbook')}
        >
          Lookbook
        </a>
        <a
          href="#about"
          aria-current={currentRoute === 'about' ? 'page' : undefined}
          onClick={(e) => handleNav(e, 'about')}
        >
          About
        </a>
      </nav>

      <button
        id="open-bag"
        aria-label="Open bag"
        onClick={openBag}
        type="button"
      >
        <svg
          width="22"
          height="24"
          viewBox="0 0 24 26"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          aria-hidden="true"
        >
          <path d="M4 8h16l1 16H3L4 8zM8 8V6a4 4 0 0 1 8 0v2" />
        </svg>
        <span data-cart-count>{totals.totalQuantity}</span>
      </button>
    </header>
  );
};

