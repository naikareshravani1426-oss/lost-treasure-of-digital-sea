import React from 'react';
import Header from '../components/Header';
import { SkullCutlasses, CompassRose } from '../components/OrnateIcons';
import { Lock, Anchor, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audio';

export default function Round2PlaceholderScreen({
  crewName,
  status,
  completionTime,
  crackedPassword,
  onReset
}) {
  return (
    <div className="screen-round2-wrapper">
      <Header crewName={crewName} badgeText="ROUND 2 PREPARATION" />

      <main className="round2-body-container">
        <div className="round2-parchment-card">
          <div className="round2-watermark-left">
            <CompassRose size={64} opacity={0.3} />
          </div>
          <div className="round2-watermark-right">
            <CompassRose size={64} opacity={0.3} />
          </div>

          <div className="round2-crest">
            <SkullCutlasses size={60} />
          </div>

          <h2 className="round2-title">ROUND 2 — THE FINAL PASSWORD</h2>

          <div className="round2-status-banner">
            <Lock size={20} className="round2-lock-icon" />
            <span>Await organizer instructions.</span>
          </div>

          <p className="round2-explanation">
            Crew <strong>{crewName ? crewName.toUpperCase() : "PIRATES"}</strong> has concluded Round 1.
            Keep your stations, review your crew strategy, and await the signal from the game master to begin Round 2.
          </p>

          <div className="round2-summary-box">
            <div className="summary-item">
              <span className="summary-label">Mission 1 Status:</span>
              <span className={`summary-status ${status === 'success' ? 'status-won' : 'status-timeout'}`}>
                {status === 'success' ? 'SUCCESSFULLY CRACKED' : 'TIMED OUT (+00:30 PENALTY)'}
              </span>
            </div>
            {status === 'success' && (
              <div className="summary-item">
                <span className="summary-label">Secret Password:</span>
                <span className="summary-val">{crackedPassword}</span>
              </div>
            )}
            <div className="summary-item">
              <span className="summary-label">Recorded Time:</span>
              <span className="summary-val">{status === 'success' ? completionTime : '02:30'}</span>
            </div>
          </div>

          <div className="round2-actions">
            <button
              onClick={() => {
                sound.playClick();
                if (window.confirm("Start a new game session for next team?")) {
                  onReset();
                }
              }}
              className="pirate-btn pirate-btn-secondary"
            >
              <Anchor size={18} />
              <span>RETURN TO DOCK (NEW CREW)</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
