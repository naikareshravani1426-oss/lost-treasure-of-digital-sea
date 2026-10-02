import React, { useEffect } from 'react';
import Header from '../components/Header';
import { SkullCutlasses, PirateShipIcon, CompassRose } from '../components/OrnateIcons';
import { Users, KeyRound, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

export default function SuccessScreen({ crewName, crackedPassword, completionTime, onContinue }) {
  useEffect(() => {
    // Grand pirate celebration confetti
    try {
      const count = 200;
      const defaults = {
        origin: { y: 0.7 }
      };

      function fire(particleRatio, opts) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
          colors: ['#ffd700', '#ffaa00', '#ff4500', '#ffffff', '#e5c158', '#b8860b']
        });
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    } catch (e) {
      // Ignore if confetti blocked
    }
  }, []);

  const handleContinue = () => {
    sound.playClick();
    onContinue();
  };

  return (
    <div className="screen-success-wrapper">
      <Header crewName={crewName} badgeText="THE FIRST CLUE" />

      {/* Grand Top Banner */}
      <div className="success-banner-container">
        <div className="success-banner-scroll">
          <div className="banner-skull-crest">
            <SkullCutlasses size={64} />
          </div>
          <h2 className="success-banner-title">MISSION 1 COMPLETED!</h2>
          <div className="success-banner-subtitle">
            Congratulations, Pirates!
          </div>
          <div className="success-banner-crew">
            {crewName ? crewName.toUpperCase() : "PIRATES"}
          </div>
        </div>
      </div>

      {/* Main Content: Open Chest on Left, Result Card on Right */}
      <main className="success-body-layout">
        {/* OPEN TREASURE CHEST SCENE */}
        <div className="open-chest-presentation">
          <div className="chest-visual-wrapper chest-open-anim">
            <img
              src="/assets/images/bg_open_chest.jpg"
              alt="Open Pirate Treasure Chest"
              className="open-chest-image"
            />
            {/* Animated Golden Light Rays & Shimmer Overlay */}
            <div className="golden-god-rays"></div>
            <div className="chest-sparkle-layer"></div>
          </div>
        </div>

        {/* RESULTS PANEL */}
        <div className="result-panel-container">
          <div className="wood-panel-frame result-scroll-card">
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

              {/* Cracked Password */}
              <div className="result-data-row">
                <div className="result-row-icon">
                  <KeyRound size={28} className="res-icon" />
                </div>
                <div className="result-row-content">
                  <div className="result-label">CRACKED PASSWORD</div>
                  <div className="result-value password-val">
                    {crackedPassword ? crackedPassword.toUpperCase() : "CYBERPUNK"}
                  </div>
                </div>
              </div>

              <div className="result-row-divider" />

              {/* Time Taken */}
              <div className="result-data-row">
                <div className="result-row-icon">
                  <Clock size={28} className="res-icon" />
                </div>
                <div className="result-row-content">
                  <div className="result-label">TIME TAKEN</div>
                  <div className="result-value time-val">
                    {completionTime || "01:17"}
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
      <div className="success-footer-actions">
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
