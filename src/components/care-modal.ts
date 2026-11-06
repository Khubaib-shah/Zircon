/**
 * Customer Care & Shipping / Returns Modal Component (<care-modal>)
 * Delivers policies on delivery dispatch, complimentary 14-day returns,
 * garment laundering guidelines, and atelier contact concierge.
 */

export class CareModalElement extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  public open() {
    const dialog = this.querySelector('#care-dialog') as HTMLDialogElement | null;
    if (dialog && typeof dialog.showModal === 'function') {
      dialog.showModal();
    }
  }

  public close() {
    const dialog = this.querySelector('#care-dialog') as HTMLDialogElement | null;
    if (dialog && typeof dialog.close === 'function') {
      dialog.close();
    }
  }

  private render() {
    this.innerHTML = `
      <dialog id="care-dialog" class="care-dialog">
        <div class="care-modal-header">
          <h2 class="care-modal-title">Client Services & Policies</h2>
          <button type="button" class="care-modal-close" id="close-care-modal" aria-label="Close care modal">×</button>
        </div>

        <div class="care-modal-body">
          <div class="care-section">
            <h3 class="care-section-title">01 / Nationwide Delivery in Pakistan</h3>
            <p class="care-section-text">
              We deliver to all cities in Pakistan using TCS, Trax, and Leopard Couriers. Karachi and Lahore deliveries take 1 to 2 working days. All other cities (Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, etc.) take 2 to 4 working days. You get SMS and WhatsApp tracking as soon as your parcel leaves our studio.
            </p>
          </div>

          <div class="care-section">
            <h3 class="care-section-title">02 / Easy 7-Day Size Exchanges</h3>
            <p class="care-section-text">
              If the size does not fit or you want to exchange, message our WhatsApp team within 7 days. We will arrange a replacement parcel right to your doorstep. Items must be unworn and unwashed with original tags attached.
            </p>
          </div>

          <div class="care-section">
            <h3 class="care-section-title">03 / Washing & Care Instructions</h3>
            <p class="care-section-text">
              To keep the heavy cotton soft and deep in color:
              <br /><br />
              • Turn clothes inside-out before washing.<br />
              • Wash with normal cold water in gentle machine cycle.<br />
              • Do not use strong bleach or dry in extreme direct sunlight.<br />
              • Iron inside-out on medium heat.
            </p>
          </div>

          <div class="care-section">
            <h3 class="care-section-title">04 / Need Help? Contact WhatsApp Support</h3>
            <p class="care-section-text">
              Our customer team is available Monday to Saturday (10 AM to 8 PM PKT). Message us on WhatsApp at <strong>+92 300 1234567</strong> or email <strong>support@trythelook.pk</strong>.
            </p>
          </div>
        </div>
      </dialog>
    `;

    this.querySelector('#close-care-modal')?.addEventListener('click', () => {
      this.close();
    });

    const dialog = this.querySelector('#care-dialog') as HTMLDialogElement | null;
    if (dialog) {
      dialog.addEventListener('click', (event) => {
        if (event.target === dialog) dialog.close();
      });
    }
  }
}

if (!customElements.get('care-modal')) {
  customElements.define('care-modal', CareModalElement);
}
