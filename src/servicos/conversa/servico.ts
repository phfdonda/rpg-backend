/**
 * Serviço de Conversa - Gerencia interações e diálogos no jogo
 */

import { v4 as uuidv4 } from 'uuid'
import { Conversa, Mensagem, RespostaConversa, ContextoConversa } from './tipos'
import { Arbitro } from '@Decisor/agentes/arbitro'
import { Narrador } from '@Narrador/agentes/narrador'
import { ContextoDecisao, FatorAcaso } from '@Decisor/tipos'

export class ServicoConversa {
    private conversas: Map<string, Conversa> = new Map()
    private decisor: Arbitro
    private narrador: Narrador

    constructor() {
        this.decisor = new Arbitro()
        this.narrador = new Narrador()
    }

    async iniciarConversa(participantes: string[]): Promise<Conversa> {
        const conversa: Conversa = {
            id: uuidv4(),
            participantes,
            mensagens: [],
            estado: 'ativa',
        }

        this.conversas.set(conversa.id, conversa)
        return conversa
    }

    async enviarMensagem(
        conversaId: string,
        conteudo: string,
        tipo: Mensagem['tipo'],
        contexto?: ContextoConversa
    ): Promise<RespostaConversa> {
        const conversa = this.conversas.get(conversaId)
        if (!conversa) {
            throw new Error('Conversa não encontrada')
        }

        const mensagem: Mensagem = {
            id: uuidv4(),
            conteudo,
            tipo,
            timestamp: new Date(),
            contexto,
        }

        conversa.mensagens.push(mensagem)

        // Processa a mensagem usando o Decisor
        const contextoDecisao: ContextoDecisao = {
            regras: 'Regras padrão do jogo',
            fichaPersonagem: JSON.stringify(contexto?.personagem || {}),
            contexto: JSON.stringify(contexto || {}),
            acaoJogador: conteudo,
            fatorAcaso: (Math.floor(Math.random() * 5) - 2) as FatorAcaso, // Gera um fator de acaso entre -2 e 2
        }

        const decisao = await this.decisor.analisarAcao(contextoDecisao)

        // Gera a narrativa usando o Narrador
        const narrativa = await this.narrador.narrar({
            fichaPersonagem: {
                nome: contexto?.personagem?.nome || '',
                vida_atual: 100,
                inventario: {},
                ferimentos_e_estados: [],
                local_atual: contexto?.ambiente?.local || '',
                inimigo_atual: null,
            },
            logProgresso: conversa.mensagens.map((m) => m.conteudo),
            relatorioArquivista: [],
        })

        const resposta: RespostaConversa = {
            mensagem: {
                id: uuidv4(),
                conteudo: narrativa.texto,
                tipo: 'sistema',
                timestamp: new Date(),
            },
            acoes: [decisao.descricao],
            proximosPassos: [`Nível de Sucesso: ${decisao.nivelSucesso}`],
        }

        conversa.mensagens.push(resposta.mensagem)
        return resposta
    }

    async encerrarConversa(conversaId: string): Promise<void> {
        const conversa = this.conversas.get(conversaId)
        if (!conversa) {
            throw new Error('Conversa não encontrada')
        }

        conversa.estado = 'encerrada'
        this.conversas.delete(conversaId)
    }

    getConversa(conversaId: string): Conversa | undefined {
        return this.conversas.get(conversaId)
    }

    listarConversas(): Conversa[] {
        return Array.from(this.conversas.values())
    }
}

