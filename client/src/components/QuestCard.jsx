import { ArrowUpRight, Clock3, MapPin } from 'lucide-react'

export default function QuestCard({ quest, onComplete }) {
  const duration = quest.durationMinutes ? `${quest.durationMinutes} min` : quest.duration || '20 min'
  return <article className="quest-card">
    <div className={`quest-art art-${quest.activity || 'walking'}`}><span className="quest-emoji" aria-hidden="true">{quest.emoji || '🌿'}</span><span className="art-label">{quest.source === 'sample' ? 'SAMPLE IDEA' : quest.activity || 'OUTSIDE TIME'}</span><span className="art-sparkle sparkle-a">✳</span><span className="art-sparkle sparkle-b">✦</span></div>
    <div className="quest-content"><div className="quest-meta"><span><Clock3 size={14}/>{duration}{quest.difficulty ? ` · ${quest.difficulty}` : ''}</span><span><MapPin size={14}/>{quest.location || 'Your neighborhood'}</span></div><h3>{quest.title}</h3><p>{quest.description}</p>
      {quest.instructions?.length > 0 && <ol className="quest-instructions">{quest.instructions.map((step, index) => <li key={index}><span>{index + 1}</span>{step}</li>)}</ol>}
      <div className="quest-footer"><span className="quest-reward">✦ {quest.reward || 'A fresh perspective'}</span>{onComplete && <button className="text-button" onClick={() => onComplete(quest.id)}>Done <ArrowUpRight size={15}/></button>}{quest.completed && <span className="completed-pill">Completed ✓</span>}</div>
    </div>
  </article>
}
