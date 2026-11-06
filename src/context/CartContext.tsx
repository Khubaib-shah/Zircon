import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CATALOG_PRODUCTS, CatalogProduct, CatalogVariant } from '../data/catalogData';
import {
  addBagEntry,
  removeBagEntry,
  updateBagQuantity,
  calculateBagTotals,
  BagEntry,
  BagTotals,
} from '../utils/runwayLogic';

interface CartContextType {
  entries: BagEntry[];
  totals: BagTotals;
  isBagOpen: boolean;
  openBag: () => void;
  closeBag: () => void;
  addItem: (variantId: number, quantity?: number) => void;
  addItems: (items: { id: number; quantity?: number }[]) => void;
  removeItem: (variantId: number) => void;
  setQuantity: (variantId: number, quantity: number) => void;
  stepQuantity: (variantId: number, delta: number) => void;
  clearBag: () => void;
  findProduct: (variantId: number) => { product: CatalogProduct; variant: CatalogVariant } | null;
  notifyMessage: string | null;
  showNotification: (msg: string) => void;
  exportShortlist: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'zircon-bag-v1';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<BagEntry[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (e) =>
              e &&
              Number.isSafeInteger(e.id) &&
              Number.isSafeInteger(e.quantity) &&
              e.quantity > 0 &&
              CATALOG_PRODUCTS.some((p) => p.variants.some((v) => v.id === e.id && v.a))
          );
        }
      }
    } catch {
      // fallback
    }
    return [];
  });

  const [isBagOpen, setIsBagOpen] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // storage quota
    }
  }, [entries]);

  const showNotification = (msg: string) => {
    setNotifyMessage(msg);
  };

  useEffect(() => {
    if (!notifyMessage) return;
    const t = setTimeout(() => {
      setNotifyMessage(null);
    }, 2500);
    return () => clearTimeout(t);
  }, [notifyMessage]);

  const findProduct = (variantId: number) => {
    for (const product of CATALOG_PRODUCTS) {
      const variant = product.variants.find((v) => v.id === variantId && v.a);
      if (variant) return { product, variant };
    }
    return null;
  };

  const addItem = (variantId: number, quantity = 1) => {
    const match = findProduct(variantId);
    if (!match) {
      showNotification('Please choose an available size.');
      return;
    }
    setEntries((prev) => addBagEntry(prev, variantId, quantity));
    showNotification(`Added ${match.product.name} to bag`);
  };

  const addItems = (items: { id: number; quantity?: number }[]) => {
    setEntries((prev) => {
      let updated = [...prev];
      for (const item of items) {
        const match = findProduct(item.id);
        if (match) {
          updated = addBagEntry(updated, item.id, item.quantity || 1);
        }
      }
      return updated;
    });
    showNotification(items.length > 1 ? 'Look added to bag' : 'Added to bag');
  };

  const removeItem = (variantId: number) => {
    const match = findProduct(variantId);
    setEntries((prev) => removeBagEntry(prev, variantId));
    if (match) {
      showNotification(`Removed ${match.product.name}`);
    }
  };

  const setQuantity = (variantId: number, quantity: number) => {
    setEntries((prev) => updateBagQuantity(prev, variantId, quantity));
  };

  const stepQuantity = (variantId: number, delta: number) => {
    const current = entries.find((e) => e.id === variantId);
    if (!current) return;
    setQuantity(variantId, current.quantity + delta);
  };

  const clearBag = () => {
    setEntries([]);
    showNotification('Bag cleared');
  };

  const totals = calculateBagTotals(entries, CATALOG_PRODUCTS);

  const exportShortlist = () => {
    if (entries.length === 0) return;
    const dateStr = new Date().toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const lines = [
      '====================================================',
      '               ZIRCON — SAVED OUTFIT                ',
      '====================================================',
      `Date: ${dateStr}`,
      `Total Items: ${totals.totalQuantity}`,
      `Subtotal: ${totals.formattedSubtotal}`,
      '',
      'Premium streetwear made to last.',
      '----------------------------------------------------',
      '',
      ...entries.map((e, index) => {
        const match = findProduct(e.id);
        if (!match) return '';
        const { product, variant } = match;
        const lineTotal = product.price * e.quantity;
        return [
          `#0${index + 1} ${product.name.toUpperCase()}`,
          `    Size: ${variant.o.join(' / ')}`,
          `    Quantity: ${e.quantity}`,
          `    Price: Rs. ${product.price.toLocaleString('en-PK')} each (Rs. ${lineTotal.toLocaleString('en-PK')} total)`,
        ].join('\n');
      }),
      '',
      '====================================================',
    ].filter(Boolean);

    const blob = new Blob([lines.join('\n\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'zircon-outfit.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showNotification('List downloaded');
  };

  return (
    <CartContext.Provider
      value={{
        entries,
        totals,
        isBagOpen,
        openBag: () => setIsBagOpen(true),
        closeBag: () => setIsBagOpen(false),
        addItem,
        addItems,
        removeItem,
        setQuantity,
        stepQuantity,
        clearBag,
        findProduct,
        notifyMessage,
        showNotification,
        exportShortlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

