import React, { useState } from 'react';
import { GoldenHelm, CompassRose, PirateShipIcon, CrossedSwords, SmallSkull } from '../components/OrnateIcons';
import { sound } from '../utils/audio';

export default function LandingScreen({ onBoardShip, initialCrewName = "" }) {
  const [crewName, setCrewName] = useState(initialCrewName);
  const [errorMsg, setErrorMsg] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const trimmed = crewName.trim();
    if (!trimmed) {
      sound.playError();
      setErrorMsg("Ahoy! Every crew needs a name before setting sail!");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    sound.playClick();
    setErrorMsg("");
    onBoardShip(trimmed);
  };

  return (
    <div className="screen-landing-container">
      {/* Top Grand Title & Wheel */}
      <div className="landing-hero-branding">
        <div className="landing-event-tag">
          <span className="star-flourish">✦</span>
          TECHNITUDE 2026
          <span className="star-flourish">✦</span>
        </div>

        <div className="landing-title-row">
          <div className="landing-helm-wrapper">
            <GoldenHelm size={84} className="helm-spin-subtle" />
          </div>
          <div className="landing-title-text">
            <h1 className="landing-main-title">
              THE LOST TREASURE<br />
              <span className="of-digital-sea">OF DIGITAL SEA</span>
            </h1>
          </div>
        </div>

        <div className="landing-skull-separator">
          <span className="sep-line"></span>
          <SmallSkull size={22} />
          <span className="sep-line"></span>
        </div>
      </div>

      {/* Main Parchment Box */}
      <div className={`landing-parchment-card ${isShaking ? 'shake-anim' : ''}`}>
        {/* Decorative Compass Star Accents */}
        <div className="parchment-watermark watermark-left">
          <CompassRose size={72} opacity={0.35} />
        </div>
        <div className="parchment-watermark watermark-right">
          <CompassRose size={72} opacity={0.35} />
        </div>

        {/* Parchment Heading */}
        <h2 className="parchment-title">
          NAME YOUR CREW,<br />
          <span className="highlight-pirates">PIRATES!</span>
        </h2>

        <div className="parchment-divider">
          <SmallSkull size={18} />
        </div>

        <p className="parchment-subtext">
          Every legendary crew needs a name before setting sail.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="crew-input-form">
          <div className="wood-input-wrapper">
            <div className="input-ship-icon">
              <PirateShipIcon size={26} />
            </div>
            <input
              type="text"
              id="crew-name-input"
              className="wood-text-input"
              placeholder="Enter your team name..."
              value={crewName}
              onChange={(e) => {
                setCrewName(e.target.value);
                if (errorMsg) setErrorMsg("");
              }}
              autoFocus
              maxLength={32}
              autoComplete="off"
            />
          </div>

          {errorMsg && (
            <div className="input-validation-error">
              <span className="error-icon">⚠️</span>
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            id="board-ship-btn"
            className="pirate-btn pirate-btn-primary"
          >
            <CrossedSwords size={22} className="btn-swords-icon" />
            <span className="btn-text">BOARD THE SHIP</span>
          </button>
        </form>
      </div>
    </div>
  );
}
