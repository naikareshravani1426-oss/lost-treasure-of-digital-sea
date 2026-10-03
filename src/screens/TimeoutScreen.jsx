/**
 * TimeoutScreen.jsx — Round I: TIMEOUT
 *
 * Shows: crew name, time taken (actual 02:30 if bonus used), attempts, extra-30-sec status.
 * Continue button → Round II.
 */
import React from 'react';
import Header from '../components/Header';
import { SkullCutlasses, PirateShipIcon, CompassRose } from '../components/OrnateIcons';
import { Users, Hourglass, RefreshCw, Shield } from 'lucide-react';
import { sound } from '../utils/audio';

export default function TimeoutScreen({
  crewName,
  completionTime = '02:00',
  attempts       = 0,
  penaltyTime    = 30,
  onContinue,
  onReset,
}) {
  const handleContinue = () => {
    sound.playClick();
    onContinue();
  };

  return (
    <div className="screen-timeout-wrapper">
      <Header crewName={crewName} badgeText="THE FIRST CLUE" onReset={onReset} />

      {/* Banner */}
      <div className="timeout-banner-container">
        <div className="timeout-banner-scroll">
          <div className="banner-skull-crest"><SkullCutlasses size={64} /></div>
          <h2 className="timeout-banner-title">TIME'S UP, PIRATES!</h2>
          <div className="timeout-banner-subtitle">The treasure remains locked.</div>
          <div className="timeout-banner-subtext">
            Your crew did not crack the password in time. A +30s penalty has been recorded!
          </div>
        </div>
      </div>

      {/* Body */}
      <main className="timeout-body-layout">
        <div className="locked-chest-presentation">
          <div className="chest-visual-wrapper chest-locked-anim">
            <img src="/assets/images/bg_locked_chest.jpg"
              alt="Locked Pirate Treasure Chest with Chains" className="locked-chest-image" />
            <div className="locked-red-glow-overlay" />
            <div className="locked-smoke-layer" />
          </div>
        </div>

        <div className="result-panel-container">
          <div className="wood-panel-frame result-scroll-card timeout-card-border">
            <div className="result-watermark-top"><CompassRose size={36} opacity={0.3} /></div>

            <div className="result-rows-group">
              {/* Crew */}
              <div className="result-data-row">
                <div className="result-row-icon"><Users size={28} className="res-icon" /></div>
                <div className="result-row-content">
                  <div className="result-label">CREW NAME</div>
                  <div className="result-value crew-val">
                    {crewName ? crewName.toUpperCase() : 'PIRATES'}
                  </div>
                </div>
              </div>
              <div className="result-row-divider" />

              {/* Time */}
              <div className="result-data-row">
                <div className="result-row-icon"><Hourglass size={28} className="res-icon" /></div>
                <div className="result-row-content">
                  <div className="result-label">ROUND 1 TIME</div>
                  <div className="result-value recorded-val-bold">{completionTime}</div>
                </div>
              </div>
              <div className="result-row-divider" />

              {/* Attempts */}
              <div className="result-data-row">
                <div className="result-row-icon"><RefreshCw size={28} className="res-icon" /></div>
                <div className="result-row-content">
                  <div className="result-label">ATTEMPTS</div>
                  <div className="result-value">{attempts}</div>
                </div>
              </div>
              <div className="result-row-divider" />

              {/* Penalty */}
              <div className="result-data-row">
                <div className="result-row-icon"><Shield size={28} className="res-icon penalty-icon-red" /></div>
                <div className="result-row-content">
                  <div className="result-label penalty-label-red">PENALTY ADDED</div>
                  <div className="result-value penalty-val-red">
                    +{penaltyTime || 30} SEC
                  </div>
                </div>
              </div>
            </div>

            <div className="result-watermark-bottom"><CompassRose size={36} opacity={0.3} /></div>
          </div>
        </div>
      </main>

      <div className="timeout-footer-actions">
        <button id="continue-voyage-btn" onClick={handleContinue}
          className="pirate-btn pirate-btn-primary continue-btn">
          <PirateShipIcon size={24} className="btn-ship-icon" />
          <span className="btn-text">CONTINUE THE VOYAGE &gt;&gt;</span>
        </button>
      </div>
    </div>
  );
}
