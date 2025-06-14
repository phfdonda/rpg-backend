// src/app.ts

import express, { Request, Response } from 'express'
import cors from 'cors'
import path from 'path'
import { GEMINI_API_KEY } from '@config/env'
import gameRoutes from '@api/gameRoutes'
import 'dotenv/config'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))

// Rotas da API
app.use('/api', gameRoutes)

// Rota de teste
app.get('/', (_req: Request, res: Response) => {
    res.send('Servidor RPG LLM em TypeScript está rodando!')
})

// Inicializa o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
    if (!GEMINI_API_KEY) {
        console.warn('AVISO: GEMINI_API_KEY não está configurada!')
    }
})
