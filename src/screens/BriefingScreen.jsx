import React from 'react';
import { sound } from '../utils/audio';

export default function BriefingScreen({ crewName, onStartMission, onReset }) {
  const handleStart = () => {
    sound.playClick();
    onStartMission();
  };

  return (
    <div className="rb-exact-container" id="briefing-screen">
      {/* Floating Home / Reset Button */}
      {onReset && (
        <button
          onClick={onReset}
          className="rb-floating-home-btn"
          title="Back to Home"
          aria-label="Back to Home"
        >
          🏠 HOME
        </button>
      )}

      {/* Main Image Poster Frame matching user's exact photo */}
      <div className="rb-poster-wrapper">
        <img
          src="/assets/images/rulebook_poster.jpg"
          alt="TECHNITUDE 2026 - Lost Treasure of Legacy - Mission 1 Rule Book"
          className="rb-poster-img"
        />

        {/* Interactive START MISSION 1 Button Overlay anchored at bottom */}
        <div className="rb-poster-action-overlay">
          <button
            id="start-mission-btn"
            onClick={handleStart}
            className="rb-start-mission-poster-btn"
            aria-label="Start Mission 1"
            type="button"
          >
            <span className="rb-btn-ship-icon" aria-hidden="true">⛵</span>
            <span className="rb-btn-text">START MISSION 1 &gt;&gt;</span>
          </button>
        </div>
      </div>
    </div>
  );
}
