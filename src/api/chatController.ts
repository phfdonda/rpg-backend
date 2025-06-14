/**
 * Controlador de Chat - Integração entre API e serviços do jogo
 */

import { Request, Response } from 'express'
import { ServicoConversa } from '@servicos/conversa'

const servicoConversa = new ServicoConversa()

export async function chatHandler(req: Request, res: Response): Promise<void> {
    try {
        const { conversaId, mensagem, tipo, contexto } = req.body
        let conversaIdUsado = conversaId
        let conversa

        // Se não houver conversa, inicia uma nova
        if (!conversaId) {
            conversa = await servicoConversa.iniciarConversa(['jogador', 'sistema'])
            conversaIdUsado = conversa.id
        } else {
            conversa = servicoConversa.getConversa(conversaIdUsado)
            if (!conversa) {
                res.status(404).json({ error: 'Conversa não encontrada' })
                return
            }
        }

        // Envia a mensagem e processa a resposta
        const resposta = await servicoConversa.enviarMensagem(
            conversaIdUsado,
            mensagem,
            tipo || 'jogador',
            contexto
        )

        res.json({
            conversaId: conversaIdUsado,
            resposta,
        })
    } catch (error) {
        console.error('Erro no chatHandler:', error)
        res.status(500).json({ error: 'Erro ao processar mensagem do chat' })
    }
}

