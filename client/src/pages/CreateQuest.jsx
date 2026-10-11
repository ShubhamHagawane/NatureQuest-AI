import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Clock3, Leaf, Sparkles } from 'lucide-react'
import ActivitySelector from '../components/ActivitySelector.jsx'
import QuestCard from '../components/QuestCard.jsx'
import { completeQuest, generateQuest, getSampleQuest as fetchSampleQuest, saveQuest } from '../services/api.js'

const validActivities = ['walking', 'cycling', 'gardening', 'birdwatching', 'observing']
const localSample = (prefs) => ({ id: crypto.randomUUID(), title: 'The Small Wonders Walk', description: 'Wander slowly and find three tiny details in nature: a pattern, a texture, and a sound.', instructions: ['Find a comfortable outdoor spot.', 'Notice one pattern, one texture, and one sound.', 'Pause for three slow breaths.'], reflectionPrompt: 'What small detail caught your attention?', emoji: '🔎', reward: 'A fresh perspective', activity: prefs.activity, location: prefs.location || 'Your neighborhood', durationMinutes: prefs.durationMinutes, difficulty: prefs.difficulty, completed: false, source: 'sample', createdAt: new Date().toISOString() })
const timeChoices = [10, 15, 20, 30, 60]
const difficultyChoices = [
  { id: 'Beginner', title: 'Very gentle', description: 'A simple, relaxed invitation' },
  { id: 'Easy', title: 'Easygoing', description: 'A little movement or exploring' },
  { id: 'Moderate', title: 'More active', description: 'A bit more effort or focus' },
]

export default function CreateQuest() {
  const [searchParams] = useSearchParams()
  const requestedActivity = searchParams.get('activity')
  const requestedTime = Number(searchParams.get('minutes'))
  const [activity, setActivity] = useState(validActivities.includes(requestedActivity) ? requestedActivity : 'walking')
  const [location, setLocation] = useState('')
  const [durationMinutes, setDurationMinutes] = useState(timeChoices.includes(requestedTime) ? requestedTime : 20)
  const [difficulty, setDifficulty] = useState('Beginner')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [quest, setQuest] = useState(null)
  const [reflection, setReflection] = useState('')

  const preferences = { activity, location, durationMinutes, difficulty }
  async function create(usingSample = false) {
    setLoading(true); setError('')
    try {
      let next
      if (usingSample) {
        try { next = (await fetchSampleQuest(preferences)).quest }
        catch { next = localSample(preferences) }
      } else next = (await generateQuest(preferences)).quest
      saveQuest(next); setQuest(next); setReflection('')
    } catch (err) { setError(err.message || 'Could not generate a quest. Please try again.') }
    finally { setLoading(false) }
  }
  function finishQuest() {
    const updated = completeQuest(quest.id, reflection)
    setQuest(updated)
  }

  if (quest) return <main className="form-page quest-result-page"><Link to="/" className="back-link"><ArrowLeft size={16}/> Back to explore</Link><div className="form-heading"><div className="eyebrow"><Sparkles size={14}/> {quest.source === 'sample' ? 'SAMPLE QUEST' : 'YOUR OPEN-WEIGHT AI QUEST'}</div><h1>Made just <em>for you.</em></h1><p>{quest.source === 'sample' ? 'A sample adventure to get you started.' : 'Here’s a little invitation to get outside and notice something new.'}</p></div><div className="result-card"><QuestCard quest={quest}/>{quest.completed ? <div className="saved-reflection"><Check size={18}/><span><strong>Lovely work. Quest complete.</strong><small>{quest.reflection || 'You made time to be outside. That counts.'}</small></span></div> : <div className="reflection-box"><div className="reflection-prompt-icon"><Leaf size={17}/></div><label htmlFor="reflection">When you get back, what did you notice?</label><p className="reflection-hint">No wrong answers. A word or a sentence is plenty.</p><textarea id="reflection" value={reflection} onChange={(event) => setReflection(event.target.value)} maxLength={500} placeholder={quest.reflectionPrompt || 'A sound, a color, a tiny surprise…'}/><button className="button button-dark" onClick={finishQuest}>I completed my quest <Check size={16}/></button></div>}</div><button className="text-button create-another" onClick={() => setQuest(null)}>Make another little quest</button></main>

  return <main className="form-page create-page"><Link to="/" className="back-link"><ArrowLeft size={16}/> Back to explore</Link><div className="form-heading"><div className="eyebrow"><Sparkles size={14}/> A QUEST, MADE FOR YOU</div><h1>Let’s make a <em>little plan.</em></h1><p>Choose what sounds good. You can keep it simple.</p></div>
    <form className="quest-form" onSubmit={(event) => { event.preventDefault(); create() }}>
      <fieldset className="form-section"><legend><span className="step-number">1</span><span><strong>What would you like to do?</strong><small>Pick the kind of outside that sounds nice.</small></span></legend><ActivitySelector value={activity} onChange={setActivity}/></fieldset>
      <fieldset className="form-section"><legend><span className="step-number">2</span><span><strong>How much time have you got?</strong><small>A few minutes outside still counts.</small></span></legend><div className="time-options">{timeChoices.map((time) => <button type="button" className={`time-choice ${durationMinutes === time ? 'selected' : ''}`} aria-pressed={durationMinutes === time} key={time} onClick={() => setDurationMinutes(time)}><Clock3 size={15}/>{time}<small>min</small></button>)}</div></fieldset>
      <fieldset className="form-section"><legend><span className="step-number">3</span><span><strong>What pace feels right?</strong><small>We’ll make the quest fit your energy.</small></span></legend><div className="difficulty-options">{difficultyChoices.map((option) => <button type="button" key={option.id} className={`difficulty-choice ${difficulty === option.id ? 'selected' : ''}`} aria-pressed={difficulty === option.id} onClick={() => setDifficulty(option.id)}><span className="difficulty-check">{difficulty === option.id && <Check size={13}/>}</span><strong>{option.title}</strong><small>{option.description}</small></button>)}</div></fieldset>
      <div className="form-section location-section"><label htmlFor="quest-location"><span className="step-number">4</span><span><strong>Where will you wander?</strong><small>Optional. A general place helps personalize your quest.</small></span></label><input id="quest-location" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="A nearby park, your backyard…" maxLength={100}/></div>
      {error && <div className="error-panel" role="alert"><p className="error-message">{error}</p><button className="text-button" type="button" disabled={loading} onClick={() => create(true)}>Try a sample quest instead <ArrowRight size={15}/></button></div>}
      <button className="button button-dark submit-button" disabled={loading}>{loading ? <><span className="loading-leaf">✳</span> Dreaming up your quest…</> : <>Make my little quest <ArrowRight size={17}/></>}</button><p className="form-footnote">Your choices stay simple. Quest history is saved on this device.</p>
    </form>
  </main>
}
