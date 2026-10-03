/**
 * GameplayScreen.jsx — Round I: PASSWORD CRACKING
 *
 * Timer behaviour (per spec):
 *   1. Start at 02:00.
 *   2. When it first hits 00:00 → grant one 30-second bonus (bonus state flips).
 *      Show non-blocking toast notification.
 *   3. If timer hits 00:00 AGAIN → call onTimeout() with result data.
 *   4. If correct password entered at any point → call onSuccess() with result data.
 *
 * Warning mode: last 10 s of the CURRENT active countdown (not last 10 of initial).
 *
 * Result data shape passed upward:
 *   { timeTaken: "MM:SS", password: string, attempts: number, bonus30Used: boolean }
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from '../components/Header';
import { CompassRose, CrossedSwords, SmallSkull, PirateShipIcon } from '../components/OrnateIcons';
import { Hourglass, AlertCircle } from 'lucide-react';
import { sound } from '../utils/audio';

const INITIAL_TIME = 120; // 02:00
const WARNING_SECS = 10;  // last 10 s of CURRENT active window → red

export default function GameplayScreen({
  crewName,
  question,
  missionStartTime,
  onSuccess,
  onTimeout,
  onReset,
}) {
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);

  /* ── Input / attempt state ─────────────────────────────────── */
  const [enteredPassword, setEnteredPassword] = useState('');
  const [feedbackMsg, setFeedbackMsg]         = useState('');
  const [isInputShaking, setIsInputShaking]   = useState(false);
  const [attempts, setAttempts]               = useState(0);

  const inputRef       = useRef(null);
  const finishedRef    = useRef(false);        // guard against double-fire
  const timeLeftRef    = useRef(INITIAL_TIME); // ref mirror so interval has fresh value

  /* ──────────────────────────────────────────────────────────────
     TIMER  (interval-based; compensates for elapsed if page was
     refreshed while gameplay was active)
  ────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (finishedRef.current) return;

    // Restore elapsed time from wall-clock if player refreshed mid-game
    if (missionStartTime) {
      const elapsed = Math.floor((Date.now() - missionStartTime) / 1000);
      const restored = Math.max(0, INITIAL_TIME - elapsed);
      setTimeLeft(restored);
      timeLeftRef.current = restored;
      if (restored <= 0) {
        finishedRef.current = true;
        sound.stopClockTick();
        sound.playError();
        onTimeout({
          timeTaken: '02:00',
          attempts: attempts,
          penalty: 30,
          timedOut: true,
        });
        return;
      }
    }

    const id = setInterval(() => {
      if (finishedRef.current) { clearInterval(id); return; }

      setTimeLeft(prev => {
        const next = prev - 1;
        timeLeftRef.current = next;

        if (next <= 0) {
          clearInterval(id);
          if (!finishedRef.current) {
            finishedRef.current = true;
            sound.stopClockTick();
            sound.playError();
            // Fire timeout via microtask so state update settles first
            setTimeout(() => {
              onTimeout({
                timeTaken:   '02:00',
                attempts:    attempts,
                penalty:     30,
                timedOut:    true,
              });
            }, 0);
          }
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  /* ── Clock tick SFX at ≤10 s ──────────────────── */
  useEffect(() => {
    if (timeLeft <= WARNING_SECS && timeLeft > 0) {
      sound.startClockTick();
    } else if (timeLeft <= 0) {
      sound.stopClockTick();
    }
  }, [timeLeft]);

  useEffect(() => () => sound.stopClockTick(), []);

  /* ── Helpers ────────────────────────────────────────────────── */
  const formatTime = (s) => {
    const clamped = Math.max(0, s);
    return `${String(Math.floor(clamped / 60)).padStart(2, '0')}:${String(clamped % 60).padStart(2, '0')}`;
  };

  const getElapsedTime = useCallback(() => {
    return formatTime(INITIAL_TIME - Math.max(0, timeLeftRef.current));
  }, []);

  /* ── Submit handler ──────────────────────────────────────────── */
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (finishedRef.current || timeLeftRef.current < 0) return;

    const trimmed = enteredPassword.trim().toUpperCase();
    if (!trimmed) {
      setFeedbackMsg('Enter a secret password!');
      setIsInputShaking(true);
      setTimeout(() => setIsInputShaking(false), 500);
      return;
    }

    const target = question?.password?.trim()?.toUpperCase();

    if (trimmed === target) {
      finishedRef.current = true;
      sound.stopClockTick();
      sound.playSuccess();
      onSuccess({
        timeTaken:   getElapsedTime(),
        password:    target,
        attempts:    attempts,
        penalty:     0,
        timedOut:    false,
      });
    } else {
      sound.playError();
      setAttempts(a => a + 1);
      setFeedbackMsg('INCORRECT KEY — TRY AGAIN');
      setIsInputShaking(true);
      setTimeout(() => setIsInputShaking(false), 500);
      setEnteredPassword('');
      inputRef.current?.focus();
    }
  };

  /* ── Warning mode: last 10 s ─────────── */
  const isWarning = timeLeft <= WARNING_SECS && timeLeft > 0;
  const isUrgent  = timeLeft <= 30;

  const letterCount = question?.password ? question.password.replace(/[^A-Za-z0-9]/g, '').length : 0;

  return (
    <div className={`screen-gameplay-wrapper ${isUrgent ? 'urgent-atmosphere' : ''}`}>

      {/* Header bar */}
      <div className="gameplay-topbar">
        <Header crewName={crewName} badgeText="THE FIRST CLUE" onReset={onReset} />

        {/* Countdown plaque */}
        <div className="countdown-plaque-container">
          <div className={`countdown-wood-plaque ${isWarning ? 'countdown-urgent-pulse' : ''}`}>
            <div className="countdown-label">
              <Hourglass size={15} className={`hourglass-icon ${isWarning ? 'hourglass-spinning' : ''}`} />
              <span>COUNTDOWN</span>
            </div>
            <div className={`countdown-digits ${isWarning ? 'digits-red-glow' : ''}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-column layout */}
      <main className="gameplay-main-layout">
        {/* LEFT: CLUES */}
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
                  <div className="clue-content-text">{clueText}</div>
                  <div className="clue-star-decor">
                    <CompassRose size={20} opacity={0.3} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RIGHT: CRACK THE CODE */}
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
                    disabled={timeLeft <= 0 || finishedRef.current}
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
                  disabled={timeLeft <= 0 || finishedRef.current}
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
