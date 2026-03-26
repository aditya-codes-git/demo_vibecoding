import { fetchRecentExcuses, saveExcuse } from './supabase';
import { generateExcuse } from './gemini';

/**
 * Full orchestration: fetch past excuses → generate via Gemini → save → return.
 * @param {string} userId
 * @param {string} situation
 * @param {'normal'|'overdramatic'} mode
 * @returns {Promise<string>}
 */
export async function getExcuse(userId, situation, mode) {
  // 1. Retrieve recent excuses as context (MCP-like memory)
  const pastExcuses = await fetchRecentExcuses(userId, 5);

  // 2. Generate a new excuse via Gemini
  const excuse = await generateExcuse(situation, mode, pastExcuses);

  // 3. Persist the result (MCP-like action trigger)
  await saveExcuse({ userId, situation, excuse, mode });

  return excuse;
}
