/**
 * Tipos e interfaces para o módulo Criador
 */

export interface ElementoJogo {
    id: string
    nome: string
    descricao: string
    tipo: 'personagem' | 'local' | 'item' | 'inimigo' | 'evento'
    atributos: Record<string, any>
    relacionamentos?: Record<string, string[]>
}

export interface ContextoCriacao {
    tema: string
    genero: string
    elementosExistentes: ElementoJogo[]
    restricoes?: string[]
    requisitos?: string[]
}

export interface Criacao {
    elementos: ElementoJogo[]
    narrativa: {
        introducao: string
        desenvolvimento: string
        conclusao: string
    }
    conexoes: {
        entreElementos: Record<string, string[]>
        comNarrativa: Record<string, string[]>
    }
}

export interface DiretrizCriacao {
    titulo: string
    descricao: string
    prioridade: number
}
