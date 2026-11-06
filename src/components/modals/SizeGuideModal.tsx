import React, { useState } from 'react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  if (!isOpen) return null;

  const isCm = unit === 'cm';
  const mult = isCm ? 2.54 : 1;
  const format = (valInches: number) => {
    const v = valInches * mult;
    return isCm ? `${Math.round(v)} cm` : `${valInches}"`;
  };

  return (
    <div className="bag-modal-overlay" onClick={onClose}>
      <dialog
        id="size-guide-dialog"
        className="size-guide-dialog"
        open
        onClick={(e) => e.stopPropagation()}
      >
        <div className="size-modal-header">
          <h2 className="size-modal-title">Size Guide</h2>
          <button
            type="button"
            className="size-modal-close"
            id="close-size-modal"
            aria-label="Close size guide"
            onClick={onClose}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="size-modal-body">
          <div className="size-unit-toggle">
            <button
              type="button"
              className={`unit-btn ${unit === 'in' ? 'is-active' : ''}`}
              onClick={() => setUnit('in')}
            >
              INCHES (IN)
            </button>
            <button
              type="button"
              className={`unit-btn ${unit === 'cm' ? 'is-active' : ''}`}
              onClick={() => setUnit('cm')}
            >
              CENTIMETERS (CM)
            </button>
          </div>

          <div className="size-table-container">
            <div className="size-table-title">Apparel (Hoodies, Sweatshirts, Tees)</div>
            <table className="size-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Chest</th>
                  <th>Length</th>
                  <th>Sleeve</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>S</strong></td>
                  <td>{format(22.5)}</td>
                  <td>{format(27.0)}</td>
                  <td>{format(33.5)}</td>
                </tr>
                <tr>
                  <td><strong>M</strong></td>
                  <td>{format(24.0)}</td>
                  <td>{format(28.0)}</td>
                  <td>{format(34.5)}</td>
                </tr>
                <tr>
                  <td><strong>L</strong></td>
                  <td>{format(25.5)}</td>
                  <td>{format(29.0)}</td>
                  <td>{format(35.5)}</td>
                </tr>
                <tr>
                  <td><strong>XL</strong></td>
                  <td>{format(27.0)}</td>
                  <td>{format(30.0)}</td>
                  <td>{format(36.5)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="size-table-container">
            <div className="size-table-title">Footwear</div>
            <table className="size-table">
              <thead>
                <tr>
                  <th>EU</th>
                  <th>US</th>
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

          <div className="size-fit-notes">
            <strong style={{ color: '#151413', display: 'block', marginBottom: '6px' }}>
              FIT NOTES
            </strong>
            Apparel is cut with a relaxed fit. Choose your standard size for a relaxed silhouette, or size down for a closer fit.
          </div>
        </div>
      </dialog>
    </div>
  );
};

