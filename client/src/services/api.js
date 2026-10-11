const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
const HISTORY_KEY = 'naturequest-history-v1'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, { headers: { 'Content-Type': 'application/json' }, ...options })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.error || 'Something went wrong. Please try again.')
  return payload
}

export const generateQuest = (preferences) => request('/quests/generate', { method: 'POST', body: JSON.stringify(preferences) })
export const getSampleQuest = (preferences) => request(`/quests/sample?${new URLSearchParams(preferences)}`)

export function getQuests() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') } catch { return [] }
}

export function saveQuest(quest) {
  const quests = getQuests().filter((item) => item.id !== quest.id)
  localStorage.setItem(HISTORY_KEY, JSON.stringify([quest, ...quests]))
}

export function completeQuest(id, reflection) {
  const quests = getQuests().map((quest) => quest.id === id ? { ...quest, completed: true, reflection: reflection.trim(), completedAt: new Date().toISOString() } : quest)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(quests))
  return quests.find((quest) => quest.id === id)
}
