/**
 * Tipos globais e enums compartilhados entre módulos
 */

// Tipos de ação genéricos
export type TipoAcao =
    | 'modificar_item'
    | 'modificar_estado'
    | 'aumentar_recurso'
    | 'reduzir_recurso'
    | 'alterar_local'
    | 'alterar_inimigo'
    | 'registrar_evento'
    | 'usar_item'
    | 'modificar_personagem'

// Tipos de recurso
export type TipoRecurso = 'vida' | 'energia' | 'experiencia' | 'moeda'

// Tipos de entidade
export type TipoEntidade = 'personagem' | 'npc' | 'inimigo' | 'item' | 'local' | 'evento'

// Enum para status de operação
export enum StatusOperacao {
    SUCESSO = 'sucesso',
    FALHA = 'falha',
}

// Tipo para ID universal
export type ID = string

// Tipo para datas ISO
export type DataISO = string

// Tipo para logs genéricos
export interface LogGenerico {
    data: DataISO
    mensagem: string
    tipo: string
    detalhes?: Record<string, any>
}

