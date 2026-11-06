/**
 * Store Checkout Page Component (<store-checkout>)
 * Multi-step e-commerce checkout flow with Pakistani touch:
 * Step 1: Contact & Delivery Address (Karachi, Lahore, Islamabad, etc.)
 * Step 2: Shipping Tier (TCS / Trax Courier)
 * Step 3: Payment (Cash on Delivery, Bank Transfer, or Card)
 * Step 4: Order Confirmation & Receipt in PKR
 */

import { shoppingBag } from '../shopping-bag';
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
} from '../runway-logic';

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

export class StoreCheckoutElement extends HTMLElement {
  private currentStep: number = 1;
  private selectedShippingId: string = 'standard';
  private selectedPaymentMethod: 'cod' | 'bank_transfer' | 'card' = 'cod';
  private promoDiscountPercent: number = 0;
  private promoCodeApplied: string = '';

  // Form State
  private formData = {
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: 'Karachi',
    province: 'Sindh',
    postalCode: '75500',
    phone: '',
    deliveryNote: '',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  };

  private completedOrder: any = null;

  connectedCallback() {
    this.render();
  }

  private get selectedShipping(): ShippingMethod {
    return (
      SHIPPING_METHODS.find((m) => m.id === this.selectedShippingId) ||
      SHIPPING_METHODS[0]
    );
  }

  public render() {
    this.className = 'store-checkout';
    const entries = shoppingBag.currentEntries;
    const totals = calculateCheckoutTotals(
      shoppingBag.getTotals().subtotal,
      this.selectedShipping.price,
      this.promoDiscountPercent
    );

    if (entries.length === 0 && !this.completedOrder) {
      this.innerHTML = `
        <div class="checkout-header">
          <h1 class="checkout-title">Checkout</h1>
        </div>
        <div class="order-confirmation" style="max-width: 520px; margin: 40px auto; text-align: center;">
          <h2 style="font-size: 20px; font-weight: 500; margin-bottom: 8px;">Your cart is empty</h2>
          <p style="font-size: 14px; color: #66625c; margin-bottom: 24px;">Please select pieces from our collection before checking out.</p>
          <a href="#shop" class="campaign-btn-primary" style="text-decoration: none; display: inline-flex; width: auto; padding: 0 28px;">
            Shop Collection ↗
          </a>
        </div>
      `;
      return;
    }

    if (this.currentStep === 4 && this.completedOrder) {
      this.renderConfirmationScreen();
      return;
    }

    this.innerHTML = `
      <div class="checkout-header">
        <a href="#home" class="checkout-back-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          <span>Return to Store</span>
        </a>
        <h1 class="checkout-title">Secure Checkout</h1>
        <div class="checkout-secure-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          <span>Cash on Delivery & Secure Pay</span>
        </div>
      </div>

      <div class="checkout-layout">
        <!-- Main Form Column -->
        <div class="checkout-main">
          <!-- Stepper Navigation -->
          <div class="checkout-stepper">
            <div class="checkout-step-tab ${this.currentStep === 1 ? 'is-active' : ''} ${this.currentStep > 1 ? 'is-complete' : ''}">
              01. Delivery Address
            </div>
            <div class="checkout-step-tab ${this.currentStep === 2 ? 'is-active' : ''} ${this.currentStep > 2 ? 'is-complete' : ''}">
              02. Courier Speed
            </div>
            <div class="checkout-step-tab ${this.currentStep === 3 ? 'is-active' : ''}">
              03. Payment Option
            </div>
          </div>

          <!-- Step 1: Contact & Delivery Address -->
          <div id="step-1" class="checkout-step-content" style="${this.currentStep === 1 ? '' : 'display: none;'}">
            <h2 class="form-group-title">01 / Your Contact & Delivery Address</h2>
            <form class="checkout-form" id="address-form" novalidate>
              <div class="form-row">
                <div class="form-field">
                  <label class="form-label" for="checkout-first-name">First Name *</label>
                  <input class="form-input" type="text" id="checkout-first-name" value="${this.formData.firstName}" placeholder="Ali" required />
                  <span class="form-error" id="err-first-name" style="display:none;">First name is required.</span>
                </div>
                <div class="form-field">
                  <label class="form-label" for="checkout-last-name">Last Name *</label>
                  <input class="form-input" type="text" id="checkout-last-name" value="${this.formData.lastName}" placeholder="Khan" required />
                  <span class="form-error" id="err-last-name" style="display:none;">Last name is required.</span>
                </div>
              </div>

              <div class="form-row">
                <div class="form-field">
                  <label class="form-label" for="checkout-phone">Mobile Phone (for rider) *</label>
                  <input class="form-input" type="tel" id="checkout-phone" value="${this.formData.phone}" placeholder="0300-1234567" required />
                  <span style="font-size: 11px; color: #66625c; margin-top: 4px;">TCS / Trax courier rider will call this number before delivery.</span>
                  <span class="form-error" id="err-phone" style="display:none;">Please enter a valid Pakistani mobile number (e.g. 0300-1234567).</span>
                </div>
                <div class="form-field">
                  <label class="form-label" for="checkout-email">Email Address *</label>
                  <input class="form-input" type="email" id="checkout-email" value="${this.formData.email}" placeholder="ali.khan@gmail.com" required />
                  <span class="form-error" id="err-email" style="display:none;">Please enter a valid email address.</span>
                </div>
              </div>

              <div class="form-field">
                <label class="form-label" for="checkout-address">Complete Delivery Address (House / Street / Area) *</label>
                <input class="form-input" type="text" id="checkout-address" value="${this.formData.address}" placeholder="House 42-B, Street 14, Phase 6, DHA" required />
                <span class="form-error" id="err-address" style="display:none;">Delivery address is required.</span>
              </div>

              <div class="form-row">
                <div class="form-field">
                  <label class="form-label" for="checkout-city">City *</label>
                  <select class="form-select" id="checkout-city">
                    ${PAKISTANI_CITIES.map(
                      (c) => `<option value="${c}" ${this.formData.city === c ? 'selected' : ''}>${c}</option>`
                    ).join('')}
                  </select>
                </div>
                <div class="form-field">
                  <label class="form-label" for="checkout-province">Province / Region *</label>
                  <select class="form-select" id="checkout-province">
                    ${PAKISTANI_PROVINCES.map(
                      (p) => `<option value="${p}" ${this.formData.province === p ? 'selected' : ''}>${p}</option>`
                    ).join('')}
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-field">
                  <label class="form-label" for="checkout-postal">Postal Code / Area Code (Optional)</label>
                  <input class="form-input" type="text" id="checkout-postal" value="${this.formData.postalCode}" placeholder="75500" />
                </div>
                <div class="form-field">
                  <label class="form-label" for="checkout-apartment">Nearby Landmark / Instructions (Optional)</label>
                  <input class="form-input" type="text" id="checkout-apartment" value="${this.formData.apartment}" placeholder="Near Khayaban-e-Shahbaz commercial" />
                </div>
              </div>

              <div class="checkout-step-actions">
                <div></div>
                <button type="button" class="btn-checkout-next" id="btn-to-step-2">
                  <span>Continue to Shipping</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            </form>
          </div>

          <!-- Step 2: Shipping Method -->
          <div id="step-2" class="checkout-step-content" style="${this.currentStep === 2 ? '' : 'display: none;'}">
            <h2 class="form-group-title">02 / Choose Delivery Speed</h2>
            <div class="shipping-methods-list">
              ${SHIPPING_METHODS.map(
                (m) => `
                <label class="shipping-method-card ${this.selectedShippingId === m.id ? 'is-selected' : ''}">
                  <div class="shipping-method-left">
                    <input type="radio" name="shipping-method" value="${m.id}" class="shipping-radio" ${this.selectedShippingId === m.id ? 'checked' : ''} />
                    <div class="shipping-details">
                      <span class="shipping-name">${m.name}</span>
                      <span class="shipping-desc">${m.description}</span>
                      <span class="shipping-estimate">${m.estimate}</span>
                    </div>
                  </div>
                  <span class="shipping-price">${m.price === 0 ? 'Free Delivery' : formatPkr(m.price)}</span>
                </label>
              `
              ).join('')}
            </div>

            <div class="checkout-step-actions">
              <button type="button" class="btn-checkout-back" id="btn-back-to-1">
                ← Return to Address
              </button>
              <button type="button" class="btn-checkout-next" id="btn-to-step-3">
                <span>Continue to Payment</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>

          <!-- Step 3: Payment Selection -->
          <div id="step-3" class="checkout-step-content" style="${this.currentStep === 3 ? '' : 'display: none;'}">
            <h2 class="form-group-title">03 / Select Payment Method</h2>

            <!-- Payment Method Tabs -->
            <div class="payment-tabs" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 24px;">
              <button type="button" class="payment-tab-btn ${this.selectedPaymentMethod === 'cod' ? 'is-active' : ''}" data-pay-method="cod" style="padding: 14px 12px; border: 1px solid ${this.selectedPaymentMethod === 'cod' ? '#151413' : '#c8c8c8'}; background: ${this.selectedPaymentMethod === 'cod' ? '#151413' : '#ffffff'}; color: ${this.selectedPaymentMethod === 'cod' ? '#ffffff' : '#151413'}; text-align: left; cursor: pointer; transition: all 0.15s ease;">
                <div style="font-size: 13px; font-weight: 600; margin-bottom: 4px;">Cash on Delivery</div>
                <div style="font-size: 11px; opacity: 0.8;">Pay cash at doorstep</div>
              </button>

              <button type="button" class="payment-tab-btn ${this.selectedPaymentMethod === 'bank_transfer' ? 'is-active' : ''}" data-pay-method="bank_transfer" style="padding: 14px 12px; border: 1px solid ${this.selectedPaymentMethod === 'bank_transfer' ? '#151413' : '#c8c8c8'}; background: ${this.selectedPaymentMethod === 'bank_transfer' ? '#151413' : '#ffffff'}; color: ${this.selectedPaymentMethod === 'bank_transfer' ? '#ffffff' : '#151413'}; text-align: left; cursor: pointer; transition: all 0.15s ease;">
                <div style="font-size: 13px; font-weight: 600; margin-bottom: 4px;">Bank Transfer</div>
                <div style="font-size: 11px; opacity: 0.8;">Meezan / HBL / Raast</div>
              </button>

              <button type="button" class="payment-tab-btn ${this.selectedPaymentMethod === 'card' ? 'is-active' : ''}" data-pay-method="card" style="padding: 14px 12px; border: 1px solid ${this.selectedPaymentMethod === 'card' ? '#151413' : '#c8c8c8'}; background: ${this.selectedPaymentMethod === 'card' ? '#151413' : '#ffffff'}; color: ${this.selectedPaymentMethod === 'card' ? '#ffffff' : '#151413'}; text-align: left; cursor: pointer; transition: all 0.15s ease;">
                <div style="font-size: 13px; font-weight: 600; margin-bottom: 4px;">Debit / Credit Card</div>
                <div style="font-size: 11px; opacity: 0.8;">Visa, Mastercard, PayPak</div>
              </button>
            </div>

            <!-- Mode 1: Cash on Delivery -->
            <div id="pay-panel-cod" style="${this.selectedPaymentMethod === 'cod' ? '' : 'display: none;'}">
              <div style="border: 1px solid #c8c8c8; padding: 24px; background: #fafafa; margin-bottom: 24px;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                  <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #151413;"></span>
                  <strong style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Cash on Delivery (Available Nationwide)</strong>
                </div>
                <p style="font-size: 13px; color: #555; line-height: 1.6; margin: 0 0 12px 0;">
                  Pay in cash directly to the TCS or Trax delivery rider when they hand you your parcel.
                </p>
                <div style="font-size: 12px; color: #151413; background: #ffffff; border: 1px solid #e0e0e0; padding: 12px 14px; line-height: 1.5;">
                  ✓ No advance payment required.<br />
                  ✓ Please keep exact cash of <strong>${totals.formattedTotal}</strong> ready when the rider arrives.<br />
                  ✓ 7-day hassle-free size exchange available.
                </div>
              </div>
            </div>

            <!-- Mode 2: Bank Transfer (Raast / Meezan) -->
            <div id="pay-panel-bank" style="${this.selectedPaymentMethod === 'bank_transfer' ? '' : 'display: none;'}">
              <div style="border: 1px solid #c8c8c8; padding: 24px; background: #fafafa; margin-bottom: 24px;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                  <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #151413;"></span>
                  <strong style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Direct Bank Transfer (Meezan / Raast)</strong>
                </div>
                <p style="font-size: 13px; color: #555; line-height: 1.6; margin: 0 0 16px 0;">
                  Transfer payment using any Pakistani bank app (HBL, Meezan, Alfalah, Nayapay, Sadapay) via Raast or IBAN:
                </p>

                <div style="background: #ffffff; border: 1px solid #e0e0e0; padding: 16px; font-size: 13px; display: flex; flex-direction: column; gap: 8px; font-variant-numeric: tabular-nums;">
                  <div><strong>Bank:</strong> Meezan Bank Limited</div>
                  <div><strong>Account Title:</strong> RUNWAY PAKISTAN (PVT) LTD</div>
                  <div><strong>IBAN:</strong> PK45 MEZN 0002 0101 0894 2155</div>
                  <div><strong>Raast ID / Phone:</strong> 0300-1234567</div>
                  <div style="font-size: 11px; color: #666; margin-top: 4px;">* After placing order, send screenshot on WhatsApp: <strong>0300-1234567</strong> with your Order ID for instant dispatch.</div>
                </div>
              </div>
            </div>

            <!-- Mode 3: Card Payment -->
            <div id="pay-panel-card" style="${this.selectedPaymentMethod === 'card' ? '' : 'display: none;'}">
              <div class="payment-card-box">
                <div class="form-field">
                  <label class="form-label" for="checkout-card-name">Name on Card *</label>
                  <input class="form-input" type="text" id="checkout-card-name" value="${this.formData.cardName || (this.formData.firstName ? this.formData.firstName + ' ' + this.formData.lastName : '')}" placeholder="ALI KHAN" />
                  <span class="form-error" id="err-card-name" style="display:none;">Name on card is required.</span>
                </div>

                <div class="form-field">
                  <label class="form-label" for="checkout-card-num">Card Number (Pakistani or International) *</label>
                  <input class="form-input" type="text" id="checkout-card-num" value="${this.formData.cardNumber}" placeholder="4000 1234 5678 9010" maxlength="19" />
                  <span class="form-error" id="err-card-num" style="display:none;">Please enter a valid 16-digit card number.</span>
                </div>

                <div class="form-row">
                  <div class="form-field">
                    <label class="form-label" for="checkout-card-expiry">Expiry Date *</label>
                    <input class="form-input" type="text" id="checkout-card-expiry" value="${this.formData.cardExpiry}" placeholder="MM/YY" maxlength="5" />
                    <span class="form-error" id="err-card-expiry" style="display:none;">Expiry MM/YY required.</span>
                  </div>
                  <div class="form-field">
                    <label class="form-label" for="checkout-card-cvv">Security Code (CVV) *</label>
                    <input class="form-input" type="password" id="checkout-card-cvv" value="${this.formData.cardCvv}" placeholder="•••" maxlength="4" />
                    <span class="form-error" id="err-card-cvv" style="display:none;">CVV is required.</span>
                  </div>
                </div>

                <button type="button" class="one-click-demo-btn" id="btn-fill-demo-card">
                  ⚡ Auto-Fill Valid Pakistani Test Card
                </button>
              </div>
            </div>

            <div class="checkout-step-actions">
              <button type="button" class="btn-checkout-back" id="btn-back-to-2">
                ← Return to Delivery Speed
              </button>
              <button type="button" class="btn-checkout-next" id="btn-complete-order">
                <span>Place Order (${totals.formattedTotal})</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Sticky Right Sidebar: Order Summary -->
        <aside class="checkout-summary-panel">
          <h3 class="summary-heading">Order Summary (${totals.formattedTotal})</h3>
          <div class="summary-items-list">
            ${entries
              .map((e) => {
                const match = shoppingBag.findProduct(e.id);
                if (!match) return '';
                const { product, variant } = match;
                return `
                <div class="summary-item-row">
                  <img src="${product.image}" alt="${product.name}" class="summary-item-thumb" />
                  <div class="summary-item-details">
                    <span class="summary-item-title">${product.name}</span>
                    <span class="summary-item-meta">Size ${variant.o.join(' / ')} × Qty ${e.quantity}</span>
                  </div>
                  <span class="summary-item-price">${formatPkr(product.price * e.quantity)}</span>
                </div>
              `;
              })
              .join('')}
          </div>

          <!-- Promo Code Box -->
          <div class="summary-promo-row">
            <input type="text" class="summary-promo-input" id="promo-input" placeholder="Promo code (e.g. PAK10)" value="${this.promoCodeApplied}" />
            <button type="button" class="summary-promo-btn" id="promo-apply-btn">Apply</button>
          </div>

          <!-- Financial Breakdown -->
          <div class="summary-breakdown">
            <div class="summary-line">
              <span>Subtotal</span>
              <span>${totals.formattedSubtotal}</span>
            </div>
            ${
              this.promoDiscountPercent > 0
                ? `
              <div class="summary-line is-discount">
                <span>Discount (${this.promoDiscountPercent}%)</span>
                <span>${totals.formattedDiscount}</span>
              </div>
            `
                : ''
            }
            <div class="summary-line">
              <span>Shipping (${this.selectedShipping.name})</span>
              <span>${totals.formattedShipping}</span>
            </div>
            <div class="summary-line">
              <span>Taxes / GST</span>
              <span>Included</span>
            </div>
          </div>

          <div class="summary-total-line">
            <span>Total Payable</span>
            <span class="summary-total-amount">${totals.formattedTotal}</span>
          </div>

          <div style="margin-top: 18px; padding-top: 14px; border-top: 1px solid #ebebeb; font-size: 12px; color: #666; line-height: 1.5;">
            🔒 <strong>Safe Delivery Guarantee</strong><br />
            Free 7-day size exchange anywhere in Pakistan. WhatsApp support available daily 10 AM to 8 PM PKT.
          </div>
        </aside>
      </div>
    `;

    this.bindEvents();
  }

  private renderConfirmationScreen() {
    const o = this.completedOrder;
    const paymentLabel =
      o.paymentMethod === 'cod'
        ? 'Cash on Delivery (Pay rider at doorstep)'
        : o.paymentMethod === 'bank_transfer'
        ? 'Direct Bank Transfer (Meezan / Raast)'
        : 'Paid by Card (Visa / Mastercard)';

    this.innerHTML = `
      <div class="order-confirmation">
        <div class="confirmation-check-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#151413" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div class="confirmation-kicker">ORDER CONFIRMED</div>
        <h1 class="confirmation-title">Shukriya, ${o.customer.firstName}!</h1>
        <div class="confirmation-order-id">Order Reference: ${o.orderId}</div>
        <p style="font-size: 14px; color: #66625c; margin: 0 0 28px 0; line-height: 1.6;">
          Your order has been booked. A confirmation has been sent to <strong>${o.customer.phone}</strong> and <strong>${o.customer.email}</strong>. Estimated delivery: <strong>${o.estimatedDelivery}</strong> via TCS / Trax Courier.
        </p>

        <div class="confirmation-receipt-box">
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #e4e4e4; padding-bottom: 12px; margin-bottom: 12px; font-size: 13px;">
            <span><strong>Delivering To:</strong> ${o.customer.firstName} ${o.customer.lastName}, ${o.customer.address}, ${o.customer.city}, ${o.customer.province}</span>
            <span><strong>Payment:</strong> ${paymentLabel}</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px; margin-bottom: 16px;">
            ${o.items
              .map(
                (it: any) => `
              <div style="display: flex; justify-content: space-between;">
                <span>${it.product.name} (Size ${it.variant.o.join(' / ')}) × ${it.quantity}</span>
                <span style="font-variant-numeric: tabular-nums;">${formatPkr(it.product.price * it.quantity)}</span>
              </div>
            `
              )
              .join('')}
          </div>

          <div style="border-top: 1px solid #151413; padding-top: 12px; display: flex; justify-content: space-between; font-weight: 600; font-size: 15px;">
            <span>Total Payable</span>
            <span style="font-variant-numeric: tabular-nums;">${o.totals.formattedTotal}</span>
          </div>
        </div>

        <div class="confirmation-actions">
          <button type="button" class="campaign-btn-primary" id="btn-download-receipt">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            <span>Download Invoice (.txt)</span>
          </button>
          <button type="button" class="campaign-btn-secondary" id="btn-print-receipt">
            <span>Print Receipt</span>
          </button>
          <a href="#home" class="campaign-btn-secondary" style="text-decoration: none; display: flex; align-items: center; justify-content: center;">
            <span>Return to Store</span>
          </a>
        </div>
      </div>
    `;

    this.querySelector('#btn-download-receipt')?.addEventListener('click', () => {
      this.downloadReceiptFile(o);
    });

    this.querySelector('#btn-print-receipt')?.addEventListener('click', () => {
      window.print();
    });
  }

  private downloadReceiptFile(order: any) {
    const lines = [
      '==============================================================',
      '                 RUNWAY PAKISTAN — ORDER INVOICE              ',
      '==============================================================',
      `Order Reference: ${order.orderId}`,
      `Date: ${order.date}`,
      `Customer: ${order.customer.firstName} ${order.customer.lastName}`,
      `Mobile: ${order.customer.phone}`,
      `Email: ${order.customer.email}`,
      `Address: ${order.customer.address}, ${order.customer.city}, ${order.customer.province}`,
      `Payment Method: ${order.paymentMethod.toUpperCase()}`,
      `Courier Speed: ${order.shippingMethod.name} (${order.shippingMethod.estimate})`,
      '--------------------------------------------------------------',
      'ITEMS ORDERED:',
      ...order.items.map(
        (it: any, i: number) =>
          `#0${i + 1} ${it.product.name} (Size: ${it.variant.o.join(' / ')}) x ${it.quantity} @ ${formatPkr(it.product.price)} = ${formatPkr(it.product.price * it.quantity)}`
      ),
      '--------------------------------------------------------------',
      `Subtotal: ${order.totals.formattedSubtotal}`,
      `Shipping: ${order.totals.formattedShipping}`,
      `Discount: ${order.totals.formattedDiscount}`,
      `TOTAL PAYABLE: ${order.totals.formattedTotal}`,
      '==============================================================',
      'Thank you for shopping with Runway Pakistan.',
      'WhatsApp Support: +92 300 1234567 | Monday to Saturday 10 AM - 8 PM PKT',
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${order.orderId}-invoice.txt`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  private bindEvents() {
    // Promo code apply
    const promoBtn = this.querySelector('#promo-apply-btn');
    if (promoBtn) {
      promoBtn.addEventListener('click', () => {
        const input = (this.querySelector('#promo-input') as HTMLInputElement)?.value.trim().toUpperCase();
        if (input === 'RUNWAY10' || input === 'PAK10' || input === 'SAVE10') {
          this.promoDiscountPercent = 10;
          this.promoCodeApplied = input;
          shoppingBag.notify(`Promo code ${input} applied: 10% discount`);
          this.render();
        } else if (input.length > 0) {
          shoppingBag.notify('Invalid promo code. Use PAK10 or RUNWAY10');
        }
      });
    }

    // Step 1 -> Step 2 validation
    const toStep2Btn = this.querySelector('#btn-to-step-2');
    if (toStep2Btn) {
      toStep2Btn.addEventListener('click', () => {
        this.captureAddressForm();
        if (this.validateAddressForm()) {
          this.currentStep = 2;
          this.render();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }

    // Step 2 Radio Selection
    this.querySelectorAll('input[name="shipping-method"]').forEach((radio) => {
      radio.addEventListener('change', (e: any) => {
        this.selectedShippingId = e.target.value;
        this.render();
      });
    });

    const backTo1 = this.querySelector('#btn-back-to-1');
    if (backTo1) {
      backTo1.addEventListener('click', () => {
        this.currentStep = 1;
        this.render();
      });
    }

    const toStep3Btn = this.querySelector('#btn-to-step-3');
    if (toStep3Btn) {
      toStep3Btn.addEventListener('click', () => {
        this.currentStep = 3;
        this.render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    const backTo2 = this.querySelector('#btn-back-to-2');
    if (backTo2) {
      backTo2.addEventListener('click', () => {
        this.currentStep = 2;
        this.render();
      });
    }

    // Payment method tab switching
    this.querySelectorAll('.payment-tab-btn').forEach((btn) => {
      btn.addEventListener('click', (e: any) => {
        const method = btn.getAttribute('data-pay-method') as 'cod' | 'bank_transfer' | 'card';
        if (method) {
          this.selectedPaymentMethod = method;
          this.render();
        }
      });
    });

    // Auto-fill test card details
    const fillDemoBtn = this.querySelector('#btn-fill-demo-card');
    if (fillDemoBtn) {
      fillDemoBtn.addEventListener('click', () => {
        this.formData.cardName = `${this.formData.firstName || 'ALI'} ${this.formData.lastName || 'KHAN'}`.toUpperCase();
        this.formData.cardNumber = '4242 4242 4242 4242';
        this.formData.cardExpiry = '12/28';
        this.formData.cardCvv = '842';

        const nameInp = this.querySelector('#checkout-card-name') as HTMLInputElement;
        const numInp = this.querySelector('#checkout-card-num') as HTMLInputElement;
        const expInp = this.querySelector('#checkout-card-expiry') as HTMLInputElement;
        const cvvInp = this.querySelector('#checkout-card-cvv') as HTMLInputElement;

        if (nameInp) nameInp.value = this.formData.cardName;
        if (numInp) numInp.value = this.formData.cardNumber;
        if (expInp) expInp.value = this.formData.cardExpiry;
        if (cvvInp) cvvInp.value = this.formData.cardCvv;

        shoppingBag.notify('Test credit card details populated');
      });
    }

    // Format card input as typed
    const cardNumInp = this.querySelector('#checkout-card-num') as HTMLInputElement;
    if (cardNumInp) {
      cardNumInp.addEventListener('input', (e: any) => {
        e.target.value = formatCreditCardNumber(e.target.value);
        this.formData.cardNumber = e.target.value;
      });
    }

    const expiryInp = this.querySelector('#checkout-card-expiry') as HTMLInputElement;
    if (expiryInp) {
      expiryInp.addEventListener('input', (e: any) => {
        e.target.value = formatExpiry(e.target.value);
        this.formData.cardExpiry = e.target.value;
      });
    }

    // Complete Order Button
    const completeBtn = this.querySelector('#btn-complete-order');
    if (completeBtn) {
      completeBtn.addEventListener('click', () => {
        if (this.selectedPaymentMethod === 'card') {
          this.capturePaymentForm();
          if (this.validatePaymentForm()) {
            this.executeOrderPlacement();
          }
        } else {
          // COD or Bank Transfer
          this.executeOrderPlacement();
        }
      });
    }
  }

  private captureAddressForm() {
    this.formData.email = (this.querySelector('#checkout-email') as HTMLInputElement)?.value.trim() || '';
    this.formData.firstName = (this.querySelector('#checkout-first-name') as HTMLInputElement)?.value.trim() || '';
    this.formData.lastName = (this.querySelector('#checkout-last-name') as HTMLInputElement)?.value.trim() || '';
    this.formData.address = (this.querySelector('#checkout-address') as HTMLInputElement)?.value.trim() || '';
    this.formData.apartment = (this.querySelector('#checkout-apartment') as HTMLInputElement)?.value.trim() || '';
    this.formData.city = (this.querySelector('#checkout-city') as HTMLSelectElement)?.value || 'Karachi';
    this.formData.province = (this.querySelector('#checkout-province') as HTMLSelectElement)?.value || 'Sindh';
    this.formData.postalCode = (this.querySelector('#checkout-postal') as HTMLInputElement)?.value.trim() || '';
    this.formData.phone = (this.querySelector('#checkout-phone') as HTMLInputElement)?.value.trim() || '';
  }

  private validateAddressForm(): boolean {
    let valid = true;

    const emailErr = this.querySelector('#err-email') as HTMLElement;
    if (!isValidEmail(this.formData.email)) {
      if (emailErr) emailErr.style.display = 'block';
      valid = false;
    } else if (emailErr) {
      emailErr.style.display = 'none';
    }

    const phoneErr = this.querySelector('#err-phone') as HTMLElement;
    if (!isValidPakistaniPhone(this.formData.phone)) {
      if (phoneErr) phoneErr.style.display = 'block';
      valid = false;
    } else if (phoneErr) {
      phoneErr.style.display = 'none';
    }

    const checkField = (fieldVal: string, errId: string) => {
      const err = this.querySelector(errId) as HTMLElement;
      if (!fieldVal) {
        if (err) err.style.display = 'block';
        valid = false;
      } else if (err) {
        err.style.display = 'none';
      }
    };

    checkField(this.formData.firstName, '#err-first-name');
    checkField(this.formData.lastName, '#err-last-name');
    checkField(this.formData.address, '#err-address');

    return valid;
  }

  private capturePaymentForm() {
    this.formData.cardName = (this.querySelector('#checkout-card-name') as HTMLInputElement)?.value.trim() || '';
    this.formData.cardNumber = (this.querySelector('#checkout-card-num') as HTMLInputElement)?.value.trim() || '';
    this.formData.cardExpiry = (this.querySelector('#checkout-card-expiry') as HTMLInputElement)?.value.trim() || '';
    this.formData.cardCvv = (this.querySelector('#checkout-card-cvv') as HTMLInputElement)?.value.trim() || '';
  }

  private validatePaymentForm(): boolean {
    let valid = true;
    const nameErr = this.querySelector('#err-card-name') as HTMLElement;
    if (!this.formData.cardName) {
      if (nameErr) nameErr.style.display = 'block';
      valid = false;
    } else if (nameErr) {
      nameErr.style.display = 'none';
    }

    const numErr = this.querySelector('#err-card-num') as HTMLElement;
    const cleanNum = this.formData.cardNumber.replace(/\s+/g, '');
    if (cleanNum.length < 15) {
      if (numErr) numErr.style.display = 'block';
      valid = false;
    } else if (numErr) {
      numErr.style.display = 'none';
    }

    const expErr = this.querySelector('#err-card-expiry') as HTMLElement;
    if (this.formData.cardExpiry.length < 5) {
      if (expErr) expErr.style.display = 'block';
      valid = false;
    } else if (expErr) {
      expErr.style.display = 'none';
    }

    const cvvErr = this.querySelector('#err-card-cvv') as HTMLElement;
    if (this.formData.cardCvv.length < 3) {
      if (cvvErr) cvvErr.style.display = 'block';
      valid = false;
    } else if (cvvErr) {
      cvvErr.style.display = 'none';
    }

    return valid;
  }

  private executeOrderPlacement() {
    const entries = shoppingBag.currentEntries;
    const items = entries
      .map((e) => {
        const match = shoppingBag.findProduct(e.id);
        if (!match) return null;
        return {
          ...match,
          quantity: e.quantity,
        };
      })
      .filter(Boolean);

    const totals = calculateCheckoutTotals(
      shoppingBag.getTotals().subtotal,
      this.selectedShipping.price,
      this.promoDiscountPercent
    );

    const deliveryDays = this.selectedShippingId === 'same_day' ? 0 : this.selectedShippingId === 'express' ? 2 : 4;
    const deliveryDate = new Date(Date.now() + Math.max(1, deliveryDays) * 24 * 60 * 60 * 1000);
    const dateFormatted = deliveryDate.toLocaleDateString('en-PK', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    this.completedOrder = {
      orderId: generateOrderId(),
      date: new Date().toLocaleDateString('en-PK', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      customer: { ...this.formData },
      shippingMethod: this.selectedShipping,
      paymentMethod: this.selectedPaymentMethod,
      estimatedDelivery: dateFormatted,
      items,
      totals,
    };

    // Clear cart now that order is confirmed
    shoppingBag.clear();
    this.currentStep = 4;
    this.render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

if (!customElements.get('store-checkout')) {
  customElements.define('store-checkout', StoreCheckoutElement);
}
