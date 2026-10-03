import React from 'react';
import { Users, Clock, ShieldCheck, Target, FileText, AlertTriangle, WifiOff, Scale, Lock } from 'lucide-react';
import { sound } from '../utils/audio';

// ─── Inline SVG decorative elements ──────────────────────────────────────────
const CompassRoseSVG = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="50" cy="50" r="46" stroke="#c59b4c" strokeWidth="2.5" fill="none" />
    <circle cx="50" cy="50" r="38" stroke="#c59b4c" strokeWidth="1" fill="none" strokeDasharray="4 4" />
    <polygon points="50,6 54,46 50,50 46,46" fill="#d42828" />
    <polygon points="50,94 54,54 50,50 46,54" fill="#5c3809" />
    <polygon points="6,50 46,46 50,50 46,54" fill="#5c3809" />
    <polygon points="94,50 54,46 50,50 54,54" fill="#5c3809" />
    <circle cx="50" cy="50" r="6" fill="#d4af37" stroke="#5c3809" strokeWidth="1.5" />
    <text x="50" y="18" textAnchor="middle" fill="#2b170c" fontSize="10" fontWeight="bold" fontFamily="serif">N</text>
    <text x="50" y="88" textAnchor="middle" fill="#2b170c" fontSize="9" fontFamily="serif">S</text>
    <text x="12" y="54" textAnchor="middle" fill="#2b170c" fontSize="9" fontFamily="serif">W</text>
    <text x="88" y="54" textAnchor="middle" fill="#2b170c" fontSize="9" fontFamily="serif">E</text>
  </svg>
);

const AnchorSVG = ({ size = 24, color = '#5c3809' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="12" cy="5" r="2.5" stroke={color} strokeWidth="1.8" fill="none" />
    <line x1="12" y1="7.5" x2="12" y2="20" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <line x1="6" y1="11" x2="18" y2="11" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M6 20 Q6 16 12 20 Q18 16 18 20" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" />
  </svg>
);

const HelmSVG = ({ size = 36, color = '#5c3809' }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="30" cy="30" r="28" stroke={color} strokeWidth="3" fill="none" />
    <circle cx="30" cy="30" r="8" fill={color} />
    {[0,45,90,135,180,225,270,315].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const x1 = 30 + 10 * Math.cos(rad); const y1 = 30 + 10 * Math.sin(rad);
      const x2 = 30 + 26 * Math.cos(rad); const y2 = 30 + 26 * Math.sin(rad);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2.5" strokeLinecap="round" />;
    })}
  </svg>
);

const TreasureChestSVG = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 50 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="3" y="20" width="44" height="18" rx="3" fill="#7a461b" />
    <rect x="3" y="20" width="44" height="6" rx="1.5" fill="#8b1313" />
    <rect x="5" y="10" width="40" height="12" rx="3" fill="#5c3414" />
    <rect x="5" y="10" width="40" height="6" rx="2" fill="#7a461b" />
    <rect x="20" y="22" width="10" height="7" rx="2" fill="#d4af37" />
  </svg>
);

// ─── Section heading wood banner ──────────────────────────────────────────────
const WoodBanner = ({ children, icon }) => (
  <div className="rb-wood-banner">
    <div className="rb-wood-banner-inner">
      {icon && <span className="rb-wood-banner-icon">{icon}</span>}
      <span className="rb-wood-banner-text">{children}</span>
    </div>
  </div>
);

export default function BriefingScreen({ crewName, onStartMission, onReset }) {
  const handleStart = () => {
    sound.playClick();
    onStartMission();
  };

  return (
    <div className="rb-wrapper" id="briefing-screen">
      <main className="rb-parchment" role="main" aria-label="Mission 1 Rule Book">

        {/* ── TOP HEADER ── */}
        <div className="rb-header-block" style={{ position: 'relative' }}>
          {onReset && (
            <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="r2-team-badge" style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.9rem', color: '#333' }}>
                TEAM: {crewName}
              </div>
              <button onClick={onReset} className="pirate-btn pirate-btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }} title="Back to Home">
                🏠 HOME
              </button>
            </div>
          )}
          <div className="rb-corner-decor rb-corner-tl" aria-hidden="true"><CompassRoseSVG size={46} /></div>
          <div className="rb-corner-decor rb-corner-tr" aria-hidden="true"><AnchorSVG size={34} color="#5c3809" /></div>

          <div className="rb-college-lines">
            <div className="rb-college-name">DATTA MEGHE COLLEGE OF ENGINEERING</div>
            <div className="rb-college-sub">GROUP OF INFORMATION TECHNOLOGY STUDENTS (GITS)</div>
            <div className="rb-presents">presents</div>
          </div>
          <h1 className="rb-main-title">THE LOST TREASURE OF DIGITAL SEA</h1>
          <div className="rb-subtitle-ribbon">
            <span className="rb-ribbon-star" aria-hidden="true">✦</span>
            <span className="rb-subtitle-text">PASSWORD BREAKER</span>
            <span className="rb-ribbon-star" aria-hidden="true">✦</span>
          </div>
          <div className="rb-mission-tag">MISSION 1</div>
        </div>

        {/* ── MISSION OBJECTIVE ── */}
        <section className="rb-section rb-objective-section" aria-label="Mission Objective">
          <WoodBanner icon={<Target size={13} color="#ffe680" />}>MISSION OBJECTIVE</WoodBanner>
          <div className="rb-objective-card">
            <div className="rb-objective-icon-wrap" aria-hidden="true"><Target size={26} color="#d42828" /></div>
            <p className="rb-objective-text">
              Solve the given clues, crack the hidden password and move ahead.{' '}
              Work together, think smart and prove your crew's excellence!
            </p>
            <div className="rb-objective-compass" aria-hidden="true"><CompassRoseSVG size={42} /></div>
          </div>
        </section>

        {/* ── MISSION OVERVIEW ── */}
        <section className="rb-section" aria-label="Mission Overview">
          <WoodBanner icon={<HelmSVG size={13} color="#ffe680" />}>MISSION OVERVIEW</WoodBanner>
          <div className="rb-overview-grid">
            <div className="rb-overview-card">
              <div className="rb-ov-icon" aria-hidden="true"><Users size={24} /></div>
              <div className="rb-ov-title">2 ROUNDS</div>
              <div className="rb-ov-body">
                <div>Round 1 : 2 Minutes</div>
                <div>Round 2 : 3 Minutes</div>
              </div>
            </div>
            <div className="rb-overview-card">
              <div className="rb-ov-icon" aria-hidden="true"><Clock size={24} /></div>
              <div className="rb-ov-title">TOTAL TIME</div>
              <div className="rb-ov-time-val">5 Minutes</div>
              <div className="rb-ov-note">(Maximum 6 Minutes with penalties)</div>
            </div>
            <div className="rb-overview-card">
              <div className="rb-ov-icon" aria-hidden="true"><ShieldCheck size={24} /></div>
              <div className="rb-ov-title">NO ELIMINATION</div>
              <div className="rb-ov-body">Every team that completes this mission proceeds to the next mission.</div>
            </div>
          </div>
        </section>

        {/* ── ROUND DETAILS ── */}
        <section className="rb-section" aria-label="Round Details">
          <WoodBanner icon={<AnchorSVG size={13} color="#ffe680" />}>ROUND DETAILS</WoodBanner>
          <div className="rb-rounds-grid">
            {/* Round 1 */}
            <div className="rb-round-card rb-round-1">
              <div className="rb-round-header">
                <span className="rb-round-badge" aria-hidden="true">1</span>
                <div className="rb-round-title-wrap">
                  <span className="rb-round-label">ROUND 1</span>
                  <span className="rb-round-subtitle">THE FIRST CLUES</span>
                </div>
                <AnchorSVG size={16} color="#fff4d0" />
              </div>
              <ul className="rb-round-list" aria-label="Round 1 rules">
                <li><span className="rb-list-icon" aria-hidden="true"><Users size={14} /></span>
                  <span>Only <strong>2 members</strong> from each team can participate</span></li>
                <li><span className="rb-list-icon" aria-hidden="true"><FileText size={14} /></span>
                  <span><strong>6 clues</strong> will be given</span></li>
                <li><span className="rb-list-icon" aria-hidden="true"><Clock size={14} /></span>
                  <span>Time Limit : <strong>2 Minutes</strong></span></li>
                <li className="rb-list-penalty"><span className="rb-list-icon rb-penalty-icon" aria-hidden="true"><AlertTriangle size={14} /></span>
                  <span>If not cracked within 2 minutes, <strong>+30 seconds</strong> penalty</span></li>
              </ul>
            </div>

            {/* Round 2 */}
            <div className="rb-round-card rb-round-2">
              <div className="rb-round-header">
                <span className="rb-round-badge" aria-hidden="true">2</span>
                <div className="rb-round-title-wrap">
                  <span className="rb-round-label">ROUND 2</span>
                  <span className="rb-round-subtitle">THE FINAL PASSWORD</span>
                </div>
                <Lock size={15} color="#fff4d0" aria-hidden="true" />
              </div>
              <ul className="rb-round-list" aria-label="Round 2 rules">
                <li><span className="rb-list-icon" aria-hidden="true"><Users size={14} /></span>
                  <span>After Round 1, one team member can participate</span></li>
                <li><span className="rb-list-icon" aria-hidden="true"><FileText size={14} /></span>
                  <span>New clues will be given. Crack the password within the time limit.</span></li>
                <li><span className="rb-list-icon" aria-hidden="true"><Clock size={14} /></span>
                  <span>Time Limit : <strong>3 Minutes</strong></span></li>
                <li className="rb-list-penalty"><span className="rb-list-icon rb-penalty-icon" aria-hidden="true"><AlertTriangle size={14} /></span>
                  <span>If not cracked within 3 minutes, another <strong>+30 seconds</strong> penalty</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── PENALTY RULES ── */}
        <section className="rb-section" aria-label="Penalty Rules">
          <WoodBanner icon={<AlertTriangle size={13} color="#ffe680" />}>PENALTY RULES</WoodBanner>
          <div className="rb-penalty-grid">
            <div className="rb-penalty-card">
              <div className="rb-penalty-icon-wrap" aria-hidden="true"><HelmSVG size={26} color="#5c3809" /></div>
              <div className="rb-penalty-label">Round 1 not cleared</div>
              <div className="rb-penalty-val">= +30 seconds</div>
            </div>
            <div className="rb-penalty-card">
              <div className="rb-penalty-icon-wrap" aria-hidden="true"><HelmSVG size={26} color="#5c3809" /></div>
              <div className="rb-penalty-label">Round 2 not cleared</div>
              <div className="rb-penalty-val">= +30 seconds</div>
            </div>
            <div className="rb-penalty-card rb-penalty-total">
              <div className="rb-penalty-icon-wrap" aria-hidden="true"><TreasureChestSVG size={28} /></div>
              <div className="rb-penalty-label">If both rounds are not cleared</div>
              <div className="rb-penalty-val rb-penalty-total-val">= +1 minute total</div>
              <div className="rb-penalty-sub">(5 minutes + 1 minute = 6 minutes)</div>
            </div>
          </div>
        </section>

        {/* ── IMPORTANT RULES ── */}
        <section className="rb-section" aria-label="Important Rules">
          <WoodBanner icon={<Scale size={13} color="#ffe680" />}>IMPORTANT RULES</WoodBanner>
          <div className="rb-rules-grid">
            <div className="rb-rule-item">
              <div className="rb-rule-icon" aria-hidden="true"><AlertTriangle size={20} /></div>
              <span className="rb-rule-text">Follow the given clues only.</span>
            </div>
            <div className="rb-rule-item">
              <div className="rb-rule-icon" aria-hidden="true"><Users size={20} /></div>
              <span className="rb-rule-text">Work together and stay with your team.</span>
            </div>
            <div className="rb-rule-item">
              <div className="rb-rule-icon" aria-hidden="true"><WifiOff size={20} /></div>
              <span className="rb-rule-text">No external help or internet unless specified.</span>
            </div>
            <div className="rb-rule-item">
              <div className="rb-rule-icon" aria-hidden="true"><Scale size={20} /></div>
              <span className="rb-rule-text">Maintain fair play and follow all instructions.</span>
            </div>
          </div>
        </section>

        {/* ── ACTION BUTTON ── */}
        <div className="rb-action-row">
          <button
            id="start-mission-btn"
            onClick={handleStart}
            className="rb-start-btn"
            aria-label="Start Mission 1"
            type="button"
          >
            <AnchorSVG size={19} color="#fff4d0" />
            <span>⚓ START MISSION 1 &gt;&gt;</span>
          </button>
        </div>

        {/* Rope bottom decoration */}
        <div className="rb-rope-bottom" aria-hidden="true">
          <span>⚓ ───── ✦ ───── ⚓</span>
        </div>

      </main>
    </div>
  );
}
