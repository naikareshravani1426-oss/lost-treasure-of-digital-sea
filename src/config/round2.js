/**
 * round2.js — Single source of truth for Round II puzzle config.
 *
 * To change the puzzle:
 *   1. Update `clues` with your new hints.
 *   2. Run the snippet below in the browser console to get the SHA-256 hash
 *      of your new answer, then paste it into `passwordHash`.
 *
 *   async function sha256(str) {
 *     const buf = await crypto.subtle.digest(
 *       'SHA-256',
 *       new TextEncoder().encode(str)
 *     );
 *     return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2,'0')).join('');
 *   }
 *   sha256('864').then(console.log);
 *
 * Current answer (for testing): 864
 */

export const round2Config = {
  /** Four clues displayed to the player on the parchment panel. */
  clues: [
    'The digits add up to 18.',
    'The first digit is 4 more than the last digit.',
    'The middle digit is 2 more than the last digit.',
    'The last digit is even.',
  ],

  /**
   * SHA-256 hash of the correct 3-digit password string.
   * Generated from: crypto.subtle.digest('SHA-256', TextEncoder('864'))
   * Answer: 864
   */
  passwordHash:
    '8f97d9164b8fa131f0361abbe49fe706d3abfd77663ed7939ee20d361a0c6a67',
};

export default round2Config;
