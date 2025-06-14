// src/app.ts

import express, { Request, Response } from 'express'
import cors from 'cors'
import path from 'path'
import { GEMINI_API_KEY } from '@config/env'
import gameRoutes from '@api/gameRoutes'
import { Logger } from '@utils/logger'
import 'dotenv/config'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))

// Middleware de logging para requisições
app.use((req: Request, _res: Response, next) => {
    Logger.info(`Requisição recebida: ${req.method} ${req.path}`)
    if (req.body && Object.keys(req.body).length > 0) {
        Logger.game(`Mensagem do jogador: ${JSON.stringify(req.body)}`)
    }
    next()
})

// Rotas da API
app.use('/api', gameRoutes)

// Rota de teste
app.get('/', (_req: Request, res: Response) => {
    res.send('Servidor RPG LLM em TypeScript está rodando!')
})

// Inicializa o servidor
app.listen(PORT, () => {
    Logger.success(`Servidor iniciado em http://localhost:${PORT}`)

    // Verificação de configurações
    if (!GEMINI_API_KEY) {
        Logger.error('GEMINI_API_KEY não está configurada! O sistema não funcionará corretamente.')
    } else {
        Logger.success('GEMINI_API_KEY configurada com sucesso')
    }

    // Log de inicialização do agente
    Logger.agent('Agente de interpretação inicializado e aguardando comandos')
    Logger.info('Sistema pronto para receber interações dos jogadores')
})
