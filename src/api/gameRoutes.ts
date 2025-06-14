import { Router } from 'express'
import { chatHandler } from '@api/chatController'

const router = Router()

// Rota de chat usando o controlador modularizado
router.post('/chat', async (req, res) => {
    await chatHandler(req, res)
})

export default router
