import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { BagDrawer } from './components/cart/BagDrawer';
import { SizeGuideModal } from './components/modals/SizeGuideModal';
import { CareModal } from './components/modals/CareModal';
import { RunwaySection } from './components/home/RunwaySection';
import { StudioGallery } from './components/home/StudioGallery';
import { ProductCatalog } from './components/home/ProductCatalog';
import { ManifestoStrip } from './components/home/ManifestoStrip';
import { LookbookPage } from './pages/LookbookPage';
import { AboutPage } from './pages/AboutPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { useCart } from './context/CartContext';
import { Check, X } from 'lucide-react';

export const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isCareOpen, setIsCareOpen] = useState(false);
  const { notifyMessage, showNotification } = useCart();

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').trim().toLowerCase();
      if (['home', 'shop', 'catalog', 'lookbook', 'about', 'checkout'].includes(hash)) {
        setCurrentRoute(hash === 'catalog' ? 'shop' : hash);
      } else if (!hash) {
        setCurrentRoute('home');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigate = (route: string) => {
    const normalized = route.replace('#', '').toLowerCase();
    setCurrentRoute(normalized === 'catalog' ? 'shop' : normalized);
    window.location.hash = normalized;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-white selection:text-black">
      {/* Toast Notification */}
      {notifyMessage && (
        <div
          id="bag-status"
          className="is-on flex items-center gap-2.5 font-sans"
          role="status"
          aria-live="polite"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0 animate-pulse" />
          <span className="tracking-wide text-xs select-none">{notifyMessage}</span>
          <button
            type="button"
            onClick={() => showNotification('')}
            className="toast-close-btn ml-2.5 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5 stroke-[2]" />
          </button>
        </div>
      )}

      {/* Header */}
      <Header
        currentRoute={currentRoute}
        navigate={navigate}
      />

      {/* Page Routing */}
      <main className="flex-1">
        {currentRoute === 'home' && (
          <>
            <RunwaySection
              onJumpToLook={(idx) => {
                navigate('lookbook');
              }}
              onExploreCatalog={() => navigate('shop')}
            />
            <ManifestoStrip />
            <ProductCatalog
              onJumpToLook={(idx) => {
                navigate('lookbook');
              }}
            />
            <StudioGallery
              onJumpToLook={(idx) => {
                navigate('lookbook');
              }}
            />
          </>
        )}

        {currentRoute === 'shop' && (
          <div className="pt-6">
            <ProductCatalog
              onJumpToLook={(idx) => {
                navigate('lookbook');
              }}
            />
          </div>
        )}

        {currentRoute === 'lookbook' && (
          <LookbookPage />
        )}

        {currentRoute === 'about' && (
          <AboutPage />
        )}

        {currentRoute === 'checkout' && (
          <CheckoutPage onReturnToStore={() => navigate('shop')} />
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        onOpenCare={() => setIsCareOpen(true)}
      />

      {/* Modals & Drawer */}
      <BagDrawer
        onCheckout={() => navigate('checkout')}
        onExplore={() => navigate('shop')}
      />
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
      <CareModal isOpen={isCareOpen} onClose={() => setIsCareOpen(false)} />
    </div>
  );
};

export default App;
