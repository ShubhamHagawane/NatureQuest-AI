import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Leaf } from 'lucide-react'
import QuestCard from '../components/QuestCard.jsx'
import { getQuests } from '../services/api.js'

export default function History() {
  const [quests, setQuests] = useState([])
  useEffect(() => { setQuests(getQuests()) }, [])
  const completed = quests.filter((quest) => quest.completed)
  return <main className="history-page"><div className="form-heading"><div className="eyebrow"><Leaf size={14}/> YOUR OUTSIDE STORY</div><h1>Look how far <em>you’ve wandered.</em></h1><p>Your quests and reflections live on this device, ready when you are.</p></div><div className="journey-stat"><span className="stat-icon">🌿</span><span><strong>{completed.length}</strong><small>little quests completed</small></span><span className="stat-divider"/><span><strong>{quests.length}</strong><small>adventures made</small></span></div>{completed.length ? <><div className="section-heading history-subhead"><div><div className="eyebrow">THE LITTLE THINGS ADD UP</div><h2>Your completed quests</h2></div></div><div className="quest-grid">{completed.map((quest) => <div key={quest.id}><QuestCard quest={quest}/>{quest.reflection && <p className="history-reflection">“{quest.reflection}”</p>}</div>)}</div></> : <div className="history-empty"><div className="empty-illustration">🌤️</div><h2>Your story starts outside.</h2><p>Complete a little quest and it’ll be waiting here for you.</p><Link className="button button-dark" to="/create">Find a little quest <ArrowRight size={17}/></Link></div>}</main>
}
