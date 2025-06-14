import { Router, RequestHandler } from 'express'
import { Logger } from '@utils/logger'
import { Interprete } from '@Decisor/agentes/interprete'

const router = Router()
const interprete = new Interprete()

const chatHandler: RequestHandler = async (req, res) => {
    try {
        const { message } = req.body
        Logger.info('1. ChatHandler iniciado')
        Logger.info(`2. Corpo da requisição: ${JSON.stringify(req.body)}`)

        if (!message) {
            Logger.error('3. Mensagem não fornecida')
            res.status(400).json({
                error: 'Mensagem não fornecida',
            })
            return
        }

        Logger.game(`4. Mensagem recebida: ${message}`)

        const interpretacao = await interprete.interpretar(message)
        Logger.agent(`5. Interpretação: ${JSON.stringify(interpretacao)}`)

        const resposta =
            interpretacao.tipo === 'INCOMPREENSIVEL'
                ? 'Por favor, reformule sua mensagem para que eu possa entender melhor.'
                : `Entendi! Você está ${interpretacao.tipo === 'INTERPRETACAO' ? 'interpretando seu personagem' : 'se comunicando comigo'}. ${interpretacao.descricao}`

        Logger.info(`6. Resposta preparada: ${resposta}`)

        const respostaFinal = {
            mensagem: message,
            tipo: interpretacao.tipo,
            descricao: interpretacao.descricao,
            resposta: resposta,
        }

        Logger.info(`7. Enviando resposta: ${JSON.stringify(respostaFinal)}`)
        res.json(respostaFinal)
    } catch (error) {
        Logger.error(`8. Erro ao processar mensagem: ${error}`)
        res.status(500).json({
            error: 'Erro ao processar a mensagem',
        })
    }
}

router.post('/chat', chatHandler)

export default router

