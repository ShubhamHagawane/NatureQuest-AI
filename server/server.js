import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import questRoutes from './routes/questRoutes.js'

const app = express()
const port = process.env.PORT || 3001

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
app.use(express.json({ limit: '20kb' }))
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api/quests', questRoutes)
app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({ error: 'The server could not complete that request.' })
})

app.listen(port, () => console.log(`NatureQuest API listening on http://localhost:${port}`))
