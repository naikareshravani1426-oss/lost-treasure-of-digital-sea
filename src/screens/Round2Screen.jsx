/**
 * Round2Screen.jsx — Round II: THE CURSED CALCULATION
 *
 * Timer behaviour (per spec):
 *   1. Start at 03:00.
 *   2. First hit at 00:00 → grant one 30-second bonus (toast notification).
 *   3. Second hit at 00:00 → timeout; show result modal with two buttons.
 *
 * Warning mode: ONLY the last 10 s of the CURRENT active window.
 *   • During 03:00 → 00:00:  warning at ≤ 10 s.
 *   • Bonus resets to 00:30:  warning clears; reappears at ≤ 10 s again.
 *
 * Questions:
 *   • Exactly the 8 entries from round2Questions.js.
 *   • Shuffled on each fresh Round II session.
 *   • ONE question shown at a time.
 *   • Timer does NOT reset between questions.
 *   • Attempts accumulate across all questions.
 *
 * Result data shape saved to leaderboard:
 *   { crewName, round1Time, round2Time, totalTime, r2Attempts, bonus30Used, status, totalSeconds }
 *
 * Popup style: matches the existing parchment modal (.r2-modal-content) used before.
 * Two buttons: VIEW LEADERBOARD  |  BACK TO HOME
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Skull, Anchor, Lock } from 'lucide-react';
import canvasConfetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { round2Questions } from '../data/round2Questions';

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const INITIAL_TIME = 180; // 03:00
const WARNING_SECS = 10;  // last 10 s of CURRENT active window → red

/* ─────────────────────────────────────────────
   FISHER-YATES SHUFFLE
───────────────────────────────────────────── */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ─────────────────────────────────────────────
   FLOATING GOLD PARTICLES  (canvas overlay)
───────────────────────────────────────────── */
function GoldParticles() {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width = W; canvas.height = H;

    const pts = Array.from({ length: 24 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: 1 + Math.random() * 2,
      speed: 0.15 + Math.random() * 0.3,
      drift: (Math.random() - 0.5) * 0.25,
      alpha: 0.2 + Math.random() * 0.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,215,0,${p.alpha})`;
        ctx.fill();
        p.y -= p.speed; p.x += p.drift;
        p.alpha = 0.2 + 0.4 * Math.abs(Math.sin(Date.now() * 0.001 + p.x));
        if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    const onResize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <canvas ref={canvasRef} aria-hidden="true" style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 0,
    }} />
  );
}

/* ─────────────────────────────────────────────
   SVG TREASURE CHEST  (CSS + Framer-Motion)
───────────────────────────────────────────── */
function TreasureChest({ state }) {
  const lidCtrl  = useAnimation();
  const bodyCtrl = useAnimation();
  const lockCtrl = useAnimation();

  useEffect(() => {
    if (state === 'open') {
      lockCtrl.start({ y: -40, opacity: 0, rotate: -30, transition: { duration: 0.35 } });
      lidCtrl.start({ rotateX: -110, transition: { delay: 0.3, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] } });
    } else if (state === 'shaking') {
      bodyCtrl.start({ x: [-6, 6, -5, 5, -3, 3, 0], transition: { duration: 0.45 } });
    } else {
      lidCtrl.start({ rotateX: 0, transition: { duration: 0.4 } });
      lockCtrl.start({ y: 0, opacity: 1, rotate: 0, transition: { duration: 0.3 } });
    }
  }, [state, lidCtrl, bodyCtrl, lockCtrl]);

  return (
    <div className="r2-chest-svg-wrapper" aria-label="Treasure chest">
      <AnimatePresence>
        {state === 'open' && (
          <motion.div className="r2-light-burst"
            initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1.4 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.6 }} />
        )}
      </AnimatePresence>

      <motion.div animate={bodyCtrl} className="r2-chest-body-wrap">
        {/* Lid */}
        <motion.div className="r2-chest-lid" animate={lidCtrl}
          style={{ transformOrigin: 'bottom center', transformPerspective: 600 }}>
          <svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg" className="r2-chest-lid-svg">
            <defs>
              <linearGradient id="lidG" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#c47a1e"/><stop offset="100%" stopColor="#7a4a0d"/>
              </linearGradient>
              <linearGradient id="metalG" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#c8a820"/><stop offset="100%" stopColor="#7a6400"/>
              </linearGradient>
            </defs>
            <rect x="2" y="2" width="116" height="36" rx="16" fill="url(#lidG)" stroke="#5c3809" strokeWidth="3"/>
            <line x1="2" y1="14" x2="118" y2="14" stroke="#5c3809" strokeWidth="1.5" opacity="0.6"/>
            <line x1="2" y1="26" x2="118" y2="26" stroke="#5c3809" strokeWidth="1.5" opacity="0.6"/>
            <rect x="50" y="2" width="20" height="36" rx="2" fill="url(#metalG)" stroke="#4a3800" strokeWidth="1"/>
          </svg>
        </motion.div>

        {/* Body */}
        <svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg" className="r2-chest-body-svg">
          <defs>
            <linearGradient id="bodyG" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a05c18"/><stop offset="100%" stopColor="#5a2d0a"/>
            </linearGradient>
            <linearGradient id="rimG" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d4a820"/><stop offset="100%" stopColor="#8a6a00"/>
            </linearGradient>
            <radialGradient id="innerGlow" cx="50%" cy="0%" r="80%">
              <stop offset="0%" stopColor="#ffd700" stopOpacity="0.9"/>
              <stop offset="100%" stopColor="#c47a1e" stopOpacity="0.1"/>
            </radialGradient>
          </defs>
          {state === 'open' && <rect x="2" y="2" width="116" height="88" rx="6" fill="url(#innerGlow)" opacity="0.8"/>}
          <rect x="2" y="2" width="116" height="88" rx="6" fill="url(#bodyG)" stroke="#3b1c08" strokeWidth="3"/>
          <line x1="2" y1="30" x2="118" y2="30" stroke="#3b1c08" strokeWidth="2" opacity="0.7"/>
          <line x1="2" y1="58" x2="118" y2="58" stroke="#3b1c08" strokeWidth="2" opacity="0.7"/>
          <rect x="0" y="0" width="120" height="12" rx="4" fill="url(#rimG)" stroke="#4a3800" strokeWidth="1"/>
          <rect x="50" y="12" width="20" height="78" fill="url(#rimG)" stroke="#4a3800" strokeWidth="1"/>
          {[[8,8],[112,8],[8,82],[112,82]].map(([cx,cy],i) => (
            <circle key={i} cx={cx} cy={cy} r="5" fill="#d4a820" stroke="#4a3800" strokeWidth="1"/>
          ))}
          {state === 'open' && <>
            <ellipse cx="40" cy="15" rx="10" ry="6" fill="#ffd700" opacity="0.9"/>
            <ellipse cx="70" cy="12" rx="8" ry="5" fill="#ffb800" opacity="0.85"/>
            <ellipse cx="90" cy="16" rx="9" ry="5" fill="#ffd700" opacity="0.9"/>
            <circle cx="55" cy="10" r="4" fill="#ff6060" opacity="0.85"/>
            <circle cx="80" cy="10" r="3.5" fill="#60c0ff" opacity="0.85"/>
          </>}
        </svg>

        {/* Padlock */}
        <motion.div className="r2-padlock-wrap" animate={lockCtrl}>
          <svg viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg" className="r2-padlock-svg">
            <defs>
              <linearGradient id="lockG" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={state === 'open' ? '#2a2a2a' : '#888'}/>
                <stop offset="100%" stopColor={state === 'open' ? '#111' : '#555'}/>
              </linearGradient>
            </defs>
            <path d="M10 22 Q10 6 20 6 Q30 6 30 22" fill="none"
              stroke={state === 'open' ? '#444' : '#aaa'} strokeWidth="5" strokeLinecap="round"/>
            <rect x="4" y="20" width="32" height="26" rx="4" fill="url(#lockG)" stroke="#4a4a4a" strokeWidth="2"/>
            <circle cx="20" cy="32" r="4" fill={state === 'open' ? '#222' : '#ffd700'}/>
            <rect x="18" y="34" width="4" height="6" rx="1" fill={state === 'open' ? '#222' : '#ffd700'}/>
          </svg>
        </motion.div>
      </motion.div>

      {/* Label */}
      <AnimatePresence mode="wait">
        <motion.div key={state === 'open' ? 'open' : 'locked'}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}
          className={`r2-chest-label ${state === 'open' ? 'open' : ''}`}>
          {state === 'open' ? '🎉 TREASURE UNLOCKED!' : '🔒 LOCKED'}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────
   RESULT MODAL  (matches existing parchment style)
   Used for BOTH success and timeout at end.
───────────────────────────────────────────── */
function ResultModal({ type, crewName, timeTaken, attempts, penaltyTime = 0, onLeaderboard, onHome }) {
  const isSuccess = type === 'success';
  const penaltyLabel = penaltyTime > 0 ? `+${penaltyTime} SEC` : '+0 SEC';

  return (
    <div className="r2-modal-screen">
      <motion.div className="r2-modal-content"
        initial={{ scale: 0.75, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}>

        <h2 style={{ color: isSuccess ? '#1a0f08' : '#8b0000' }}>
          {isSuccess ? '🏴☠️ ROUND II COMPLETE!' : '☠ TIME\'S UP, PIRATE!'}
        </h2>

        <div className="modal-subtitle">
          {isSuccess ? 'CURSE BROKEN!' : 'THE CURSE REMAINS UNBROKEN.'}
        </div>

        <div className="modal-team">TEAM: {crewName}</div>

        <div className="modal-stats">
          <div>TIME TAKEN: <strong>{timeTaken}</strong></div>
          <div>ATTEMPTS: <strong>{attempts}</strong></div>
          <div>PENALTY: <strong style={{ color: penaltyTime > 0 ? '#b81d1d' : '#27ae60' }}>{penaltyLabel}</strong></div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
          <button className="pirate-btn pirate-btn-primary" onClick={onLeaderboard}>
            🏆 VIEW LEADERBOARD
          </button>
          <button className="pirate-btn pirate-btn-secondary" onClick={onHome}>
            🏠 BACK TO HOME
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function Round2Screen({ crewName, r1PenaltyTime = 0, onComplete, onTimeout, onReset }) {
  /* ── Phase ──────────────────────────────────────────────── */
  const [phase, setPhase]         = useState('transition'); // transition | playing | result
  const [transitionMsg, setTransitionMsg] = useState('ROUND I COMPLETE');

  /* ── Questions ──────────────────────────────────────────── */
  const [questions]       = useState(() => shuffle(round2Questions));
  const [qIndex, setQIndex] = useState(0);

  /* ── Timer ──────────────────────────────────────────────── */
  const [timeLeft, setTimeLeft]       = useState(INITIAL_TIME); // Strictly 180s (03:00)

  /* ── Input ──────────────────────────────────────────────── */
  const [password, setPassword] = useState('');
  const [inputState, setInputState] = useState('idle'); // idle | error | success

  /* ── Attempts ─────────────────────────────────────────────── */
  const [attempts, setAttempts] = useState(0);

  /* ── Chest ──────────────────────────────────────────────── */
  const [chestState, setChestState] = useState('locked'); // locked | shaking | open

  /* ── Result modal ─────────────────────────────────────────── */
  const [resultType, setResultType] = useState(null); // 'success' | 'timeout'
  const [cumulativePenalty, setCumulativePenalty] = useState(r1PenaltyTime);

  /* ── Refs ───────────────────────────────────────────────── */
  const finishedRef    = useRef(false);
  const attemptsRef    = useRef(0);   // mirror for use in timer callback
  const timeLeftRef    = useRef(INITIAL_TIME);
  const inputRef       = useRef(null);

  /* ──────────────────────────────────────────────────────────
     HELPERS
  ────────────────────────────────────────────────────────── */
  const formatTime = (s) => {
    const c = Math.max(0, s);
    return `${String(Math.floor(c / 60)).padStart(2, '0')}:${String(c % 60).padStart(2, '0')}`;
  };

  const getElapsedSecs = useCallback(() => {
    return INITIAL_TIME - Math.max(0, timeLeftRef.current);
  }, []);

  const saveResult = useCallback((status, timeTakenStr, r2Penalty = 0) => {
    try {
      const round1Time = localStorage.getItem('lost_treasure_completion_time') || '02:00';
      const [rm, rs]   = round1Time.split(':').map(Number);
      const r1Secs     = (isNaN(rm) ? 2 : rm) * 60 + (isNaN(rs) ? 0 : rs);

      const r2Secs = status === 'TIMEOUT' ? INITIAL_TIME : getElapsedSecs();
      const totalPenaltySecs = r1PenaltyTime + r2Penalty;
      const totalSecs = r1Secs + r2Secs + totalPenaltySecs;

      const entry = {
        crewName,
        round1Time,
        round2Time:  timeTakenStr || formatTime(r2Secs),
        totalTime:   formatTime(totalSecs),
        r2Attempts:  attemptsRef.current,
        bonus30Used: totalPenaltySecs > 0,
        round1Penalty: r1PenaltyTime > 0,
        round2Penalty: r2Penalty > 0,
        penaltyTime: totalPenaltySecs,
        status,
        totalSeconds: totalSecs,
      };

      let lb = JSON.parse(localStorage.getItem('lost_treasure_leaderboard') || '[]');
      lb = lb.filter(e => e.crewName !== crewName);
      lb.push(entry);
      lb.sort((a, b) => {
        if (a.status === 'COMPLETED' && b.status !== 'COMPLETED') return -1;
        if (b.status === 'COMPLETED' && a.status !== 'COMPLETED') return 1;
        return a.totalSeconds - b.totalSeconds;
      });
      localStorage.setItem('lost_treasure_leaderboard', JSON.stringify(lb));
      localStorage.setItem('lost_treasure_round2_time',     entry.round2Time);
      localStorage.setItem('lost_treasure_round2_attempts', String(attemptsRef.current));
      localStorage.setItem('lost_treasure_round2_status',   status);
      localStorage.setItem('lost_treasure_penalty_time',     String(totalPenaltySecs));
    } catch (_) {}
  }, [crewName, getElapsedSecs, r1PenaltyTime]);

  /* ──────────────────────────────────────────────────────────
     CINEMATIC TRANSITION  (on mount)
  ────────────────────────────────────────────────────────── */
  useEffect(() => {
    const t1 = setTimeout(() => {
      sound.playClick();
      setTransitionMsg('ROUND II • THE CURSED CALCULATION');
    }, 600);
    const t2 = setTimeout(() => {
      setPhase('playing');
    }, 1300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  /* ──────────────────────────────────────────────────────────
     TIMER  (interval, starts when phase = 'playing')
     Strictly 03:00 (180s) down to 00:00 (0s).
  ────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (phase !== 'playing') return;

    const triggerTimeout = () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      sound.stopClockTick();
      sound.playError();
      const timeTaken = '03:00';
      const finalPenalty = r1PenaltyTime + 30;
      setCumulativePenalty(finalPenalty);
      saveResult('TIMEOUT', timeTaken, 30);
      setResultType('timeout');
      setPhase('result');
    };

    const id = setInterval(() => {
      if (finishedRef.current) {
        clearInterval(id);
        return;
      }

      if (timeLeftRef.current <= 1) {
        clearInterval(id);
        timeLeftRef.current = 0;
        setTimeLeft(0);
        triggerTimeout();
        return;
      }

      setTimeLeft(prev => {
        const next = Math.max(0, prev - 1);
        timeLeftRef.current = next;
        return next;
      });
    }, 1000);

    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, r1PenaltyTime, saveResult]);

  /* ── Clock tick SFX at ≤10 s ─────────────────────────────── */
  useEffect(() => {
    if (timeLeft <= WARNING_SECS && timeLeft > 0) {
      sound.startClockTick();
    } else if (timeLeft <= 0) {
      sound.stopClockTick();
    }
  }, [timeLeft]);

  useEffect(() => () => sound.stopClockTick(), []);

  /* ──────────────────────────────────────────────────────────
     SUBMIT  (plain text comparison — answers from data file)
  ────────────────────────────────────────────────────────── */
  const handleSubmit = useCallback((e) => {
    e && e.preventDefault();
    if (finishedRef.current || phase !== 'playing' || timeLeftRef.current <= 0) return;

    const val = password.trim();
    if (!val || val.length < 1) return;

    const currentQ = questions[qIndex];
    if (!currentQ) return;

    if (val === currentQ.answer) {
      /* ── CORRECT ── */
      sound.playSuccess?.() ?? sound.playClick();
      setChestState('open');
      setInputState('success');
      setPassword('');

      // Confetti burst
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (!mq.matches) {
        canvasConfetti({ particleCount: 120, spread: 80, origin: { y: 0.55 },
          colors: ['#ffd700','#ff6060','#60c0ff','#c0ff60'] });
      }

      setTimeout(() => {
        // Only ONE question in this round. End it immediately.
        if (!finishedRef.current) {
          finishedRef.current = true;
          sound.stopClockTick();
          const elapsed    = getElapsedSecs();
          const timeTaken  = formatTime(elapsed);
          saveResult('COMPLETED', timeTaken);
          setResultType('success');
          setPhase('result');
        }
      }, 1800);

    } else {
      /* ── WRONG ── */
      sound.playError?.() ?? sound.playClick();
      setAttempts(a => { attemptsRef.current = a + 1; return a + 1; });
      setInputState('error');
      setChestState('shaking');
      setPassword('');

      setTimeout(() => {
        setInputState('idle');
        setChestState('locked');
        inputRef.current?.focus();
      }, 600);
    }
  }, [password, phase, qIndex, questions, getElapsedSecs, saveResult]);

  /* ── Enter key ─────────────────────────────────────────────── */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Enter' && phase === 'playing') handleSubmit(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleSubmit, phase]);

  /* ──────────────────────────────────────────────────────────
     RENDER: TRANSITION SCREEN
  ────────────────────────────────────────────────────────── */
  if (phase === 'transition') {
    return (
      <div className="r2-transition-screen" onClick={() => setPhase('playing')} style={{ cursor: 'pointer' }}>
        <div className="r2-transition-text">{transitionMsg}</div>
        <div style={{ color: '#c59b4c', marginTop: '16px', fontSize: '0.9rem', letterSpacing: '2px', opacity: 0.8 }}>
          CLICK ANYWHERE TO BEGIN
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────────
     RENDER: RESULT MODAL
  ────────────────────────────────────────────────────────── */
  if (phase === 'result') {
    const elapsed = resultType === 'timeout' ? INITIAL_TIME : getElapsedSecs();

    return (
      <ResultModal
        type={resultType}
        crewName={crewName}
        timeTaken={formatTime(elapsed)}
        attempts={attemptsRef.current}
        penaltyTime={cumulativePenalty}
        onLeaderboard={() => onComplete()}
        onHome={() => onReset()}
      />
    );
  }

  /* ──────────────────────────────────────────────────────────
     RENDER: PLAYING
  ────────────────────────────────────────────────────────── */
  const currentQ  = questions[qIndex];
  // Warning: last 10 s of countdown
  const isWarning = timeLeft <= WARNING_SECS && timeLeft > 0;

  return (
    <div className="r2-layout" style={{ position: 'relative', overflow: 'hidden' }}>
      <GoldParticles />

      {/* ── HEADER ──────────────────────────────────────────── */}
      <header className="r2-header">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="r2-team-badge">
            <Anchor size={15} aria-hidden="true" />
            <span>TEAM: {crewName}</span>
          </div>
        </div>

        <div className="r2-header-center">
          <div className="r2-small-badge">⚓ ROUND II • THE CURSED CALCULATION ⚓</div>
          <h1>SOLVE THE CURSED CALCULATION</h1>
          <p>CRACK THE CLUES. BREAK THE CURSE. CLAIM THE TREASURE.</p>
        </div>

        <motion.div
          className={`r2-timer-badge ${isWarning ? 'warning' : ''}`}
          animate={isWarning ? { scale: [1, 1.06, 1] } : { scale: 1 }}
          transition={isWarning ? { repeat: Infinity, duration: 0.8 } : {}}>
          {formatTime(timeLeft)}
        </motion.div>
      </header>

      {/* ── TWO COLUMNS ──────────────────────────────────────── */}
      <main className="r2-main-cols">

        {/* LEFT — Parchment / Clues */}
        <motion.div className="r2-col-left"
          initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}>
          <div className="r2-parchment-panel">
            <div className="r2-panel-heading">⚓ THE CAPTAIN'S CURSED LEDGER ⚓</div>
            <h2>THE CURSED CALCULATION</h2>
            <p className="r2-desc r2-desc-italic">
              "Decipher these ancient clues, solve the riddle, and break the curse that binds this treasure."
            </p>

            <div className="r2-clues-container">
              <h3>⚓ THE CAPTAIN'S CLUES</h3>
              {currentQ?.clues.map((clue, idx) => {
                const roman = ['I', 'II', 'III', 'IV'][idx] || String(idx + 1);
                return (
                  <motion.div key={`${qIndex}-${idx}`} className="r2-clue-card"
                    initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.18 + 0.2, duration: 0.5 }}>
                    <div className="r2-clue-label">⚓ CLUE {roman}</div>
                    <div className="r2-clue-text">{clue}</div>
                  </motion.div>
                );
              })}
            </div>

            <div className="r2-parchment-note">
              "The answer is a 3-digit number. Think carefully, pirate."
            </div>
          </div>
        </motion.div>

        {/* RIGHT — Break the Curse */}
        <motion.div className="r2-col-right"
          initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}>
          <div className="r2-treasure-panel">

            {/* Header row — no overlap */}
            <div className="r2-right-header-row">
              <div className="r2-break-title">
                <Lock size={18} aria-hidden="true" />
                <span>BREAK THE CURSE</span>
              </div>
              <div className="r2-attempts-section">
                <span className="r2-attempts-label">WRONG ATTEMPTS</span>
                <div className="r2-skulls-row">
                  {Array.from({ length: Math.min(attempts, 6) }).map((_, i) => (
                    <motion.span key={i}
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500 }}>
                      <Skull size={15} color="#ff4444" aria-hidden="true" />
                    </motion.span>
                  ))}
                  {attempts > 6 && <span className="r2-more-skulls">+{attempts - 6}</span>}
                  {attempts === 0 && <span className="r2-attempts-zero">—</span>}
                </div>
              </div>
            </div>

            <p className="r2-right-subtitle">Crack the password to unlock the treasure.</p>

            {/* Password form */}
            <form onSubmit={handleSubmit} className="r2-answer-form" noValidate>
              <div className="r2-digit-input-row">
                <motion.input
                  ref={inputRef}
                  id="r2-password-input"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={3}
                  value={password}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    if (val.length <= 3) setPassword(val);
                  }}
                  placeholder="• • •"
                  disabled={phase !== 'playing' || finishedRef.current || timeLeft <= 0 || inputState === 'success'}
                  className={`r2-password-input ${inputState}`}
                  aria-label="Enter 3-digit password"
                  animate={inputState === 'error' ? { x: [-6, 6, -5, 5, -3, 3, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  autoComplete="off"
                />
              </div>

              <motion.button type="submit"
                className="pirate-btn pirate-btn-primary r2-unlock-btn"
                disabled={phase !== 'playing' || finishedRef.current || timeLeft <= 0 || password.length < 1 || inputState === 'success'}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Anchor size={16} aria-hidden="true" />
                UNLOCK THE TREASURE
                <Anchor size={16} aria-hidden="true" />
              </motion.button>
            </form>

            {/* Chest + success msg */}
            <div className="r2-chest-area">
              <motion.div className="r2-chest-float-wrap"
                animate={chestState !== 'open' ? { y: [0, -8, 0] } : { y: 0 }}
                transition={chestState !== 'open'
                  ? { repeat: Infinity, duration: 2.6, ease: 'easeInOut' }
                  : {}}>
                <TreasureChest state={chestState} />
              </motion.div>

              <AnimatePresence>
                {inputState === 'success' && (
                  <motion.div className="r2-success-banner"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}>
                    <div className="r2-success-title">✨ PASSWORD CRACKED! ✨</div>
                    <div className="r2-success-sub">CURSE BROKEN — THE TREASURE IS YOURS!</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </motion.div>
      </main>
    </div>
  );
}
