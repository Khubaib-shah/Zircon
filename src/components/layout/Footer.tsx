import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { isValidEmail } from '../../utils/runwayLogic';

interface FooterProps {
  onOpenSizeGuide: () => void;
  onOpenCare: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSizeGuide, onOpenCare }) => {
  const { showNotification } = useCart();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidEmail(email)) {
      showNotification(`Subscribed ${email}`);
      setEmail('');
    } else {
      showNotification('Please enter a valid email address.');
    }
  };

  return (
    <footer className="store-footer">
      <div className="footer-inner">
        <div className="footer-col">
          <div className="footer-brand">
            <img
              src="/assets/zircon-logo.png"
              width="24"
              height="24"
              alt="Zircon"
              className="footer-brand__logo"
            />
            <span>ZIRCON</span>
          </div>
          <p className="footer-tagline">
            Premium streetwear made to last. Heavyweight cotton, clean cuts, and everyday comfort.
          </p>
          <form className="footer-newsletter-form" onSubmit={handleSubmit} noValidate>
            <input
              type="email"
              className="footer-newsletter-input"
              placeholder="Enter email for new releases"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="footer-newsletter-btn">
              Subscribe
            </button>
          </form>
        </div>

        <div className="footer-col">
          <span className="footer-col-title">EXPLORE</span>
          <ul className="footer-links">
            <li><a href="#home">Runway</a></li>
            <li><a href="#shop">Collection</a></li>
            <li><a href="#lookbook">Lookbook</a></li>
            <li><a href="#about">About</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <span className="footer-col-title">SUPPORT</span>
          <ul className="footer-links">
            <li>
              <button type="button" onClick={onOpenSizeGuide}>
                Size Guide
              </button>
            </li>
            <li>
              <button type="button" onClick={onOpenCare}>
                Shipping & Delivery
              </button>
            </li>
            <li>
              <button type="button" onClick={onOpenCare}>
                Exchanges & Care
              </button>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <span className="footer-col-title">CONTACT</span>
          <ul className="footer-links">
            <li><a href="#about">Karachi & Lahore Studios</a></li>
            <li><a href="mailto:support@zircon.pk">support@zircon.pk</a></li>
          </ul>
          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#66625c' }}>
              Currency:
            </span>
            <select
              className="currency-select"
              defaultValue="PKR"
              onChange={(e) => showNotification(`Currency set to ${e.target.value}`)}
              aria-label="Select currency"
            >
              <option value="PKR">PKR (Rs.)</option>
              <option value="USD">USD ($)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div>2026 ZIRCON. ALL RIGHTS RESERVED.</div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <a href="#about" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
          <a href="#about" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</a>
        </div>
      </div>
    </footer>
  );
};

