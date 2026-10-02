import { questions } from '../data/questions';

const HISTORY_KEY = 'lost_treasure_question_history';

/**
 * Gets a question randomly from the bank, avoiding questions that were already used
 * until all questions in the bank have been cycled through.
 */
export function getNextQuestion() {
  let usedIds = [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) {
      usedIds = JSON.parse(raw);
      if (!Array.isArray(usedIds)) usedIds = [];
    }
  } catch (e) {
    usedIds = [];
  }

  // Filter available questions
  let available = questions.filter(q => !usedIds.includes(q.id));

  // If all questions have been used, reset the cycle
  if (available.length === 0) {
    usedIds = [];
    available = [...questions];
  }

  // Pick random question from available pool
  const randomIndex = Math.floor(Math.random() * available.length);
  const selectedQuestion = available[randomIndex];

  // Record in history
  try {
    usedIds.push(selectedQuestion.id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(usedIds));
  } catch (e) {
    console.error('Failed to update question history:', e);
  }

  return selectedQuestion;
}

/**
 * Resets question history if needed
 */
export function resetQuestionHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    // Ignore
  }
}
