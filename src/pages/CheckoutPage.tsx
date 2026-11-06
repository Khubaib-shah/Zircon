import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import {
  SHIPPING_METHODS,
  ShippingMethod,
  calculateCheckoutTotals,
  generateOrderId,
  isValidEmail,
  isValidPakistaniPhone,
  formatCreditCardNumber,
  formatExpiry,
  formatPkr,
} from '../utils/runwayLogic';

export const PAKISTANI_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Abbottabad',
  'Other City',
];

export const PAKISTANI_PROVINCES = [
  'Sindh',
  'Punjab',
  'Islamabad Capital Territory',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Azad Kashmir',
  'Gilgit-Baltistan',
];

interface CheckoutPageProps {
  onReturnToStore: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onReturnToStore }) => {
  const { entries, totals, findProduct, clearBag, showNotification } = useCart();
  const [step, setStep] = useState(1);
  const [shippingId, setShippingId] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer' | 'card'>('cod');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Karachi',
    province: 'Sindh',
    postalCode: '75500',
    apartment: '',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedShipping: ShippingMethod =
    SHIPPING_METHODS.find((m) => m.id === shippingId) || SHIPPING_METHODS[0];

  const checkoutTotals = calculateCheckoutTotals(
    totals.subtotal,
    selectedShipping.price,
    discountPercent
  );

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'ZIRCON10' || code === 'PAK10' || code === 'SAVE10') {
      setDiscountPercent(10);
      showNotification(`Promo code ${code} applied (10% off)`);
    } else if (code.length > 0) {
      showNotification('Invalid promo code. Try ZIRCON10');
    }
  };

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!formData.firstName.trim()) errs.firstName = 'First name is required.';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required.';
    if (!isValidPakistaniPhone(formData.phone)) errs.phone = 'Please enter a valid mobile number (e.g. 0300-1234567).';
    if (!isValidEmail(formData.email)) errs.email = 'Please enter a valid email address.';
    if (!formData.address.trim()) errs.address = 'Delivery address is required.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validatePayment = () => {
    if (paymentMethod !== 'card') return true;
    const errs: Record<string, string> = {};
    if (!formData.cardName.trim()) errs.cardName = 'Name on card is required.';
    const cleanNum = formData.cardNumber.replace(/\s+/g, '');
    if (cleanNum.length < 15) errs.cardNumber = 'Please enter a valid 16-digit card number.';
    if (formData.cardExpiry.length < 5) errs.cardExpiry = 'Expiry MM/YY required.';
    if (formData.cardCvv.length < 3) errs.cardCvv = 'CVV is required.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validatePayment()) return;

    const items = entries.map((e) => {
      const match = findProduct(e.id);
      return {
        product: match?.product,
        variant: match?.variant,
        quantity: e.quantity,
      };
    }).filter((x) => x.product);

    const deliveryDays = shippingId === 'same_day' ? 0 : shippingId === 'express' ? 2 : 4;
    const deliveryDate = new Date(Date.now() + Math.max(1, deliveryDays) * 24 * 60 * 60 * 1000);
    const dateFormatted = deliveryDate.toLocaleDateString('en-PK', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const order = {
      orderId: generateOrderId(),
      date: new Date().toLocaleDateString('en-PK', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      customer: { ...formData },
      items,
      shippingMethod: selectedShipping,
      paymentMethod,
      totals: checkoutTotals,
      estimatedDelivery: dateFormatted,
    };

    setCompletedOrder(order);
    clearBag();
    setStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const downloadReceipt = (order: any) => {
    const lines = [
      '==============================================================',
      '                    ZIRCON — ORDER RECEIPT                    ',
      '==============================================================',
      `Order Reference: ${order.orderId}`,
      `Date: ${order.date}`,
      `Customer: ${order.customer.firstName} ${order.customer.lastName}`,
      `Phone: ${order.customer.phone}`,
      `Email: ${order.customer.email}`,
      `Address: ${order.customer.address}, ${order.customer.city}, ${order.customer.province}`,
      `Payment Method: ${order.paymentMethod.toUpperCase()}`,
      `Shipping: ${order.shippingMethod.name} (${order.shippingMethod.estimate})`,
      '--------------------------------------------------------------',
      'ITEMS:',
      ...order.items.map(
        (it: any, i: number) =>
          `#0${i + 1} ${it.product.name} (Size: ${it.variant.o.join(' / ')}) x ${it.quantity} @ ${formatPkr(it.product.price)} = ${formatPkr(it.product.price * it.quantity)}`
      ),
      '--------------------------------------------------------------',
      `Subtotal: ${order.totals.formattedSubtotal}`,
      `Shipping: ${order.totals.formattedShipping}`,
      `Discount: ${order.totals.formattedDiscount}`,
      `TOTAL: ${order.totals.formattedTotal}`,
      '==============================================================',
      'Zircon — Premium streetwear made to last.',
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${order.orderId}-receipt.txt`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  if (entries.length === 0 && !completedOrder) {
    return (
      <div className="store-checkout">
        <div className="checkout-header">
          <h1 className="checkout-title">Checkout</h1>
        </div>
        <div className="order-confirmation" style={{ maxWidth: '520px', margin: '40px auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 500, marginBottom: '8px' }}>Your bag is empty</h2>
          <p style={{ fontSize: '14px', color: '#66625c', marginBottom: '24px' }}>
            Add items from our collection before checking out.
          </p>
          <button
            type="button"
            className="campaign-btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', width: 'auto', padding: '0 28px' }}
            onClick={onReturnToStore}
          >
            <span>View Collection</span>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M4 12L12 4M12 4H6M12 4V10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  if (step === 4 && completedOrder) {
    const o = completedOrder;
    const paymentLabel =
      o.paymentMethod === 'cod'
        ? 'Cash on Delivery'
        : o.paymentMethod === 'bank_transfer'
        ? 'Bank Transfer'
        : 'Card';

    return (
      <div className="store-checkout">
        <div className="order-confirmation">
          <div className="confirmation-check-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#151413" strokeWidth="2.5" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="confirmation-kicker">ORDER CONFIRMED</div>
          <h1 className="confirmation-title">Thank you, {o.customer.firstName}.</h1>
          <div className="confirmation-order-id">Order Reference: {o.orderId}</div>
          <p style={{ fontSize: '14px', color: '#66625c', margin: '0 0 28px 0', lineHeight: 1.6 }}>
            Your order is confirmed. Updates will be sent to <strong>{o.customer.phone}</strong> and <strong>{o.customer.email}</strong>. Estimated delivery: <strong>{o.estimatedDelivery}</strong>.
          </p>

          <div className="confirmation-receipt-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e4e4e4', paddingBottom: '12px', marginBottom: '12px', fontSize: '13px' }}>
              <span><strong>Address:</strong> {o.customer.firstName} {o.customer.lastName}, {o.customer.address}, {o.customer.city}</span>
              <span><strong>Payment:</strong> {paymentLabel}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', marginBottom: '16px' }}>
              {o.items.map((it: any) => (
                <div style={{ display: 'flex', justifyContent: 'space-between' }} key={it.product.name}>
                  <span>{it.product.name} (Size {it.variant.o.join(' / ')}) · Qty {it.quantity}</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>{formatPkr(it.product.price * it.quantity)}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #151413', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '15px' }}>
              <span>Total</span>
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>{o.totals.formattedTotal}</span>
            </div>
          </div>

          <div className="confirmation-actions">
            <button
              type="button"
              className="campaign-btn-primary"
              onClick={() => downloadReceipt(o)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              <span>Download Receipt</span>
            </button>
            <button
              type="button"
              className="campaign-btn-secondary"
              onClick={() => window.print()}
            >
              <span>Print Receipt</span>
            </button>
            <button
              type="button"
              className="campaign-btn-secondary"
              onClick={onReturnToStore}
            >
              <span>Back to Store</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="store-checkout">
      <div className="checkout-header">
        <button
          type="button"
          className="checkout-back-btn"
          onClick={onReturnToStore}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Back to Store</span>
        </button>
        <h1 className="checkout-title">Checkout</h1>
        <div className="checkout-secure-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>Secure Checkout</span>
        </div>
      </div>

      <div className="checkout-layout">
        <div className="checkout-main">
          <div className="checkout-stepper">
            <div className={`checkout-step-tab ${step === 1 ? 'is-active' : ''} ${step > 1 ? 'is-complete' : ''}`}>
              01. Address
            </div>
            <div className={`checkout-step-tab ${step === 2 ? 'is-active' : ''} ${step > 2 ? 'is-complete' : ''}`}>
              02. Shipping
            </div>
            <div className={`checkout-step-tab ${step === 3 ? 'is-active' : ''}`}>
              03. Payment
            </div>
          </div>

          {step === 1 && (
            <div id="step-1" className="checkout-step-content">
              <h2 className="form-group-title">01 / Contact & Delivery Address</h2>
              <form className="checkout-form" onSubmit={(e) => e.preventDefault()} noValidate>
                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label" htmlFor="checkout-first-name">First Name *</label>
                    <input
                      className="form-input"
                      type="text"
                      id="checkout-first-name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Ali"
                      required
                    />
                    {errors.firstName && <span className="form-error">{errors.firstName}</span>}
                  </div>
                  <div className="form-field">
                    <label className="form-label" htmlFor="checkout-last-name">Last Name *</label>
                    <input
                      className="form-input"
                      type="text"
                      id="checkout-last-name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Khan"
                      required
                    />
                    {errors.lastName && <span className="form-error">{errors.lastName}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label" htmlFor="checkout-phone">Phone Number *</label>
                    <input
                      className="form-input"
                      type="tel"
                      id="checkout-phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="0300-1234567"
                      required
                    />
                    {errors.phone && <span className="form-error">{errors.phone}</span>}
                  </div>
                  <div className="form-field">
                    <label className="form-label" htmlFor="checkout-email">Email Address *</label>
                    <input
                      className="form-input"
                      type="email"
                      id="checkout-email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="ali@example.com"
                      required
                    />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="checkout-address">Street Address *</label>
                  <input
                    className="form-input"
                    type="text"
                    id="checkout-address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="House 42-B, Street 14, DHA Phase 6"
                    required
                  />
                  {errors.address && <span className="form-error">{errors.address}</span>}
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label" htmlFor="checkout-city">City *</label>
                    <select
                      className="form-select"
                      id="checkout-city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                    >
                      {PAKISTANI_CITIES.map((c) => (
                        <option value={c} key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-field">
                    <label className="form-label" htmlFor="checkout-province">Province / Region *</label>
                    <select
                      className="form-select"
                      id="checkout-province"
                      value={formData.province}
                      onChange={(e) => handleInputChange('province', e.target.value)}
                    >
                      {PAKISTANI_PROVINCES.map((p) => (
                        <option value={p} key={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label" htmlFor="checkout-postal">Postal Code (Optional)</label>
                    <input
                      className="form-input"
                      type="text"
                      id="checkout-postal"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      placeholder="75500"
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label" htmlFor="checkout-apartment">Apartment / Landmark (Optional)</label>
                    <input
                      className="form-input"
                      type="text"
                      id="checkout-apartment"
                      value={formData.apartment}
                      onChange={(e) => handleInputChange('apartment', e.target.value)}
                      placeholder="Apartment, suite, or landmark"
                    />
                  </div>
                </div>

                <div className="checkout-step-actions">
                  <div></div>
                  <button
                    type="button"
                    className="btn-checkout-next"
                    onClick={() => {
                      if (validateStep1()) {
                        setStep(2);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                  >
                    <span>Continue to Shipping</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 2 && (
            <div id="step-2" className="checkout-step-content">
              <h2 className="form-group-title">02 / Shipping Method</h2>
              <div className="shipping-methods-list">
                {SHIPPING_METHODS.map((m) => (
                  <label
                    className={`shipping-method-card ${shippingId === m.id ? 'is-selected' : ''}`}
                    key={m.id}
                  >
                    <div className="shipping-method-left">
                      <input
                        type="radio"
                        name="shipping-method"
                        value={m.id}
                        className="shipping-radio"
                        checked={shippingId === m.id}
                        onChange={() => setShippingId(m.id)}
                      />
                      <div className="shipping-details">
                        <span className="shipping-name">{m.name}</span>
                        <span className="shipping-desc">{m.description}</span>
                        <span className="shipping-estimate">{m.estimate}</span>
                      </div>
                    </div>
                    <span className="shipping-price">
                      {m.price === 0 ? 'Free' : formatPkr(m.price)}
                    </span>
                  </label>
                ))}
              </div>

              <div className="checkout-step-actions">
                <button
                  type="button"
                  className="btn-checkout-back"
                  onClick={() => setStep(1)}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  <span>Back to Address</span>
                </button>
                <button
                  type="button"
                  className="btn-checkout-next"
                  onClick={() => {
                    setStep(3);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <span>Continue to Payment</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div id="step-3" className="checkout-step-content">
              <h2 className="form-group-title">03 / Payment Method</h2>

              <div className="payment-tabs" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
                <button
                  type="button"
                  className={`payment-tab-btn ${paymentMethod === 'cod' ? 'is-active' : ''}`}
                  onClick={() => setPaymentMethod('cod')}
                  style={{
                    padding: '14px 12px',
                    border: `1px solid ${paymentMethod === 'cod' ? '#151413' : '#c8c8c8'}`,
                    background: paymentMethod === 'cod' ? '#151413' : '#ffffff',
                    color: paymentMethod === 'cod' ? '#ffffff' : '#151413',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Cash on Delivery</div>
                  <div style={{ fontSize: '11px', opacity: 0.8 }}>Pay on arrival</div>
                </button>

                <button
                  type="button"
                  className={`payment-tab-btn ${paymentMethod === 'bank_transfer' ? 'is-active' : ''}`}
                  onClick={() => setPaymentMethod('bank_transfer')}
                  style={{
                    padding: '14px 12px',
                    border: `1px solid ${paymentMethod === 'bank_transfer' ? '#151413' : '#c8c8c8'}`,
                    background: paymentMethod === 'bank_transfer' ? '#151413' : '#ffffff',
                    color: paymentMethod === 'bank_transfer' ? '#ffffff' : '#151413',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Bank Transfer</div>
                  <div style={{ fontSize: '11px', opacity: 0.8 }}>IBAN / Raast</div>
                </button>

                <button
                  type="button"
                  className={`payment-tab-btn ${paymentMethod === 'card' ? 'is-active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                  style={{
                    padding: '14px 12px',
                    border: `1px solid ${paymentMethod === 'card' ? '#151413' : '#c8c8c8'}`,
                    background: paymentMethod === 'card' ? '#151413' : '#ffffff',
                    color: paymentMethod === 'card' ? '#ffffff' : '#151413',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Card</div>
                  <div style={{ fontSize: '11px', opacity: 0.8 }}>Visa / Mastercard</div>
                </button>
              </div>

              {paymentMethod === 'cod' && (
                <div style={{ border: '1px solid #c8c8c8', padding: '24px', background: '#fafafa', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#151413' }}></span>
                    <strong style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Cash on Delivery
                    </strong>
                  </div>
                  <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.6, margin: '0 0 12px 0' }}>
                    Pay in cash when your order is delivered to your doorstep.
                  </p>
                  <div style={{ fontSize: '12px', color: '#151413', background: '#ffffff', border: '1px solid #e0e0e0', padding: '12px 14px', lineHeight: 1.7 }}>
                    <div>Total payable on delivery: <strong>{checkoutTotals.formattedTotal}</strong></div>
                    <div>7-day size exchange included.</div>
                  </div>
                </div>
              )}

              {paymentMethod === 'bank_transfer' && (
                <div style={{ border: '1px solid #c8c8c8', padding: '24px', background: '#fafafa', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#151413' }}></span>
                    <strong style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Bank Transfer
                    </strong>
                  </div>
                  <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.6, margin: '0 0 16px 0' }}>
                    Transfer via IBAN or Raast using any banking app:
                  </p>
                  <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', padding: '16px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px', fontVariantNumeric: 'tabular-nums' }}>
                    <div><strong>Bank:</strong> Meezan Bank</div>
                    <div><strong>Account Title:</strong> ZIRCON STUDIO</div>
                    <div><strong>IBAN:</strong> PK45 MEZN 0002 0101 0894 2155</div>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="payment-card-box">
                  <div className="form-field">
                    <label className="form-label" htmlFor="checkout-card-name">Name on Card *</label>
                    <input
                      className="form-input"
                      type="text"
                      id="checkout-card-name"
                      value={formData.cardName}
                      onChange={(e) => handleInputChange('cardName', e.target.value)}
                      placeholder="ALI KHAN"
                    />
                    {errors.cardName && <span className="form-error">{errors.cardName}</span>}
                  </div>

                  <div className="form-field">
                    <label className="form-label" htmlFor="checkout-card-num">Card Number *</label>
                    <input
                      className="form-input"
                      type="text"
                      id="checkout-card-num"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', formatCreditCardNumber(e.target.value))}
                      placeholder="4000 1234 5678 9010"
                      maxLength={19}
                    />
                    {errors.cardNumber && <span className="form-error">{errors.cardNumber}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label className="form-label" htmlFor="checkout-card-expiry">Expiry Date *</label>
                      <input
                        className="form-input"
                        type="text"
                        id="checkout-card-expiry"
                        value={formData.cardExpiry}
                        onChange={(e) => handleInputChange('cardExpiry', formatExpiry(e.target.value))}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                      {errors.cardExpiry && <span className="form-error">{errors.cardExpiry}</span>}
                    </div>
                    <div className="form-field">
                      <label className="form-label" htmlFor="checkout-card-cvv">CVV *</label>
                      <input
                        className="form-input"
                        type="password"
                        id="checkout-card-cvv"
                        value={formData.cardCvv}
                        onChange={(e) => handleInputChange('cardCvv', e.target.value)}
                        placeholder="123"
                        maxLength={4}
                      />
                      {errors.cardCvv && <span className="form-error">{errors.cardCvv}</span>}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="one-click-demo-btn"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        cardName: (prev.firstName ? `${prev.firstName} ${prev.lastName}` : 'ALI KHAN').toUpperCase(),
                        cardNumber: '4242 4242 4242 4242',
                        cardExpiry: '12/28',
                        cardCvv: '842',
                      }));
                      showNotification('Test card details filled');
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                    <span>Fill Test Card</span>
                  </button>
                </div>
              )}

              <div className="checkout-step-actions">
                <button
                  type="button"
                  className="btn-checkout-back"
                  onClick={() => setStep(2)}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  <span>Back to Shipping</span>
                </button>
                <button
                  type="button"
                  className="btn-checkout-next"
                  onClick={handlePlaceOrder}
                >
                  <span>Place Order ({checkoutTotals.formattedTotal})</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="checkout-summary-panel">
          <h3 className="summary-heading">Order Summary ({checkoutTotals.formattedTotal})</h3>
          <div className="summary-items-list">
            {entries.map((e) => {
              const match = findProduct(e.id);
              if (!match) return null;
              const { product, variant } = match;
              return (
                <div className="summary-item-row" key={e.id}>
                  <img src={product.image} alt={product.name} className="summary-item-thumb" />
                  <div className="summary-item-details">
                    <span className="summary-item-title">{product.name}</span>
                    <span className="summary-item-meta">Size {variant.o.join(' / ')} · Qty {e.quantity}</span>
                  </div>
                  <span className="summary-item-price">{formatPkr(product.price * e.quantity)}</span>
                </div>
              );
            })}
          </div>

          <div className="summary-promo-row">
            <input
              type="text"
              className="summary-promo-input"
              placeholder="Promo code (e.g. ZIRCON10)"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button type="button" className="summary-promo-btn" onClick={handleApplyPromo}>
              Apply
            </button>
          </div>

          <div className="summary-breakdown">
            <div className="summary-line">
              <span>Subtotal</span>
              <span>{checkoutTotals.formattedSubtotal}</span>
            </div>
            {discountPercent > 0 && (
              <div className="summary-line is-discount">
                <span>Discount ({discountPercent}%)</span>
                <span>{checkoutTotals.formattedDiscount}</span>
              </div>
            )}
            <div className="summary-line">
              <span>Shipping ({selectedShipping.name})</span>
              <span>{checkoutTotals.formattedShipping}</span>
            </div>
            <div className="summary-line">
              <span>Taxes</span>
              <span>Included</span>
            </div>
          </div>

          <div className="summary-total-line">
            <span>Total</span>
            <span className="summary-total-amount">{checkoutTotals.formattedTotal}</span>
          </div>

          <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid #ebebeb', fontSize: '12px', color: '#666', lineHeight: 1.5, display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#151413" strokeWidth="1.8" aria-hidden="true" style={{ flexShrink: 0, marginTop: '2px' }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <div>
              <strong style={{ color: '#151413' }}>Delivery & Exchanges</strong><br />
              Easy 7-day size exchanges across Pakistan.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

