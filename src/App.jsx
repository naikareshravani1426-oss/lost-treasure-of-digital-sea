import React, { useState, useEffect } from 'react';
import LandingScreen from './screens/LandingScreen';
import BriefingScreen from './screens/BriefingScreen';
import GameplayScreen from './screens/GameplayScreen';
import SuccessScreen from './screens/SuccessScreen';
import TimeoutScreen from './screens/TimeoutScreen';
import Round2Screen from './screens/Round2Screen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import AmbientEffects from './components/AmbientEffects';
import { getNextQuestion } from './utils/questionManager';
import { useDisableInspect } from './hooks/useDisableInspect';

/* ── Persistent keys ──────────────────────────────────────────── */
const SK = {
  SCREEN:          'lost_treasure_current_screen',
  CREW_NAME:       'lost_treasure_crew_name',
  QUESTION:        'lost_treasure_current_question',
  START_TIME:      'lost_treasure_start_time',
  COMPLETION_TIME: 'lost_treasure_completion_time',
  CRACKED_PW:      'lost_treasure_cracked_password',
  MISSION_STATUS:  'lost_treasure_status',
  R1_ATTEMPTS:     'lost_treasure_r1_attempts',
  R1_BONUS:        'lost_treasure_r1_bonus',
  PENALTY_TIME:    'lost_treasure_penalty_time',
};

function persist(key, value) {
  try { localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value)); } catch (_) {}
}
function load(key, fallback = null) {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? v : fallback;
  } catch (_) { return fallback; }
}
function remove(key) {
  try { localStorage.removeItem(key); } catch (_) {}
}

export default function App() {
  useDisableInspect();

  /* ── Screen state ─────────────────────────────────────────── */
  const VALID_SCREENS = ['landing', 'briefing', 'gameplay', 'success', 'timeout', 'round2', 'leaderboard'];
  const [screen, setScreen] = useState(() => {
    const saved = load(SK.SCREEN, 'landing');
    return VALID_SCREENS.includes(saved) ? saved : 'landing';
  });

  /* ── Crew / game state ─────────────────────────────────────── */
  const [crewName, setCrewName] = useState(() => load(SK.CREW_NAME, ''));
  const [question, setQuestion] = useState(() => {
    const v = load(SK.QUESTION);
    if (!v) return null;
    try {
      return JSON.parse(v);
    } catch (_) {
      return null;
    }
  });
  const [missionStartTime, setMissionStartTime] = useState(() => {
    const v = load(SK.START_TIME);
    return v ? parseInt(v, 10) : null;
  });

  // Guard: if screen was left as 'gameplay' but question is missing, safely re-initialize or reset to landing
  useEffect(() => {
    if (screen === 'gameplay' && !question) {
      const q = getNextQuestion();
      if (q) {
        setQuestion(q);
        persist(SK.QUESTION, JSON.stringify(q));
      } else {
        setScreen('landing');
        persist(SK.SCREEN, 'landing');
      }
    }
  }, [screen, question]);

  /* ── Round I results & cumulative penalty ──────────────────── */
  const [completionTime, setCompletionTime]   = useState(() => load(SK.COMPLETION_TIME, ''));
  const [crackedPassword, setCrackedPassword] = useState(() => load(SK.CRACKED_PW, ''));
  const [r1Attempts, setR1Attempts]           = useState(() => parseInt(load(SK.R1_ATTEMPTS, '0'), 10));
  const [r1Bonus30Used, setR1Bonus30Used]     = useState(() => load(SK.R1_BONUS, 'false') === 'true');
  const [penaltyTime, setPenaltyTime]         = useState(() => parseInt(load(SK.PENALTY_TIME, '0'), 10));
  const [missionStatus, setMissionStatus]     = useState(() => load(SK.MISSION_STATUS, null));

  /* ── Refresh protection: if player refreshed mid-R1 past timer ─ */
  useEffect(() => {
    if (screen === 'gameplay' && missionStartTime) {
      const elapsed = Math.floor((Date.now() - missionStartTime) / 1000);
      // R1 limit is 120s (02:00); treat anything >= 120s as timeout
      if (elapsed >= 120) {
        handleTimeout({ timeTaken: '02:00', attempts: r1Attempts, penalty: 30, timedOut: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Navigation helpers ────────────────────────────────────── */
  const goTo = (s) => {
    setScreen(s);
    persist(SK.SCREEN, s);
  };

  /* ── STEP 1 → 2: Board the Ship ───────────────────────────── */
  const handleBoardShip = (name) => {
    setCrewName(name);
    persist(SK.CREW_NAME, name);
    goTo('briefing');
  };

  /* ── STEP 2 → 3: Start Mission (Round I) ──────────────────── */
  const handleStartMission = () => {
    const selectedQ = getNextQuestion();
    const startTime = Date.now();

    setQuestion(selectedQ);
    setMissionStartTime(startTime);
    setMissionStatus(null);
    setCompletionTime('');
    setCrackedPassword('');
    setR1Attempts(0);
    setR1Bonus30Used(false);
    setPenaltyTime(0);

    persist(SK.QUESTION,     JSON.stringify(selectedQ));
    persist(SK.START_TIME,    String(startTime));
    persist(SK.PENALTY_TIME,  '0');
    remove(SK.COMPLETION_TIME);
    remove(SK.CRACKED_PW);
    remove(SK.MISSION_STATUS);
    remove(SK.R1_ATTEMPTS);
    remove(SK.R1_BONUS);

    goTo('gameplay');
  };

  /* ── STEP 3 → 4: Round I Success ─────────────────────────── */
  const handleSuccess = ({ timeTaken, password, attempts }) => {
    setCompletionTime(timeTaken);
    setCrackedPassword(password);
    setR1Attempts(attempts);
    setR1Bonus30Used(false);
    setPenaltyTime(0);
    setMissionStatus('success');

    persist(SK.COMPLETION_TIME, timeTaken);
    persist(SK.CRACKED_PW,      password);
    persist(SK.R1_ATTEMPTS,     String(attempts));
    persist(SK.R1_BONUS,        'false');
    persist(SK.PENALTY_TIME,    '0');
    persist(SK.MISSION_STATUS,  'success');

    // Also store for leaderboard
    try {
      let lb = JSON.parse(localStorage.getItem('lost_treasure_leaderboard') || '[]');
      lb = lb.filter(e => e.crewName !== crewName);
      // Partial record — Round 2 will overwrite with full data
      lb.push({
        crewName,
        round1Time: timeTaken,
        round1Attempts: attempts,
        round1Bonus30Used: false,
        round1Penalty: false,
        round2Penalty: false,
        penaltyTime: 0,
        round2Time: '—',
        totalTime:  timeTaken,
        r2Attempts: 0,
        bonus30Used: false,
        status: 'R1_COMPLETE',
        totalSeconds: 0,
      });
      localStorage.setItem('lost_treasure_leaderboard', JSON.stringify(lb));
    } catch (_) {}

    goTo('success');
  };

  /* ── STEP 3 → 5: Round I Timeout ─────────────────────────── */
  const handleTimeout = ({ timeTaken, attempts }) => {
    const time = timeTaken || '02:00';
    setCompletionTime(time);
    setR1Attempts(attempts || 0);
    setR1Bonus30Used(true); // timed out in R1
    setPenaltyTime(30);
    setMissionStatus('timeout');

    persist(SK.COMPLETION_TIME, time);
    persist(SK.R1_ATTEMPTS,     String(attempts || 0));
    persist(SK.R1_BONUS,        'true');
    persist(SK.PENALTY_TIME,    '30');
    persist(SK.MISSION_STATUS,  'timeout');

    try {
      let lb = JSON.parse(localStorage.getItem('lost_treasure_leaderboard') || '[]');
      lb = lb.filter(e => e.crewName !== crewName);
      lb.push({
        crewName,
        round1Time: time,
        round1Attempts: attempts || 0,
        round1Bonus30Used: true,
        round1Penalty: true,
        round2Penalty: false,
        penaltyTime: 30,
        round2Time: '—',
        totalTime:  time,
        r2Attempts: 0,
        bonus30Used: true,
        status: 'R1_TIMEOUT',
        totalSeconds: 0,
      });
      localStorage.setItem('lost_treasure_leaderboard', JSON.stringify(lb));
    } catch (_) {}

    goTo('timeout');
  };

  /* ── STEP 4/5 → 6: Continue to Round II ───────────────────── */
  const handleContinueVoyage = () => goTo('round2');

  /* ── Reset: return to Home ────────────────────────────────── */
  const handleResetSession = () => {
    [
      SK.SCREEN, SK.CREW_NAME, SK.QUESTION, SK.START_TIME,
      SK.COMPLETION_TIME, SK.CRACKED_PW, SK.MISSION_STATUS,
      SK.R1_ATTEMPTS, SK.R1_BONUS, SK.PENALTY_TIME,
      'lost_treasure_round2_time', 'lost_treasure_round2_attempts',
      'lost_treasure_round2_status'
    ].forEach(remove);

    setCrewName('');
    setQuestion(null);
    setMissionStartTime(null);
    setCompletionTime('');
    setCrackedPassword('');
    setR1Attempts(0);
    setR1Bonus30Used(false);
    setPenaltyTime(0);
    setMissionStatus(null);
    setScreen('landing');
  };

  /* ── Background / ambient ─────────────────────────────────── */
  let bgClass    = 'bg-ocean-clean';
  let ambientMode = 'default';
  if (screen === 'landing')      { bgClass = 'bg-landing-cinematic'; }
  if (screen === 'success')      { bgClass = 'bg-deck-success';  ambientMode = 'success'; }
  if (screen === 'timeout')      { bgClass = 'bg-deck-timeout';  ambientMode = 'timeout'; }
  if (screen === 'round2')       { bgClass = 'bg-ocean-clean'; }
  if (screen === 'leaderboard')  { bgClass = 'bg-ocean-clean'; }

  return (
    <div className={`app-root-container ${bgClass}`}>

      <AmbientEffects mode={ambientMode} />

      <div className="app-content-wrapper">

        {screen === 'landing' && (
          <LandingScreen initialCrewName={crewName} onBoardShip={handleBoardShip} />
        )}

        {screen === 'briefing' && (
          <BriefingScreen crewName={crewName} onStartMission={handleStartMission} onReset={handleResetSession} />
        )}

        {screen === 'gameplay' && question && (
          <GameplayScreen
            crewName={crewName}
            question={question}
            missionStartTime={missionStartTime}
            onSuccess={handleSuccess}
            onTimeout={handleTimeout}
            onReset={handleResetSession}
          />
        )}

        {screen === 'success' && (
          <SuccessScreen
            crewName={crewName}
            crackedPassword={crackedPassword}
            completionTime={completionTime}
            attempts={r1Attempts}
            bonus30Used={r1Bonus30Used}
            penaltyTime={penaltyTime}
            onContinue={handleContinueVoyage}
            onReset={handleResetSession}
          />
        )}

        {screen === 'timeout' && (
          <TimeoutScreen
            crewName={crewName}
            completionTime={completionTime}
            attempts={r1Attempts}
            bonus30Used={r1Bonus30Used}
            penaltyTime={penaltyTime}
            onContinue={handleContinueVoyage}
            onReset={handleResetSession}
          />
        )}

        {screen === 'round2' && (
          <Round2Screen
            crewName={crewName}
            r1PenaltyTime={penaltyTime}
            onComplete={() => goTo('leaderboard')}
            onTimeout={() => goTo('leaderboard')}
            onReset={handleResetSession}
          />
        )}

        {screen === 'leaderboard' && (
          <LeaderboardScreen
            crewName={crewName}
            onReset={handleResetSession}
          />
        )}

        {/* Fallback to LandingScreen if screen is not in valid list or question is loading */}
        {!['landing', 'briefing', 'gameplay', 'success', 'timeout', 'round2', 'leaderboard'].includes(screen) && (
          <LandingScreen initialCrewName={crewName} onBoardShip={handleBoardShip} />
        )}
        {screen === 'gameplay' && !question && (
          <LandingScreen initialCrewName={crewName} onBoardShip={handleBoardShip} />
        )}

      </div>
    </div>
  );
}
