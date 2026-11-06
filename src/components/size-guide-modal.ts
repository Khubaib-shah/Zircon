/**
 * Size Guide Modal Component (<size-guide-modal>)
 * Interactive sizing charts with imperial/metric (in/cm) toggle,
 * measurements for Tops, Bottoms, and Footwear, and model fit notes.
 */

export class SizeGuideModalElement extends HTMLElement {
  private unit: 'in' | 'cm' = 'in';

  connectedCallback() {
    this.render();
  }

  public open() {
    const dialog = this.querySelector('#size-guide-dialog') as HTMLDialogElement | null;
    if (dialog && typeof dialog.showModal === 'function') {
      dialog.showModal();
    }
  }

  public close() {
    const dialog = this.querySelector('#size-guide-dialog') as HTMLDialogElement | null;
    if (dialog && typeof dialog.close === 'function') {
      dialog.close();
    }
  }

  private render() {
    const isCm = this.unit === 'cm';
    const mult = isCm ? 2.54 : 1;
    const format = (valInches: number) => {
      const v = valInches * mult;
      return isCm ? `${Math.round(v)} cm` : `${valInches}"`;
    };

    this.innerHTML = `
      <dialog id="size-guide-dialog" class="size-guide-dialog">
        <div class="size-modal-header">
          <h2 class="size-modal-title">Garment Sizing & Fit Guide</h2>
          <button type="button" class="size-modal-close" id="close-size-modal" aria-label="Close size guide">×</button>
        </div>

        <div class="size-modal-body">
          <div class="size-unit-toggle">
            <button type="button" class="unit-btn ${this.unit === 'in' ? 'is-active' : ''}" id="btn-unit-in">
              INCHES (IN)
            </button>
            <button type="button" class="unit-btn ${this.unit === 'cm' ? 'is-active' : ''}" id="btn-unit-cm">
              CENTIMETERS (CM)
            </button>
          </div>

          <!-- Tops Table -->
          <div class="size-table-container">
            <div class="size-table-title">Tops & Outerwear (Hoodies, Sweatshirts, Tees)</div>
            <table class="size-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Chest Width</th>
                  <th>Body Length</th>
                  <th>Sleeve Length</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>S</strong></td>
                  <td>${format(22.5)}</td>
                  <td>${format(27.0)}</td>
                  <td>${format(33.5)}</td>
                </tr>
                <tr>
                  <td><strong>M</strong></td>
                  <td>${format(24.0)}</td>
                  <td>${format(28.0)}</td>
                  <td>${format(34.5)}</td>
                </tr>
                <tr>
                  <td><strong>L</strong></td>
                  <td>${format(25.5)}</td>
                  <td>${format(29.0)}</td>
                  <td>${format(35.5)}</td>
                </tr>
                <tr>
                  <td><strong>XL</strong></td>
                  <td>${format(27.0)}</td>
                  <td>${format(30.0)}</td>
                  <td>${format(36.5)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Footwear Conversion Table -->
          <div class="size-table-container">
            <div class="size-table-title">Footwear Conversion (Air Jordan 12, Tatum 5, Luka 5)</div>
            <table class="size-table">
              <thead>
                <tr>
                  <th>EU Size</th>
                  <th>US Men</th>
                  <th>UK</th>
                  <th>Foot Length</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>40</td><td>7.0</td><td>6.0</td><td>25.0 cm</td></tr>
                <tr><td>41</td><td>8.0</td><td>7.0</td><td>26.0 cm</td></tr>
                <tr><td>42</td><td>8.5</td><td>7.5</td><td>26.5 cm</td></tr>
                <tr><td>43</td><td>9.5</td><td>8.5</td><td>27.5 cm</td></tr>
                <tr><td>44</td><td>10.0</td><td>9.0</td><td>28.0 cm</td></tr>
                <tr><td>45</td><td>11.0</td><td>10.0</td><td>29.0 cm</td></tr>
                <tr><td>46</td><td>12.0</td><td>11.0</td><td>30.0 cm</td></tr>
              </tbody>
            </table>
          </div>

          <div class="size-fit-notes">
            <strong style="color: #151413; display: block; margin-bottom: 6px;">HOW IT FITS:</strong>
            All our hoodies, sweatshirts, and t-shirts have a relaxed drop-shoulder cut. It is loose and comfortable. 
            If you like a normal regular fit, pick one size smaller. If you want the relaxed oversized look, pick your usual size.
            Need help with your size? Message us directly on WhatsApp at +92 300 1234567. We offer easy 7-day size exchanges all over Pakistan.
          </div>
        </div>
      </dialog>
    `;

    this.querySelector('#close-size-modal')?.addEventListener('click', () => {
      this.close();
    });

    this.querySelector('#btn-unit-in')?.addEventListener('click', () => {
      this.unit = 'in';
      this.render();
      this.open();
    });

    this.querySelector('#btn-unit-cm')?.addEventListener('click', () => {
      this.unit = 'cm';
      this.render();
      this.open();
    });

    const dialog = this.querySelector('#size-guide-dialog') as HTMLDialogElement | null;
    if (dialog) {
      dialog.addEventListener('click', (event) => {
        if (event.target === dialog) dialog.close();
      });
    }
  }
}

if (!customElements.get('size-guide-modal')) {
  customElements.define('size-guide-modal', SizeGuideModalElement);
}
