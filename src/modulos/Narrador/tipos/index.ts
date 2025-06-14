/**
 * Tipos e interfaces para o módulo Narrador
 */

export interface ContextoNarracao {
    fichaPersonagem: {
        nome: string
        vida_atual: number
        inventario: Record<
            string,
            {
                quantidade: number
                descricao?: string
            }
        >
        ferimentos_e_estados: Array<{
            tipo_ferimento: string
            estado_ferimento: string
            descricao?: string
        }>
        local_atual: string
        inimigo_atual: string | null
    }
    logProgresso: string[]
    relatorioArquivista: string[]
}

export interface Narracao {
    texto: string
    elementos: {
        ambiente: string[]
        acoes: string[]
        estados: string[]
        progresso: string[]
    }
}

export interface DiretrizNarrativa {
    titulo: string
    descricao: string
    prioridade: number
}
