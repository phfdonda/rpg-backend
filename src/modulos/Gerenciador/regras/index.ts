import { TipoAcao } from '../tipos'

/**
 * Mapeamento de tipos de estado e suas progressões
 */
export const TIPOS_DE_ESTADO = {
    exaustao: ['disposto', 'ligeiramente ofegante', 'cansado', 'exausto', 'esgotado'],
    ferimento: ['arranhado', 'corte', 'ferimento', 'ferimento grave', 'ferimento crítico'],
    confusao: ['confuso', 'desorientado', 'atordoado', 'inconsciente'],
    veneno: ['envenenado leve', 'envenenado', 'envenenado grave', 'envenenado crítico'],
    sangramento: ['sangrando leve', 'sangrando', 'sangrando grave', 'sangrando crítico'],
}

/**
 * Mapeamento de progressão de estados
 */
export const PROGRESSAO_ESTADOS_MAP: Record<string, string[]> = {
    exaustao: ['disposto', 'ligeiramente ofegante', 'cansado', 'exausto', 'esgotado'],
    ferimento: ['arranhado', 'corte', 'ferimento', 'ferimento grave', 'ferimento crítico'],
    confusao: ['confuso', 'desorientado', 'atordoado', 'inconsciente'],
    veneno: ['envenenado leve', 'envenenado', 'envenenado grave', 'envenenado crítico'],
    sangramento: ['sangrando leve', 'sangrando', 'sangrando grave', 'sangrando crítico'],
}

/**
 * Regras para processamento de ações
 */
export const REGRAS_ACOES: Record<TipoAcao, string> = {
    modificar_item: `
        - Altera a quantidade de um item no inventário
        - Se quantidade for positiva, adiciona o item
        - Se quantidade for negativa, remove/gasta o item
        - Se quantidade final <= 0, remove o item do inventário
    `,
    modificar_estado: `
        - Adiciona, progride, regride ou remove um estado/ferimento
        - Ao adicionar: avança para o próximo nível de severidade
        - Ao remover: regride para o nível anterior ou remove se for o primeiro nível
    `,
    aumentar_recurso: `
        - Aumenta a quantidade de um recurso (moedas, mana, energia, vida)
        - Quantidade sempre deve ser positiva
    `,
    reduzir_recurso: `
        - Reduz a quantidade de um recurso
        - Quantidade sempre deve ser positiva
        - Recursos não podem ficar negativos (mínimo 0)
    `,
    alterar_local: `
        - Atualiza o campo 'local_atual' na ficha do personagem
    `,
    alterar_inimigo: `
        - Atualiza o campo 'inimigo_atual' na ficha do personagem
        - Se valor for null, remove o inimigo atual
    `,
    registrar_evento: `
        - Registra eventos puramente narrativos
        - Não exige mudança estrutural na ficha
        - Pode incluir detalhes adicionais sobre o evento
    `,
}

/**
 * Regras especiais para o Arquivista
 */
export const REGRAS_ESPECIAIS = {
    IMUTABILIDADE: `
        - SEMPRE retorne NOVOS OBJETOS E ARRAYS
        - Não modifique as estruturas originais diretamente
        - Crie novos objetos para cada nível de modificação
    `,
    LOG_PROGRESSO: `
        - Adicione uma nova entrada para cada turno
        - Resuma as principais ações e resultados
        - Use o relatório de resultados para detalhes
    `,
    RELATORIO: `
        - Cada solicitação deve gerar uma entrada
        - Descreva claramente as mudanças aplicadas
        - Mantenha o formato consistente
    `,
}

