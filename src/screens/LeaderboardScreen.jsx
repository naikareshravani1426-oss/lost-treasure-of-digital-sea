/**
 * LeaderboardScreen.jsx — THE CAPTAIN'S TREASURE LEDGER
 *
 * Reads leaderboard from localStorage (key: 'lost_treasure_leaderboard').
 *
 * Entry shape written by Round2Screen:
 *   { crewName, round1Time, round2Time, totalTime, r2Attempts, bonus30Used, status, totalSeconds }
 *
 * Columns: RANK | CREW | ROUND I | ROUND II | EXTRA 30 SEC | ATTEMPTS | TOTAL TIME | STATUS
 */

import React, { useState, useEffect } from 'react';
import { Anchor } from 'lucide-react';
import { sound } from '../utils/audio';

export default function LeaderboardScreen({ crewName, onReset }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [animateIn, setAnimateIn]     = useState(false);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('lost_treasure_leaderboard') || '[]');
      // Filter out partial R1-only records if a full record exists for same crew
      const seen = new Set();
      const deduped = [];
      // Sort so COMPLETED comes first, then by totalSeconds
      const sorted = [...data].sort((a, b) => {
        if (a.status === 'COMPLETED' && b.status !== 'COMPLETED') return -1;
        if (b.status === 'COMPLETED' && a.status !== 'COMPLETED') return 1;
        return (a.totalSeconds || 9999) - (b.totalSeconds || 9999);
      });
      sorted.forEach(e => {
        if (!seen.has(e.crewName)) { seen.add(e.crewName); deduped.push(e); }
      });
      setLeaderboard(deduped);
    } catch (e) {
      console.error(e);
    }
    setTimeout(() => setAnimateIn(true), 100);
  }, []);

  const handleReturn = () => {
    sound.playClick();
    onReset();
  };

  const rankIcon = (i) => {
    if (i === 0) return '🥇';
    if (i === 1) return '🥈';
    if (i === 2) return '🥉';
    return `#${i + 1}`;
  };

  const rankClass = (i) => {
    if (i === 0) return 'rank-1';
    if (i === 1) return 'rank-2';
    if (i === 2) return 'rank-3';
    return '';
  };

  const statusLabel = (s) => {
    if (s === 'COMPLETED') return '✅ COMPLETED';
    if (s === 'TIMEOUT')   return '⏰ TIMEOUT';
    if (s === 'R1_COMPLETE') return '🔄 R1 DONE';
    if (s === 'R1_TIMEOUT')  return '⏰ R1 TIMEOUT';
    return s || '—';
  };

  return (
    <div className={`lb-wrapper ${animateIn ? 'fade-in' : ''}`}>
      <main className="lb-parchment">

        <div className="lb-header" style={{ position: 'relative' }}>
          {onReset && (
            <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="r2-team-badge" style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.9rem', color: '#fff' }}>
                TEAM: {crewName}
              </div>
              <button onClick={onReset} className="pirate-btn pirate-btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }} title="Back to Home">
                🏠 HOME
              </button>
            </div>
          )}
          <div className="lb-small-badge">⚓ TECHNITUDE 2026 ⚓</div>
          <h1 className="lb-title">THE CAPTAIN'S TREASURE LEDGER</h1>
          <h2 className="lb-subtitle">FINAL CREW RANKINGS</h2>
          <p className="lb-atmosphere">"Only the crews who conquered the cursed seas remain."</p>
        </div>

        {leaderboard.length === 0 ? (
          <div className="lb-empty-state">
            <h2>THE TREASURE LEDGER AWAITS...</h2>
            <p>"NO OTHER CREWS HAVE CLAIMED THEIR TREASURE YET."</p>
          </div>
        ) : (
          <div className="lb-table-container">
            <table className="lb-table">
              <thead>
                <tr>
                  <th>RANK</th>
                  <th>CREW</th>
                  <th>ROUND I</th>
                  <th>ROUND II</th>
                  <th>EXTRA 30 SEC</th>
                  <th>ATTEMPTS</th>
                  <th>TOTAL TIME</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => {
                  const isCurrent = entry.crewName === crewName;
                  return (
                    <tr key={index}
                      className={`lb-row ${rankClass(index)} ${isCurrent ? 'is-current' : ''}`}>
                      <td className="lb-rank">{rankIcon(index)}</td>
                      <td className="lb-crew">
                        {isCurrent && (
                          <div className="lb-current-badge">
                            <Anchor size={10} style={{ display: 'inline', marginRight: 4 }} />
                            YOUR CREW
                          </div>
                        )}
                        {entry.crewName}
                      </td>
                      <td>{entry.round1Time || '—'}</td>
                      <td>{entry.round2Time || '—'}</td>
                      <td>{entry.bonus30Used ? 'USED' : 'NO'}</td>
                      <td>{entry.r2Attempts ?? entry.attempts ?? '—'}</td>
                      <td className="lb-total-time">{entry.totalTime || '—'}</td>
                      <td className="lb-status">{statusLabel(entry.status)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="lb-footer">
          <div>⚓ TECHNITUDE 2026 ⚓</div>
          <div className="lb-footer-small">THE CURSED CALCULATION HAS BEEN CONQUERED.</div>
          <button className="pirate-btn pirate-btn-secondary mt-4" onClick={handleReturn}>
            🏠 BACK TO HOME
          </button>
        </div>

      </main>
    </div>
  );
}
