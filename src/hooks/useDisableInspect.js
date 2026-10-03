/**
 * useDisableInspect.js
 *
 * Reusable hook — called once in App.jsx to guard every screen / round.
 *
 * What it does:
 *  1. Blocks right-click context menu.
 *  2. Blocks DevTools keyboard shortcuts (F12, Ctrl+Shift+I/J/C, Ctrl+U/S/P
 *     and their Mac ⌘-Option equivalents).
 *  3. Applies global CSS: user-select:none, -webkit-user-drag:none
 *     (input / textarea elements are excluded via CSS override).
 *  4. Detects DevTools open via window-size difference check.
 *     Returns `true` when DevTools appear open so App.jsx can show an overlay.
 *  5. Cleans up all listeners and intervals on unmount.
 *
 * NOTE: The `debugger` trick is intentionally removed because it causes
 * severe performance issues in production builds (every second pause).
 * The size-difference check is reliable enough for this use-case.
 */

import { useEffect, useState, useRef } from 'react';

export function useDisableInspect() {
  const [devtoolsOpen, setDevtoolsOpen] = useState(false);
  // Keep a stable ref so the interval callback always has the latest value
  const devtoolsRef = useRef(false);

  useEffect(() => {
    /* ── 1. Block right-click ──────────────────────────────────────────── */
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    /* ── 2. Block keyboard shortcuts ───────────────────────────────────── */
    const handleKeyDown = (e) => {
      const blocked =
        // F12
        e.key === 'F12' ||
        // Ctrl / Cmd + Shift + I / J / C
        ((e.ctrlKey || e.metaKey) &&
          e.shiftKey &&
          ['i', 'I', 'j', 'J', 'c', 'C'].includes(e.key)) ||
        // Ctrl / Cmd + U | S | P
        ((e.ctrlKey || e.metaKey) &&
          ['u', 'U', 's', 'S', 'p', 'P'].includes(e.key)) ||
        // Option/Alt combos (Mac: ⌘+Option+I, ⌘+Option+J, ⌘+Option+C)
        (e.metaKey &&
          e.altKey &&
          ['i', 'I', 'j', 'J', 'c', 'C'].includes(e.key));

      if (blocked) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    /* ── 3. Global no-select CSS injected at runtime ───────────────────── */
    const styleTag = document.createElement('style');
    styleTag.id = 'disable-inspect-styles';
    styleTag.textContent = `
      html, body, #root {
        user-select: none !important;
        -webkit-user-select: none !important;
        -webkit-user-drag: none !important;
      }
      /* Keep inputs and textareas selectable */
      input, textarea, [contenteditable="true"] {
        user-select: text !important;
        -webkit-user-select: text !important;
      }
    `;
    document.head.appendChild(styleTag);

    /* ── 4. DevTools detection (window-size diff) ───────────────────────── */
    const THRESHOLD = 160; // px — typical DevTools docked width/height
    const checkDevTools = () => {
      const widthDiff  = window.outerWidth  - window.innerWidth  > THRESHOLD;
      const heightDiff = window.outerHeight - window.innerHeight > THRESHOLD;
      const detected   = widthDiff || heightDiff;

      if (detected !== devtoolsRef.current) {
        devtoolsRef.current = detected;
        setDevtoolsOpen(detected);
      }
    };

    /* ── 5. Register listeners ─────────────────────────────────────────── */
    window.addEventListener('contextmenu', handleContextMenu, true);
    window.addEventListener('keydown', handleKeyDown, true);

    const intervalId = setInterval(checkDevTools, 1000);
    // Run once immediately on mount
    checkDevTools();

    /* ── 6. Cleanup on unmount ─────────────────────────────────────────── */
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu, true);
      window.removeEventListener('keydown', handleKeyDown, true);
      clearInterval(intervalId);
      const existing = document.getElementById('disable-inspect-styles');
      if (existing) existing.remove();
    };
  }, []);

  return devtoolsOpen;
}
