import { generateQuest, getSampleQuest } from '../services/aiService.js'

const activities = new Set(['walking', 'cycling', 'gardening', 'birdwatching'])

function readPreferences(body = {}) {
  const { activity, location = '', durationMinutes = 20, difficulty = 'Beginner' } = body
  if (!activities.has(activity) && activity !== 'observing') return { error: 'Choose a supported outdoor activity.' }
  const duration = Number(durationMinutes)
  if (![10, 15, 20, 30, 60].includes(duration)) return { error: 'Choose a time between 10 and 60 minutes.' }
  if (!['Beginner', 'Easy', 'Moderate'].includes(difficulty)) return { error: 'Choose a supported difficulty.' }
  return { activity, location: String(location).trim().slice(0, 100), durationMinutes: duration, difficulty }
}

export async function generate(req, res) {
  try {
    const preferences = readPreferences(req.body)
    if (preferences.error) return res.status(400).json({ error: preferences.error })
    res.json({ quest: { ...await generateQuest(preferences), id: crypto.randomUUID(), activity: preferences.activity, location: preferences.location || 'Your neighborhood', completed: false, createdAt: new Date().toISOString(), source: 'ai' } })
  } catch (error) {
    console.error('Quest generation failed:', error.message)
    res.status(503).json({ error: error.message || 'The local AI model could not generate a quest. Check that Ollama is running and the configured model is available.' })
  }
}

export function sample(req, res) {
  const preferences = readPreferences(req.query)
  if (preferences.error) return res.status(400).json({ error: preferences.error })
  res.json({ quest: { ...getSampleQuest(preferences), id: crypto.randomUUID(), activity: preferences.activity, location: preferences.location || 'Your neighborhood', completed: false, createdAt: new Date().toISOString(), source: 'sample' } })
}
