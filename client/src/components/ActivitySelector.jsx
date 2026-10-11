const activities = [
  { id: 'walking', icon: '🚶', name: 'A little walk', hint: 'Easy, any pace' },
  { id: 'birdwatching', icon: '🐦', name: 'Birdwatching', hint: 'Look up and listen' },
  { id: 'gardening', icon: '🌱', name: 'Gardening', hint: 'Get your hands dirty' },
  { id: 'cycling', icon: '🚲', name: 'Bike ride', hint: 'Let the path lead' },
  { id: 'observing', icon: '🔎', name: 'Nature spotting', hint: 'Notice the details' },
]

export default function ActivitySelector({ value, onChange }) {
  return <div className="activity-grid" role="group" aria-label="Choose an outdoor activity">{activities.map((activity) => <button type="button" key={activity.id} onClick={() => onChange(activity.id)} className={`activity-option ${value === activity.id ? 'selected' : ''}`} aria-pressed={value === activity.id}><span className="activity-icon" aria-hidden="true">{activity.icon}</span><span className="activity-name">{activity.name}</span><span className="activity-hint">{activity.hint}</span></button>)}</div>
}
