import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const isRealKey = apiKey && !apiKey.includes('your_gemini_api_key');
const genAI = isRealKey ? new GoogleGenerativeAI(apiKey) : null;

/**
 * Discover which models are available for this API key.
 */
async function findWorkingModel() {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    if (!res.ok) {
      console.error('ListModels failed:', res.status, await res.text());
      return null;
    }
    const data = await res.json();
    console.log('Available models:', data.models?.map(m => m.name));

    const contentModels = data.models?.filter(m =>
      m.supportedGenerationMethods?.includes('generateContent')
    );

    if (contentModels && contentModels.length > 0) {
      const preferred = contentModels.find(m => m.name.includes('flash'))
        || contentModels.find(m => m.name.includes('pro'))
        || contentModels[0];
      const modelId = preferred.name.replace('models/', '');
      console.log('Selected model:', modelId);
      return modelId;
    }
  } catch (err) {
    console.error('Error listing models:', err);
  }
  return null;
}

/**
 * Build the structured prompt based on the user's selected mode.
 */
function buildPrompt(situation, mode, pastExcuses) {
  const previousExcusesText =
    pastExcuses.length > 0
      ? pastExcuses
          .map(
            (e, i) =>
              `${i + 1}. [${e.mode}] Situation: "${e.situation}" → Excuse: "${e.excuse}"`
          )
          .join('\n')
      : 'None yet.';

  return `You are an AI Excuse Generator that creates unique, context-aware excuses.

User Input:
"${situation}"

Mode:
"${mode}"

Previous Excuses (from database):
${previousExcusesText}

Your task:
1. Generate a new excuse based on the user input.
2. Use previous excuses (if any) to avoid repetition.
3. Ensure the response is natural, creative, and different from past ones.

Mode behavior:

- Normal:
  - Realistic and believable
  - Casual tone
  - 2–3 lines

- Overdramatic:
  - Highly exaggerated and emotional
  - Storytelling style
  - Slightly funny
  - 3–4 lines

- Professional:
  - Formal and polite tone
  - Suitable for emails or workplace
  - Clear and structured
  - 2–3 lines

- Funny:
  - Light humor and playful tone
  - Not too exaggerated
  - Easy to read
  - 2–3 lines

- Savage:
  - Blunt, bold, slightly sarcastic
  - Confident tone
  - Short and impactful (1–2 lines)

Rules:
- Do not repeat ideas from previous excuses
- Keep responses concise
- Match tone strictly based on selected mode

Reply with ONLY the excuse text. No labels, no quotation marks, no prefix like "Excuse:" — just the excuse itself.`;
}

/**
 * Generate an excuse using Google Gemini.
 * @param {string} situation
 * @param {string} mode - 'normal' | 'overdramatic' | 'professional' | 'funny' | 'savage'
 * @param {Array} pastExcuses
 * @returns {Promise<string>}
 */
export async function generateExcuse(situation, mode, pastExcuses = []) {
  if (!genAI) {
    return "Gemini API key is missing. Please set VITE_GEMINI_API_KEY in your .env file.";
  }

  const prompt = buildPrompt(situation, mode, pastExcuses);

  const modelId = await findWorkingModel();
  if (!modelId) {
    throw new Error("No Gemini models available for your API key. Please check that the 'Generative Language API' is enabled in Google Cloud Console.");
  }

  try {
    console.log(`Generating with model: ${modelId}`);
    const model = genAI.getGenerativeModel({ model: modelId });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (err) {
    console.error(`Gemini generation error (${modelId}):`, err);
    throw new Error(`Gemini API error: ${err.message}`);
  }
}
