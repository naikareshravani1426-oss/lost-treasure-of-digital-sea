import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import { CompassRose, CrossedSwords, SmallSkull, PirateShipIcon } from '../components/OrnateIcons';
import { Hourglass, AlertCircle } from 'lucide-react';
import { sound } from '../utils/audio';

export default function GameplayScreen({
  crewName,
  question,
  missionStartTime,
  onSuccess,
  onTimeout
}) {
  const TOTAL_DURATION_SECONDS = 120; // 02:00
  const [secondsRemaining, setSecondsRemaining] = useState(() => {
    if (!missionStartTime) return TOTAL_DURATION_SECONDS;
    const elapsed = Math.floor((Date.now() - missionStartTime) / 1000);
    return Math.max(0, TOTAL_DURATION_SECONDS - elapsed);
  });

  const [enteredPassword, setEnteredPassword] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [isInputShaking, setIsInputShaking] = useState(false);
  const inputRef = useRef(null);
  const hasFinishedRef = useRef(false);

  // Real-time Countdown with Refresh Protection
  useEffect(() => {
    if (hasFinishedRef.current) return;

    const checkTime = () => {
      if (hasFinishedRef.current) return;
      const now = Date.now();
      const elapsed = Math.floor((now - missionStartTime) / 1000);
      const remaining = TOTAL_DURATION_SECONDS - elapsed;

      if (remaining <= 0) {
        hasFinishedRef.current = true;
        setSecondsRemaining(0);
        sound.playError();
        onTimeout();
      } else {
        setSecondsRemaining(remaining);
      }
    };

    // Immediate check
    checkTime();

    // High frequency interval (250ms) to ensure exact zero-point detection
    const interval = setInterval(checkTime, 250);

    return () => clearInterval(interval);
  }, [missionStartTime, onTimeout]);

  // Format time as MM:SS
  const formatTime = (totalSeconds) => {
    const clamped = Math.max(0, totalSeconds);
    const mins = Math.floor(clamped / 60);
    const secs = clamped % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Dynamic letter count of password (counting letters only)
  const letterCount = question?.password ? question.password.replace(/[^A-Za-z0-9]/g, '').length : 0;

  // Handle password submission
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (secondsRemaining <= 0 || hasFinishedRef.current) return;

    const trimmedInput = enteredPassword.trim().toUpperCase();
    if (!trimmedInput) {
      setFeedbackMsg("Enter a secret password!");
      setIsInputShaking(true);
      setTimeout(() => setIsInputShaking(false), 500);
      return;
    }

    const targetPassword = question?.password?.trim()?.toUpperCase();

    if (trimmedInput === targetPassword) {
      // CORRECT PASSWORD!
      hasFinishedRef.current = true;
      sound.playSuccess();
      const elapsedSeconds = Math.max(1, TOTAL_DURATION_SECONDS - secondsRemaining);
      const formattedElapsed = formatTime(elapsedSeconds);
      onSuccess(formattedElapsed, targetPassword);
    } else {
      // INCORRECT PASSWORD:
      // Stay on screen 3, do NOT stop timer, do NOT deduct time, do NOT navigate away!
      sound.playError();
      setFeedbackMsg("INCORRECT KEY — TRY AGAIN");
      setIsInputShaking(true);
      setTimeout(() => setIsInputShaking(false), 500);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const isUrgent = secondsRemaining <= 30;

  return (
    <div className={`screen-gameplay-wrapper ${isUrgent ? 'urgent-atmosphere' : ''}`}>
      {/* Header bar with countdown in top center */}
      <div className="gameplay-topbar">
        <Header crewName={crewName} badgeText="THE FIRST CLUE" />

        {/* Top Center Countdown Plaque */}
        <div className="countdown-plaque-container">
          <div className={`countdown-wood-plaque ${isUrgent ? 'countdown-urgent-pulse' : ''}`}>
            <div className="countdown-label">
              <Hourglass size={15} className={`hourglass-icon ${isUrgent ? 'hourglass-spinning' : ''}`} />
              <span>COUNTDOWN</span>
            </div>
            <div className={`countdown-digits ${isUrgent ? 'digits-red-glow' : ''}`}>
              {formatTime(secondsRemaining)}
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Desktop Layout */}
      <main className="gameplay-main-layout">
        {/* LEFT COLUMN: CLUES */}
        <section className="clues-panel-container">
          <div className="wood-panel-frame clues-frame">
            <div className="panel-gold-header">
              <CompassRose size={26} opacity={1} />
              <h2 className="panel-title-text">CLUES</h2>
            </div>

            <div className="clues-list">
              {question?.clues?.map((clueText, index) => (
                <div key={index} className="clue-row-item">
                  <div className="clue-tag-badge">
                    <span>CLUE {index + 1}</span>
                  </div>
                  <div className="clue-content-text">
                    {clueText}
                  </div>
                  <div className="clue-star-decor">
                    <CompassRose size={20} opacity={0.3} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: CRACK THE CODE */}
        <section className="crack-code-panel-container">
          <div className="wood-panel-frame crack-frame">
            <div className="panel-gold-header">
              <CrossedSwords size={22} />
              <h2 className="panel-title-text">CRACK THE CODE</h2>
            </div>

            <div className="crack-parchment-inner">
              <div className="secret-password-header">
                <span className="flourish-star">✦</span>
                <span>SECRET PASSWORD</span>
                <span className="flourish-star">✦</span>
              </div>

              <div className="letters-counter-row">
                <CompassRose size={34} opacity={0.7} />
                <div className="letters-count-number">
                  <span className="digit-bold">{letterCount}</span> LETTERS
                </div>
                <CompassRose size={34} opacity={0.7} />
              </div>

              {/* Password submission form */}
              <form onSubmit={handleSubmit} className="password-submit-form">
                <div className={`password-input-box ${isInputShaking ? 'shake-anim' : ''}`}>
                  <input
                    ref={inputRef}
                    id="password-input"
                    type="text"
                    className="password-text-input"
                    placeholder="Enter password..."
                    value={enteredPassword}
                    onChange={(e) => {
                      setEnteredPassword(e.target.value.toUpperCase());
                      if (feedbackMsg) setFeedbackMsg('');
                    }}
                    autoComplete="off"
                    autoFocus
                    disabled={secondsRemaining <= 0}
                  />
                  <SmallSkull size={20} className="input-skull-decor" />
                </div>

                {feedbackMsg && (
                  <div className="incorrect-key-banner">
                    <AlertCircle size={18} />
                    <span>{feedbackMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  id="submit-password-btn"
                  className="pirate-btn pirate-btn-primary submit-key-btn"
                  disabled={secondsRemaining <= 0}
                >
                  <PirateShipIcon size={24} className="btn-ship-icon" />
                  <span className="btn-text">SUBMIT YOUR SECRET KEY</span>
                </button>
              </form>

              <div className="attempts-policy-note">
                <span className="infinity-symbol">∞</span> Unlimited attempts • No penalty
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
