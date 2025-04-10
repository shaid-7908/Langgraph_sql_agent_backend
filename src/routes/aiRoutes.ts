import express from 'express'

import { AiAgentController } from '../controllers/aiAgentController'

const aiRouter = express.Router()

aiRouter.post('/ask-ai',AiAgentController.streamGraphResponse)

export default aiRouter