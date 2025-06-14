/**
 * Tipos e interfaces para o módulo Gerenciador
 */

export type TipoAcao =
    | 'modificar_item'
    | 'modificar_estado'
    | 'aumentar_recurso'
    | 'reduzir_recurso'
    | 'alterar_local'
    | 'alterar_inimigo'
    | 'registrar_evento'

export interface AcaoBase {
    tipo: TipoAcao
    descricao?: string
}

export interface AcaoModificarItem extends AcaoBase {
    tipo: 'modificar_item'
    item: string
    quantidade: number
}

export interface AcaoModificarEstado extends AcaoBase {
    tipo: 'modificar_estado'
    tipo_estado: string
    acao: 'adicionar' | 'remover'
}

export interface AcaoRecurso extends AcaoBase {
    tipo: 'aumentar_recurso' | 'reduzir_recurso'
    recurso: string
    quantidade: number
}

export interface AcaoAlterarLocal extends AcaoBase {
    tipo: 'alterar_local'
    novo_local: string
}

export interface AcaoAlterarInimigo extends AcaoBase {
    tipo: 'alterar_inimigo'
    novo_inimigo: string | null
}

export interface AcaoRegistrarEvento extends AcaoBase {
    tipo: 'registrar_evento'
    evento: string
    detalhes?: Record<string, any>
}

export type Acao =
    | AcaoModificarItem
    | AcaoModificarEstado
    | AcaoRecurso
    | AcaoAlterarLocal
    | AcaoAlterarInimigo
    | AcaoRegistrarEvento

export interface RespostaArquivista {
    ficha_do_personagem_atualizada: Record<string, any>
    log_de_progresso_completo: string[]
    relatorio_de_resultados: string[]
    error?: string
}

export interface Estado {
    tipo_ferimento: string
    estado_ferimento: string
    descricao?: string
}

export interface Item {
    quantidade: number
    descricao?: string
    uso_conhecido?: string[]
}

export interface FichaPersonagem {
    nome: string
    inventario: Record<string, Item>
    ferimentos_e_estados: Estado[]
    moedas: {
        ouro: number
    }
    vida_atual: number
    local_atual: string
    inimigo_atual: string | null
}
