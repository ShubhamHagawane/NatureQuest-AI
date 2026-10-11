import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowRight, Clock3, Leaf, Shuffle, Sparkles } from 'lucide-react'
import QuestCard from '../components/QuestCard.jsx'

const questIdeas = [
  { id: 'idea-walk', title: 'Find a tiny wild thing', description: 'Take a slow stroll and spot one small sign of life you might usually walk past.', activity: 'walking', emoji: '🌼', duration: '15 min', reward: 'Notice the little things' },
  { id: 'idea-birds', title: 'Listen to your neighborhood', description: 'Find a comfortable spot outside. Close your eyes and count five different sounds.', activity: 'birdwatching', emoji: '🐦', duration: '10 min', reward: 'A quieter mind' },
  { id: 'idea-green', title: 'Give something a growing start', description: 'Water a windowsill herb or spend a few minutes noticing what is growing nearby.', activity: 'gardening', emoji: '🌱', duration: '20 min', reward: 'A little more green' },
]
const natureNotes = [
  'Look for the smallest thing moving in the breeze.',
  'Pause and listen for one sound you can’t see.',
  'Find a patch of sunlight and stand in it for a moment.',
  'Notice three different shades of green around you.',
]
const quickActivities = [
  { id: 'walking', label: 'A little walk', icon: '🚶' },
  { id: 'birdwatching', label: 'Bird sounds', icon: '🐦' },
  { id: 'observing', label: 'Nature spotting', icon: '🔎' },
]

export default function Home() {
  const [activity, setActivity] = useState('walking')
  const [minutes, setMinutes] = useState(20)
  const [noteIndex, setNoteIndex] = useState(0)
  const [noteVisible, setNoteVisible] = useState(true)
  function shuffleNote() {
    setNoteVisible(false)
    window.setTimeout(() => {
      setNoteIndex((index) => (index + 1 + Math.floor(Math.random() * (natureNotes.length - 1))) % natureNotes.length)
      setNoteVisible(true)
    }, 140)
  }

  return <main>
    <section className="hero">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-dot"/> YOUR NEXT LITTLE ADVENTURE</div>
        <h1>Make room for<br/><em>a little more wild.</em></h1>
        <p className="hero-lede">Small, thoughtful quests to help you step outside, slow down, and notice the nature already around you.</p>
        <div className="hero-actions"><Link className="button button-dark" to="/create">Make my first quest <ArrowRight size={17}/></Link><a href="#quick-start" className="quiet-link">How it works <ArrowDown size={15}/></a></div>
        <div className="hero-trust"><span className="trust-icon"><Clock3 size={16}/></span><span><strong>Just a few minutes</strong><small>No gear. No big plans. Just outside.</small></span></div>
      </div>
      <div className="hero-visual" role="img" aria-label="A sunny illustrated meadow with rolling green hills and wildflowers">
        <div className="sun"/><div className="hill hill-back"/><div className="hill hill-mid"/><div className="hill hill-front"/>
        <span className="floating-note note-one">take the scenic route</span><span className="floating-note note-two"><Leaf size={13}/> fresh air, free</span>
        <span className="flower flower-one">✿</span><span className="flower flower-two">✿</span><span className="flower flower-three">✿</span>
        <span className="bird bird-one">⌁</span><span className="bird bird-two">⌁</span>
        <div className="visual-caption"><span>STEP OUTSIDE</span><span>TAKE A DEEP BREATH</span></div>
        <div className="visual-sticker"><span>✦</span><small>A tiny adventure<br/>is waiting</small></div>
      </div>
    </section>

    <section className="quick-start" id="quick-start" aria-labelledby="quick-start-title">
      <div className="quick-start-heading"><span className="quick-icon"><Sparkles size={18}/></span><div><div className="eyebrow">A GOOD PLACE TO START</div><h2 id="quick-start-title">What feels doable today?</h2><p>Pick a mood and a little time. We’ll shape the quest around you.</p></div></div>
      <div className="quick-controls"><div className="quick-field"><span className="quick-label">I feel like…</span><div className="quick-activity-options">{quickActivities.map((item) => <button type="button" key={item.id} className={`quick-choice ${activity === item.id ? 'selected' : ''}`} aria-pressed={activity === item.id} onClick={() => setActivity(item.id)}><span>{item.icon}</span>{item.label}</button>)}</div></div><div className="quick-field quick-time"><span className="quick-label">I have…</span><div className="time-options">{[10, 20, 30].map((time) => <button type="button" key={time} className={`time-choice ${minutes === time ? 'selected' : ''}`} aria-pressed={minutes === time} onClick={() => setMinutes(time)}>{time}<small>min</small></button>)}</div></div><Link className="button button-dark quick-submit" to={`/create?activity=${activity}&minutes=${minutes}`}>Build my quest <ArrowRight size={17}/></Link></div>
    </section>

    <section className="nature-note" aria-live="polite"><div className={`nature-note-copy ${noteVisible ? 'visible' : ''}`}><span className="note-leaf">✳</span><span><strong>A little noticing goes a long way</strong><small>{natureNotes[noteIndex]}</small></span></div><button type="button" className="shuffle-button" onClick={shuffleNote}><Shuffle size={15}/> Another little idea</button></section>

    <section className="quest-section" id="quests"><div className="section-heading"><div><div className="eyebrow">NEED A LITTLE INSPIRATION?</div><h2>Small plans. <em>Lovely outside moments.</em></h2></div><Link to="/create" className="section-link">Make one just for me <ArrowRight size={16}/></Link></div><div className="quest-grid">{questIdeas.map((quest) => <Link key={quest.id} className="quest-idea-link" aria-label={`Create a quest inspired by ${quest.title}`} to={`/create?activity=${quest.activity}&minutes=${Number.parseInt(quest.duration, 10)}`}><QuestCard quest={quest}/></Link>)}</div></section>
  </main>
}
