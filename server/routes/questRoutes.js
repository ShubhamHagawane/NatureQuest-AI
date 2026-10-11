import { Router } from 'express'
import { generate, sample } from '../controllers/questController.js'

const router = Router()
router.post('/generate', generate)
router.get('/sample', sample)
export default router
