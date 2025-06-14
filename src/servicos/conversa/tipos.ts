/**
 * Tipos e interfaces para o serviço de conversa
 */

export interface Mensagem {
    id: string
    conteudo: string
    tipo: 'jogador' | 'sistema' | 'npc'
    timestamp: Date
    contexto?: Record<string, any>
}

export interface Conversa {
    id: string
    participantes: string[]
    mensagens: Mensagem[]
    estado: 'ativa' | 'encerrada'
    metadata?: Record<string, any>
}

export interface RespostaConversa {
    mensagem: Mensagem
    acoes: string[]
    proximosPassos: string[]
}

export interface ContextoConversa {
    personagem: {
        nome: string
        estado: string[]
        inventario: Record<string, number>
    }
    ambiente: {
        local: string
        npcs: string[]
        objetos: string[]
    }
    historico: Mensagem[]
}
