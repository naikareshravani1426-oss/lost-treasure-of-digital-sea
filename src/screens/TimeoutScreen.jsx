import React from 'react';
import Header from '../components/Header';
import { SkullCutlasses, PirateShipIcon, CompassRose } from '../components/OrnateIcons';
import { Users, Lock, AlertTriangle, Hourglass } from 'lucide-react';
import { sound } from '../utils/audio';

export default function TimeoutScreen({ crewName, onContinue }) {
  const handleContinue = () => {
    sound.playClick();
    onContinue();
  };

  return (
    <div className="screen-timeout-wrapper">
      <Header crewName={crewName} badgeText="THE FIRST CLUE" />

      {/* Top Warning Banner */}
      <div className="timeout-banner-container">
        <div className="timeout-banner-scroll">
          <div className="banner-skull-crest">
            <SkullCutlasses size={64} />
          </div>
          <h2 className="timeout-banner-title">TIME’S UP, PIRATES!</h2>
          <div className="timeout-banner-subtitle">
            The treasure remains locked.
          </div>
          <div className="timeout-banner-subtext">
            Your crew could not crack the password in time.
          </div>
        </div>
      </div>

      {/* Main Content: Locked Chest on Left, Result Card on Right */}
      <main className="timeout-body-layout">
        {/* CLOSED TREASURE CHEST SCENE */}
        <div className="locked-chest-presentation">
          <div className="chest-visual-wrapper chest-locked-anim">
            <img
              src="/assets/images/bg_locked_chest.jpg"
              alt="Locked Pirate Treasure Chest with Chains"
              className="locked-chest-image"
            />
            {/* Ominous red glow and smoke overlay */}
            <div className="locked-red-glow-overlay"></div>
            <div className="locked-smoke-layer"></div>
          </div>
        </div>

        {/* RESULTS PANEL */}
        <div className="result-panel-container">
          <div className="wood-panel-frame result-scroll-card timeout-card-border">
            <div className="result-watermark-top">
              <CompassRose size={36} opacity={0.3} />
            </div>

            <div className="result-rows-group">
              {/* Crew Name */}
              <div className="result-data-row">
                <div className="result-row-icon">
                  <Users size={28} className="res-icon" />
                </div>
                <div className="result-row-content">
                  <div className="result-label">CREW NAME</div>
                  <div className="result-value crew-val">
                    {crewName ? crewName.toUpperCase() : "PIRATES"}
                  </div>
                </div>
              </div>

              <div className="result-row-divider" />

              {/* Password Breaker Time */}
              <div className="result-data-row">
                <div className="result-row-icon">
                  <Lock size={28} className="res-icon" />
                </div>
                <div className="result-row-content">
                  <div className="result-label">PASSWORD BREAKER TIME</div>
                  <div className="result-value">
                    02:00
                  </div>
                </div>
              </div>

              <div className="result-row-divider" />

              {/* Penalty */}
              <div className="result-data-row">
                <div className="result-row-icon">
                  <AlertTriangle size={28} className="res-icon penalty-icon-red" />
                </div>
                <div className="result-row-content">
                  <div className="result-label penalty-label-red">PENALTY</div>
                  <div className="result-value penalty-val-red">
                    +00:30
                  </div>
                </div>
              </div>

              <div className="result-row-divider" />

              {/* Recorded Time */}
              <div className="result-data-row">
                <div className="result-row-icon">
                  <Hourglass size={28} className="res-icon" />
                </div>
                <div className="result-row-content">
                  <div className="result-label">RECORDED TIME</div>
                  <div className="result-value recorded-val-bold">
                    02:30
                  </div>
                </div>
              </div>
            </div>

            <div className="result-watermark-bottom">
              <CompassRose size={36} opacity={0.3} />
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Button */}
      <div className="timeout-footer-actions">
        <button
          id="continue-voyage-btn"
          onClick={handleContinue}
          className="pirate-btn pirate-btn-primary continue-btn"
        >
          <PirateShipIcon size={24} className="btn-ship-icon" />
          <span className="btn-text">CONTINUE THE VOYAGE &gt;&gt;</span>
        </button>
      </div>
    </div>
  );
}
