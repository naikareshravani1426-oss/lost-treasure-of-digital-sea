import React from 'react';
import Header from '../components/Header';
import { SkullCutlasses, PirateShipIcon, CompassRose } from '../components/OrnateIcons';
import { Users, Clock, ShieldCheck, Target, FileText, AlertTriangle, WifiOff, Scale, Lock, Anchor } from 'lucide-react';
import { sound } from '../utils/audio';

export default function BriefingScreen({ crewName, onStartMission }) {
  const handleStart = () => {
    sound.playClick();
    onStartMission();
  };

  return (
    <div className="screen-briefing-wrapper">
      <Header crewName={crewName} badgeText="PASSWORD BREAKER" />

      <main className="briefing-content-container">
        <div className="briefing-scroll-board">
          {/* Header Title Section */}
          <div className="briefing-header-block">
            <div className="briefing-skull-crest">
              <SkullCutlasses size={56} />
            </div>
            <div className="briefing-title-group">
              <h2 className="briefing-main-heading">MISSION BRIEFING</h2>
              <div className="briefing-subtitle-ribbon">
                <span className="bullet-star">✦</span>
                <span>PASSWORD BREAKER</span>
                <span className="bullet-star">✦</span>
              </div>
              <p className="briefing-instruction-note">
                Read carefully before you set sail.
              </p>
            </div>
            <div className="briefing-compass-accent">
              <CompassRose size={48} opacity={0.4} />
            </div>
          </div>

          {/* Section 1: Mission Objective */}
          <section className="briefing-section objective-section">
            <div className="wood-ribbon-title">
              <span>MISSION OBJECTIVE</span>
            </div>
            <div className="objective-card-inner">
              <div className="objective-icon-col">
                <div className="target-icon-badge">
                  <Target size={36} color="#d42828" />
                </div>
              </div>
              <p className="objective-text">
                Solve the given clues, crack the hidden password and move ahead.
                Work together, think smart and prove your crew’s excellence!
              </p>
              <div className="objective-ship-decor">
                <PirateShipIcon size={42} />
              </div>
            </div>
          </section>

          {/* Section 2: Mission Overview */}
          <section className="briefing-section overview-section">
            <div className="wood-ribbon-title">
              <span>MISSION OVERVIEW</span>
            </div>
            <div className="overview-grid">
              {/* Box 1 */}
              <div className="overview-col-card">
                <div className="col-icon-wrapper">
                  <Users size={32} className="col-icon" />
                </div>
                <h3 className="col-heading">2 ROUNDS</h3>
                <div className="col-body-lines">
                  <div>Round 1 : 2 Minutes</div>
                  <div>Round 2 : 3 Minutes</div>
                </div>
              </div>

              {/* Box 2 */}
              <div className="overview-col-card">
                <div className="col-icon-wrapper">
                  <Clock size={32} className="col-icon" />
                </div>
                <h3 className="col-heading highlight-time">TOTAL TIME</h3>
                <div className="total-time-val">5 Minutes</div>
                <div className="col-sub-note">
                  (Maximum 6 Minutes with penalties)
                </div>
              </div>

              {/* Box 3 */}
              <div className="overview-col-card">
                <div className="col-icon-wrapper">
                  <ShieldCheck size={32} className="col-icon" />
                </div>
                <h3 className="col-heading">NO ELIMINATION</h3>
                <div className="col-body-lines">
                  <div>Every team that completes this mission within the given time will proceed to the next stage.</div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Round Details */}
          <section className="briefing-section rounds-section">
            <div className="wood-ribbon-title">
              <span>ROUND DETAILS</span>
            </div>
            <div className="rounds-grid">
              {/* Round 1 Card */}
              <div className="round-detail-card">
                <div className="round-ribbon-header">
                  <span className="round-num-badge">1</span>
                  <div className="round-ribbon-text">
                    <span className="round-title-prefix">ROUND 1</span>
                    <span className="round-name">PASSWORD BREAKER</span>
                  </div>
                  <Anchor size={20} className="round-anchor-decor" />
                </div>

                <ul className="round-points-list">
                  <li>
                    <Users size={18} className="point-icon" />
                    <span>Only 2 members from each team can participate in this round.</span>
                  </li>
                  <li>
                    <FileText size={18} className="point-icon" />
                    <span>You will be given <strong>6 clues</strong> to crack the password.</span>
                  </li>
                  <li>
                    <Clock size={18} className="point-icon" />
                    <span>Time Limit : <strong>2 Minutes</strong></span>
                  </li>
                  <li className="penalty-point">
                    <AlertTriangle size={18} className="point-icon penalty-icon" />
                    <span>If the password is not cracked within 2 minutes, <strong>+30 seconds</strong> will be added to the team's final time.</span>
                  </li>
                </ul>
              </div>

              {/* Round 2 Card */}
              <div className="round-detail-card round-2-locked">
                <div className="round-ribbon-header">
                  <span className="round-num-badge">2</span>
                  <div className="round-ribbon-text">
                    <span className="round-title-prefix">ROUND 2</span>
                    <span className="round-name">THE FINAL PASSWORD</span>
                  </div>
                  <Lock size={18} className="round-lock-decor" />
                </div>

                <ul className="round-points-list">
                  <li>
                    <Users size={18} className="point-icon" />
                    <span>After successfully clearing Round 1, you can unlock/revive ONE of your team members to participate in Round 2.</span>
                  </li>
                  <li>
                    <FileText size={18} className="point-icon" />
                    <span>A new set of clues will be given. Crack the password within the time limit.</span>
                  </li>
                  <li>
                    <Clock size={18} className="point-icon" />
                    <span>Time Limit : <strong>3 Minutes</strong></span>
                  </li>
                  <li className="penalty-point">
                    <AlertTriangle size={18} className="point-icon penalty-icon" />
                    <span>If the password is not cracked within 3 minutes, another <strong>+30 seconds</strong> will be added to the team's final time.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4: Important Rules */}
          <section className="briefing-section rules-section">
            <div className="wood-ribbon-title">
              <span>IMPORTANT RULES</span>
            </div>
            <div className="rules-grid">
              <div className="rule-item">
                <AlertTriangle size={20} className="rule-icon" />
                <span>Follow the given clues only.</span>
              </div>
              <div className="rule-item">
                <Users size={20} className="rule-icon" />
                <span>Work together and stay with your team.</span>
              </div>
              <div className="rule-item">
                <WifiOff size={20} className="rule-icon" />
                <span>No external help or internet allowed (unless specified).</span>
              </div>
              <div className="rule-item">
                <Scale size={20} className="rule-icon" />
                <span>Maintain fair play and follow all instructions.</span>
              </div>
            </div>
          </section>

          {/* Action Button */}
          <div className="briefing-action-row">
            <button
              id="start-mission-btn"
              onClick={handleStart}
              className="pirate-btn pirate-btn-primary briefing-start-btn"
            >
              <PirateShipIcon size={24} className="btn-ship-icon" />
              <span className="btn-text">START MISSION 1 &gt;&gt;</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
