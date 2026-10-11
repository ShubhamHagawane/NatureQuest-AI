
const samples = {
  walking: {
    title: 'The Five-Leaf Explorer',
    description: 'Find five different leaf shapes in a nearby park or garden. Compare their edges and colors without picking them, then note one difference that surprised you.',
    emoji: '🍃',
    reward: 'A closer look',
  },
  cycling: {
    title: 'The Greenway Detour',
    description: 'Take a familiar ride and choose one safe, quiet detour. Pause somewhere leafy and notice a detail you have never spotted before.',
    emoji: '🚲',
    reward: 'A new view',
  },
  gardening: {
    title: 'A Tiny Patch of Care',
    description: 'Spend a few minutes tending one plant or small patch. Notice the soil, new growth, and any visitors, leaving wildlife and flowers where they are.',
    emoji: '🌱',
    reward: 'A little more green',
  },
  birdwatching: {
    title: 'The Neighborhood Chorus',
    description: 'Find a comfortable place to pause. Listen for three distinct bird sounds and watch for movement in the trees without approaching nests.',
    emoji: '🐦',
    reward: 'A moment of wonder',
  },
  observing: {
    title: 'The Small Wonders Walk',
    description: 'Wander slowly and find three tiny details in nature: a pattern, a texture, and a sound. Take a moment with each one.',
    emoji: '🔎',
    reward: 'A fresh perspective',
  },
}

const questSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    instructions: {
      type: 'array',
      items: { type: 'string' },
      minItems: 3,
      maxItems: 4,
    },
    reflectionPrompt: { type: 'string' },
    emoji: { type: 'string' },
    reward: { type: 'string' },
  },
  required: [
    'title',
    'description',
    'instructions',
    'reflectionPrompt',
    'emoji',
    'reward',
  ],
  additionalProperties: false,
}

function validateQuest(value, preferences) {
  if (!value || typeof value !== 'object') {
    throw new Error('The model returned an invalid quest. Please try again.')
  }

  const instructions = Array.isArray(value.instructions)
    ? value.instructions
        .map((item) => String(item).trim())
        .filter(Boolean)
        .slice(0, 5)
    : []

  if (!value.title || instructions.length < 3) {
    throw new Error(
      'The model returned an incomplete quest. Please generate it again.'
    )
  }

  return {
    title: String(value.title).trim().slice(0, 100),
    description: String(value.description || '').trim().slice(0, 300),
    instructions: instructions.map((item) => item.slice(0, 180)),
    reflectionPrompt: String(
      value.reflectionPrompt ||
        'What did you notice outside that you might usually miss?'
    ).slice(0, 180),
    emoji: String(value.emoji || '🌿').slice(0, 8),
    reward: String(value.reward || 'A fresh perspective').slice(0, 80),
    durationMinutes: preferences.durationMinutes,
    difficulty: preferences.difficulty,
  }
}

export function getSampleQuest(preferences) {
  const sample = samples[preferences.activity] || samples.observing

  return validateQuest(
    {
      ...sample,
      instructions: [
        sample.description,
        'Pause somewhere comfortable and safe for three slow breaths.',
      ],
      reflectionPrompt: 'What small detail caught your attention?',
    },
    preferences
  )
}

export async function generateQuest(preferences) {
  const ollamaUrl = (
    process.env.OLLAMA_URL || 'http://localhost:11434'
  ).replace(/\/+$/, '')

  const model = process.env.OLLAMA_MODEL || 'gemma2:2b'

  const systemPrompt = `
You create safe, inclusive, practical outdoor nature quests.

Return ONLY a valid JSON object with these fields:
- title: short quest title
- description: short quest description
- instructions: array of 3 or 4 short steps
- reflectionPrompt: a question for reflection
- emoji: one emoji
- reward: short motivational phrase

Safety rules:
- Never suggest trespassing or unsafe routes.
- Never approach wildlife or nests.
- Never touch unknown plants or collect items from nature.
- Do not suggest smelling or eating unidentified plants.
- Do not claim to identify species.
- Keep activities suitable for the requested time and difficulty.
- Encourage users to respect nature and their surroundings.
- Do not include Markdown fences or text outside the JSON object.
`.trim()

  const userPrompt = `
Create an outdoor nature quest with these preferences:
Activity: ${preferences.activity}
Available time: ${preferences.durationMinutes} minutes
Difficulty: ${preferences.difficulty}
Location context: ${preferences.location || 'a nearby outdoor place'}

Make the quest practical, engaging, and achievable within the available time.
`.trim()

  let response

  try {
    response = await fetch(`${ollamaUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        stream: false,
        format: questSchema,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        options: {
          temperature: 0.7,
        },
      }),
      signal: AbortSignal.timeout(120000),
    })
  } catch (error) {
    if (error.name === 'TimeoutError') {
      throw new Error(
        'Gemma took too long to respond. Please try again.'
      )
    }

    throw new Error(
      'Cannot connect to Ollama. Make sure Ollama is installed and running.'
    )
  }

  if (!response.ok) {
    const errorText = await response.text()

    throw new Error(
      `Ollama request failed (${response.status}): ${errorText.slice(0, 300)}`
    )
  }

  const result = await response.json()
  const content = result.message?.content

  if (typeof content !== 'string' || !content.trim()) {
    throw new Error('Gemma returned an empty response. Please try again.')
  }

  try {
    return validateQuest(JSON.parse(content), preferences)
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(
        'Gemma returned invalid JSON. Please generate the quest again.'
      )
    }

    throw error
  }
}
