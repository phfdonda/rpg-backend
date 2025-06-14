/**
 * Tipos e interfaces para o módulo Decisor
 */

export type NivelDificuldade = 'Trivial' | 'Simples' | 'Moderada' | 'Difícil' | 'Extrema'

export type NivelSucesso =
    | 'Falha Crítica'
    | 'Falha'
    | 'Sucesso Parcial'
    | 'Sucesso Total'
    | 'Sucesso Crítico'

export type FatorAcaso = -2 | -1 | 0 | 1 | 2

export interface DecisaoArbitro {
    nivelSucesso: NivelSucesso
    descricao: string
    modificadores: {
        narrativo: number
        acaso: FatorAcaso
    }
}

export interface ContextoDecisao {
    regras: string
    fichaPersonagem: string
    contexto: string
    acaoJogador: string
    fatorAcaso: FatorAcaso
}

