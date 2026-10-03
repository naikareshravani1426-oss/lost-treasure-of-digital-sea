import React from 'react';
import { GoldenHelm, SmallSkull } from './OrnateIcons';
import { Users } from 'lucide-react';

export default function Header({ crewName = "", badgeText = "PASSWORD BREAKER", showCrewBadge = true, onReset }) {
  return (
    <header className="pirate-header">
      {/* Left Branding Group */}
      <div className="branding-group">
        <div className="helm-wrapper">
          <GoldenHelm size={54} className="helm-spin-subtle" />
        </div>
        
        <div className="title-stack">
          <div className="event-subtitle">
            <span className="star-flourish">✦</span>
            TECHNITUDE 2026
            <span className="star-flourish">✦</span>
          </div>
          
          <h1 className="game-title">
            THE LOST TREASURE<br />
            <span className="of-digital-sea">OF DIGITAL SEA</span>
          </h1>

          {badgeText && (
            <div className="badge-ribbon">
              <SmallSkull size={14} className="badge-skull" />
              <span>{badgeText}</span>
              <SmallSkull size={14} className="badge-skull" />
            </div>
          )}
        </div>
      </div>

      {/* Right Crew Badge */}
      {showCrewBadge && (
        <div className="crew-badge-container">
          <div className="crew-badge">
            <Users className="crew-icon" size={18} />
            <span className="crew-label">CREW :</span>
            <span className="crew-name" title={crewName || "PIRATES"}>
              {crewName ? crewName.toUpperCase() : "PIRATES"}
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
