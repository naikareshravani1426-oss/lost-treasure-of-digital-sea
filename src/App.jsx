import React, { useState, useEffect } from 'react';
import LandingScreen from './screens/LandingScreen';
import BriefingScreen from './screens/BriefingScreen';
import GameplayScreen from './screens/GameplayScreen';
import SuccessScreen from './screens/SuccessScreen';
import TimeoutScreen from './screens/TimeoutScreen';
import Round2PlaceholderScreen from './screens/Round2PlaceholderScreen';
import AmbientEffects from './components/AmbientEffects';
import { getNextQuestion } from './utils/questionManager';

const STORAGE_KEYS = {
  SCREEN: 'lost_treasure_current_screen',
  CREW_NAME: 'lost_treasure_crew_name',
  QUESTION: 'lost_treasure_current_question',
  START_TIME: 'lost_treasure_start_time',
  COMPLETION_TIME: 'lost_treasure_completion_time',
  CRACKED_PASSWORD: 'lost_treasure_cracked_password',
  MISSION_STATUS: 'lost_treasure_status', // 'success' | 'timeout'
};

export default function App() {
  // Screen state initialization with localStorage restoration
  const [screen, setScreen] = useState(() => {
    try {
      const savedScreen = localStorage.getItem(STORAGE_KEYS.SCREEN);
      return savedScreen || 'landing';
    } catch {
      return 'landing';
    }
  });

  const [crewName, setCrewName] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.CREW_NAME) || '';
    } catch {
      return '';
    }
  });

  const [question, setQuestion] = useState(() => {
    try {
      const savedQ = localStorage.getItem(STORAGE_KEYS.QUESTION);
      return savedQ ? JSON.parse(savedQ) : null;
    } catch {
      return null;
    }
  });

  const [missionStartTime, setMissionStartTime] = useState(() => {
    try {
      const savedStart = localStorage.getItem(STORAGE_KEYS.START_TIME);
      return savedStart ? parseInt(savedStart, 10) : null;
    } catch {
      return null;
    }
  });

  const [completionTime, setCompletionTime] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.COMPLETION_TIME) || '';
    } catch {
      return '';
    }
  });

  const [crackedPassword, setCrackedPassword] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.CRACKED_PASSWORD) || '';
    } catch {
      return '';
    }
  });

  const [missionStatus, setMissionStatus] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.MISSION_STATUS) || null;
    } catch {
      return null;
    }
  });

  // Refresh Protection Evaluation on Mount
  useEffect(() => {
    if (screen === 'gameplay' && missionStartTime) {
      const elapsed = Math.floor((Date.now() - missionStartTime) / 1000);
      if (elapsed >= 120) {
        // 120s already passed during refresh! Trigger timeout automatically
        handleTimeout();
      }
    }
  }, []);

  // Sync state helpers to localStorage
  const updateScreen = (newScreen) => {
    setScreen(newScreen);
    try {
      localStorage.setItem(STORAGE_KEYS.SCREEN, newScreen);
    } catch (e) {
      console.error(e);
    }
  };

  // STEP 1 -> STEP 2: Board the Ship
  const handleBoardShip = (name) => {
    setCrewName(name);
    try {
      localStorage.setItem(STORAGE_KEYS.CREW_NAME, name);
    } catch (e) {
      console.error(e);
    }
    updateScreen('briefing');
  };

  // STEP 2 -> STEP 3: Start Mission 1
  const handleStartMission = () => {
    const selectedQ = getNextQuestion();
    const startTime = Date.now();

    setQuestion(selectedQ);
    setMissionStartTime(startTime);
    setMissionStatus(null);
    setCompletionTime('');
    setCrackedPassword('');

    try {
      localStorage.setItem(STORAGE_KEYS.QUESTION, JSON.stringify(selectedQ));
      localStorage.setItem(STORAGE_KEYS.START_TIME, startTime.toString());
      localStorage.removeItem(STORAGE_KEYS.COMPLETION_TIME);
      localStorage.removeItem(STORAGE_KEYS.CRACKED_PASSWORD);
      localStorage.removeItem(STORAGE_KEYS.MISSION_STATUS);
    } catch (e) {
      console.error(e);
    }

    updateScreen('gameplay');
  };

  // STEP 3 -> STEP 4: Success on Correct Password
  const handleSuccess = (timeTaken, password) => {
    setCompletionTime(timeTaken);
    setCrackedPassword(password);
    setMissionStatus('success');

    try {
      localStorage.setItem(STORAGE_KEYS.COMPLETION_TIME, timeTaken);
      localStorage.setItem(STORAGE_KEYS.CRACKED_PASSWORD, password);
      localStorage.setItem(STORAGE_KEYS.MISSION_STATUS, 'success');
    } catch (e) {
      console.error(e);
    }

    updateScreen('success');
  };

  // STEP 3 -> STEP 5: Timeout at 00:00
  const handleTimeout = () => {
    setMissionStatus('timeout');
    setCompletionTime('02:30'); // 02:00 + 00:30 penalty

    try {
      localStorage.setItem(STORAGE_KEYS.MISSION_STATUS, 'timeout');
      localStorage.setItem(STORAGE_KEYS.COMPLETION_TIME, '02:30');
    } catch (e) {
      console.error(e);
    }

    updateScreen('timeout');
  };

  // STEP 4/5 -> STEP 6: Continue the Voyage
  const handleContinueVoyage = () => {
    updateScreen('round2');
  };

  // Reset session for a new crew
  const handleResetSession = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.SCREEN);
      localStorage.removeItem(STORAGE_KEYS.CREW_NAME);
      localStorage.removeItem(STORAGE_KEYS.QUESTION);
      localStorage.removeItem(STORAGE_KEYS.START_TIME);
      localStorage.removeItem(STORAGE_KEYS.COMPLETION_TIME);
      localStorage.removeItem(STORAGE_KEYS.CRACKED_PASSWORD);
      localStorage.removeItem(STORAGE_KEYS.MISSION_STATUS);
    } catch (e) {
      console.error(e);
    }

    setCrewName('');
    setQuestion(null);
    setMissionStartTime(null);
    setCompletionTime('');
    setCrackedPassword('');
    setMissionStatus(null);
    setScreen('landing');
  };

  // Background selection based on screen
  let bgClass = 'bg-deck-night';
  let ambientMode = 'default';
  if (screen === 'success') {
    bgClass = 'bg-deck-success';
    ambientMode = 'success';
  } else if (screen === 'timeout') {
    bgClass = 'bg-deck-timeout';
    ambientMode = 'timeout';
  }

  return (
    <div className={`app-root-container ${bgClass}`}>
      {/* Floating particles & flickering lantern glow */}
      <AmbientEffects mode={ambientMode} />

      {/* Main Content Router */}
      <div className="app-content-wrapper">
        {screen === 'landing' && (
          <LandingScreen
            initialCrewName={crewName}
            onBoardShip={handleBoardShip}
          />
        )}

        {screen === 'briefing' && (
          <BriefingScreen
            crewName={crewName}
            onStartMission={handleStartMission}
          />
        )}

        {screen === 'gameplay' && question && (
          <GameplayScreen
            crewName={crewName}
            question={question}
            missionStartTime={missionStartTime}
            onSuccess={handleSuccess}
            onTimeout={handleTimeout}
          />
        )}

        {screen === 'success' && (
          <SuccessScreen
            crewName={crewName}
            crackedPassword={crackedPassword}
            completionTime={completionTime}
            onContinue={handleContinueVoyage}
          />
        )}

        {screen === 'timeout' && (
          <TimeoutScreen
            crewName={crewName}
            onContinue={handleContinueVoyage}
          />
        )}

        {screen === 'round2' && (
          <Round2PlaceholderScreen
            crewName={crewName}
            status={missionStatus}
            completionTime={completionTime}
            crackedPassword={crackedPassword}
            onReset={handleResetSession}
          />
        )}
      </div>
    </div>
  );
}
