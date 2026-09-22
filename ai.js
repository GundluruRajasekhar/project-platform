const Anthropic = require('@anthropic-ai/sdk');

const hasKey = Boolean(process.env.ANTHROPIC_API_KEY);
const anthropic = hasKey ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null;

/**
 * Ask Claude for structured JSON only. Strips markdown fences defensively
 * in case the model wraps the JSON in ```json ... ```.
 *
 * Graceful local fallback: if ANTHROPIC_API_KEY isn't set, we skip the real
 * API call and return a templated response so the feature still demos and
 * the rest of the app stays usable. Set ANTHROPIC_API_KEY later to switch
 * on real AI output with zero code changes.
 */
async function askForJSON(prompt, fallbackFn) {
  if (!hasKey) {
    return fallbackFn();
  }

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('\n');

  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}

module.exports = { askForJSON, aiEnabled: hasKey };
