/**
 * Tipos e interfaces para o serviço de personagem
 */

export interface Atributos {
    forca: number
    destreza: number
    inteligencia: number
    constituicao: number
    carisma: number
}

export interface Habilidades {
    nome: string
    descricao: string
    nivel: number
    requisitos: {
        nivel?: number
        atributos?: Partial<Atributos>
    }
}

export interface Estado {
    tipo: string
    nivel: number
    duracao?: number
    efeitos: Record<string, any>
}

export interface Personagem {
    id: string
    nome: string
    nivel: number
    experiencia: number
    vida: {
        atual: number
        maximo: number
    }
    energia: {
        atual: number
        maximo: number
    }
    atributos: Atributos
    habilidades: Habilidades[]
    estados: Estado[]
    inventario: string // ID do inventário
    local: string
    inimigo?: string
}

export interface ModificacaoPersonagem {
    tipo: 'atributo' | 'habilidade' | 'estado' | 'vida' | 'energia' | 'experiencia'
    alvo: string
    valor: number | Partial<Atributos> | Habilidades | Estado
    operacao: 'adicionar' | 'remover' | 'modificar'
}

export interface ResultadoModificacao {
    sucesso: boolean
    mensagem: string
    personagem: Personagem
    modificacoes: ModificacaoPersonagem[]
}
