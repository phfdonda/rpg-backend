/**
 * Tipos e interfaces para o serviço de inventário
 */

export interface Item {
    id: string
    nome: string
    descricao: string
    tipo: 'arma' | 'armadura' | 'consumivel' | 'chave' | 'outro'
    quantidade: number
    atributos: {
        peso?: number
        valor?: number
        durabilidade?: number
        efeitos?: Record<string, any>
    }
    requisitos?: {
        nivel?: number
        forca?: number
        destreza?: number
        inteligencia?: number
    }
}

export interface Inventario {
    id: string
    dono: string
    capacidade: number
    pesoAtual: number
    itens: Item[]
}

export interface OperacaoInventario {
    tipo: 'adicionar' | 'remover' | 'usar' | 'transferir'
    item: Item
    quantidade: number
    destino?: string
}

export interface ResultadoOperacao {
    sucesso: boolean
    mensagem: string
    inventarioAtualizado: Inventario
    itensAfetados: Item[]
}

