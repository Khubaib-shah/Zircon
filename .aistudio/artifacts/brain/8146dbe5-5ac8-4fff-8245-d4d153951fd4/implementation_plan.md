# Pakistani Context & Simple English Localization Plan

Tailor the existing high-end minimalist storefront for Pakistani customers with clear, accessible everyday language, local currency (Rs. / PKR), Pakistani delivery and payment methods (Cash on Delivery, Bank Transfer, Card), and Karachi/Lahore atelier branding, while keeping the luxury UI layout, styling, and 3D interactions intact.

## User Review & Critical Decisions

> [!IMPORTANT]
> All key product preferences confirmed by the user in Phase 1 have been incorporated into this plan:
> - **Currency**: Pakistani Rupee (`Rs.` / `PKR`) across the entire store, catalog, cart, bundle builder, and checkout summary.
> - **Payment Methods**: Cash on Delivery (COD) as primary option, plus Direct Bank Transfer (Meezan/HBL/Raast) and Visa/Mastercard/PayPak cards.
> - **Brand Identity**: Premium Pakistani streetwear brand with design and production ateliers rooted in Karachi and Lahore.
> - **Tone & Readability**: Simple, friendly, modern English without heavy, archaic vocabulary ("Form Follows Movement", "silhouettes", "loopback", "shuttle-loom", "proportions").

---

## 1. Overview & Core Concept

- **What It Does**: Transforms the website copy, product pricing, form inputs, and checkout experience into an intuitive, high-end Pakistani streetwear storefront.
- **Target Audience**: Pakistani fashion and streetwear enthusiasts across Karachi, Lahore, Islamabad, and nationwide who appreciate high-quality local clothing and want straightforward, frictionless shopping without confusing English or foreign payment barriers.
- **Key Value**: Delivers the visual prestige of an international luxury brand with the comfort, local relevance, and practical payment/delivery options expected by Pakistani consumers.

---

## 2. User Experience & Visual Design

The visual design system (Tailwind CSS, obsidian palette `#151413`, hairline borders `#c8c8c8`, 0px border radius, smooth slide-over sidebar cart, and 3D interactive model carousel) remains **100% identical**. All changes focus on text clarity, localization, and form UX.

### A. Simplified Language & Messaging Map

| Section | Current Complex Copy | New Pakistani Simple & Premium Copy |
| :--- | :--- | :--- |
| **Header Nav** | Runway / Shop / Lookbook / About | Runway / Shop / Lookbook / Our Story |
| **Runway Panel** | "In this look · 3 pieces" / "Bundle all 3 and save 10%" | "Complete Look · 3 items" / "Buy the full look & get 10% off" |
| **Runway CTA** | "Add full look to bag" | "Add full look to bag — Rs. 42,500" |
| **Section 01 (Gallery)** | "01 / EDITORIAL CAMPAIGN — Runway Perspectives. Modern streetwear tailoring, fluid drape..." | "01 / STORE LOOKS — Real Photos from Our Studio. Check out our latest streetwear pieces shot at our Lahore & Karachi studios." |
| **Section 02 (Catalog)** | "02 / ARCHIVE COLLECTION — Complete Collection. Curated for individual styling." | "02 / ALL CLOTHES & SHOES — Everything in Stock. Find your favorite oversized hoodies, sweatshirts, tees, and sneakers." |
| **Section 03 (Manifesto)** | "03 / BRAND MANIFESTO — Form Follows Movement. Architectural silhouettes crafted with disciplined minimalism..." | "03 / OUR QUALITY PROMISE — Made in Pakistan, Made to Last. Premium streetwear made from 100% heavy combed cotton in small batches in Karachi & Lahore." |
| **Pillars** | Textile Rigor / Pattern Density / Atelier Craft | 100% Heavy Cotton / Modern Relaxed Fit / Hand-Finished in Pakistan |
| **Sidebar Cart** | "Review your curated look or archive pieces. Proceed to secure multi-step checkout." | "Check your items below. Free delivery across Pakistan on orders over Rs. 10,000." |
| **Size Guide** | "Tailoring measurement tolerances ±0.5cm" | "Standard Pakistani & International Sizes. Easy 7-day size exchange across Pakistan." |
| **Customer Care** | "Atelier client concierge" | "Help & Support — WhatsApp: 0300-1234567 (10 AM to 8 PM PKT)" |

### B. Pakistani Pricing Structure (PKR)

Realistic luxury Pakistani streetwear price tier:
- **T-Shirt (Graphic / Oversized)**: Rs. 6,500
- **Fleece Sweatshirt**: Rs. 14,500
- **Heavyweight Hoodie / Black Hoodie**: Rs. 16,500
- **Retro Sneakers / Orbit Footwear / Luka 5**: Rs. 24,500
- **3-Piece Outfit Bundles**: Rs. 42,500 (with automatic 10% bundle savings)
- **Standard Courier Delivery (TCS / Trax / Call Courier)**: Free on orders over Rs. 10,000 (otherwise Rs. 300)
- **Express Delivery (Same-day Karachi & Lahore)**: Rs. 600

---

## 3. Pakistani Checkout & Form UX

```
┌─────────────────────────────────────────────────────────────┐
│                 SECURE CHECKOUT — STEP 1 OF 3               │
│                                                             │
│ Full Name:          [ Hamza Khan                          ] │
│ Phone (for rider):  [ 0300-1234567                        ] │
│ Email Address:      [ hamza@example.com                   ] │
│ Delivery Address:   [ House 45, Street 8, Phase 6, DHA    ] │
│ City:               [ Karachi ▼ ]  (Karachi/Lahore/Isb...)  │
│ Province:           [ Sindh   ▼ ]  (Sindh/Punjab/KPK...)    │
│ Postal Code:        [ 75500                               ] │
│ Delivery Note:      [ Near Nishat Commercial              ] │
└─────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────┐
│                 PAYMENT METHOD — STEP 2 OF 3                │
│                                                             │
│ (●) Cash on Delivery (COD)                                  │
│     Pay cash directly to the rider at your door.             │
│                                                             │
│ ( ) Online Bank Transfer (Raast / Meezan / HBL)             │
│     Send payment directly to our official company account.  │
│                                                             │
│ ( ) Debit / Credit Card (Visa, Mastercard, PayPak)          │
│     Secure online payment via Pakistani bank cards.         │
└─────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────┐
│                 ORDER CONFIRMATION — STEP 3 OF 3            │
│                                                             │
│ Order Reference: #PK-2026-89412                             │
│ Tracking via TCS / Trax Express Courier                     │
│ SMS & WhatsApp update sent to 0300-1234567                  │
└─────────────────────────────────────────────────────────────┘
```

- **Pakistani City Dropdown**: Quick pick for top cities: Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, Sialkot, Gujranwala, Hyderabad, and "Other City".
- **Local Mobile Format**: Formatted with Pakistani prefix `03xx-xxxxxxx` with clear guidance.
- **Payment Method Switching**:
  - Selecting **Cash on Delivery** removes unnecessary card fields and adds a friendly note: *"Please keep exact cash ready for the delivery rider."*
  - Selecting **Bank Transfer** shows account details: *"Bank: Meezan Bank | Account Title: Runway Pakistan Pvt Ltd | IBAN: PK45MEZN0001234567890101 | Raast ID: 03001234567"*.
  - Selecting **Debit / Credit Card** presents clean, secure card number, expiry, and CVV fields supporting Pakistani Visa, Mastercard, and PayPak cards.

---

## 4. Technical Implementation Steps

1. **`src/runway-logic.ts` & `src/catalog-data.ts`**:
   - Update `formatUsd` / currency formatter to `formatPkr` (`Rs. 14,500`).
   - Update product prices, bundle calculations, and shipping rules for PKR.
   - Update helper validation for Pakistani phone numbers (`^03[0-9]{2}-?[0-9]{7}$`).
2. **`src/shopping-bag.ts`**:
   - Update inlined catalog data with PKR pricing and simplified descriptions.
   - Update text messages ("Saved to bag", "Free delivery across Pakistan on orders over Rs. 10,000").
   - Update shortlist text export to format prices in PKR and cite local customer care details.
3. **`src/components/store-checkout.ts`**:
   - Integrate Pakistani cities, province selectors, local phone helper, and 3 payment modes (Cash on Delivery, Bank Transfer, Card).
   - Dynamic form display based on selected payment method.
   - Generate order confirmation receipts formatted in PKR with TCS/Trax delivery tracking notices.
4. **`src/gallery-component.ts` & `src/catalog-component.ts`**:
   - Replace complex editorial copy with warm, straightforward Pakistani English.
   - Reference Karachi and Lahore design studios.
5. **`src/components/manifesto-strip.ts` & `src/components/store-footer.ts`**:
   - Update manifesto with simple quality promise (100% heavy cotton, modern relaxed fit, hand-finished in Pakistan).
   - Update footer with Pakistani contact details (WhatsApp support, Karachi DHA studio, Lahore Gulberg atelier, nationwide courier info).
6. **Unit Tests & Verification**:
   - Update test suites in `src/runway-logic.test.ts` to validate PKR calculation, phone validation, and COD payment totals.
   - Co-execute `compile_applet` and `lint_applet` to verify clean build.
