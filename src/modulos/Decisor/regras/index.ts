import { NivelDificuldade, NivelSucesso, FatorAcaso } from '../tipos'

/**
 * Regras para determinação do nível de dificuldade
 */
export const REGRAS_DIFICULDADE: Record<NivelDificuldade, string> = {
    Trivial:
        'Tarefas tão simples que quase qualquer um pode realizar. Não exige grande proficiência ou atenção.',
    Simples:
        'Exige alguma noção básica da tarefa, mas um iniciante ainda pode se complicar. Amadores precisam de concentração, e profissionais fazem facilmente.',
    Moderada:
        'Tarefas que exigem alguma proficiência. Iniciantes não têm chance, amadores precisariam de ajuda ou sorte. Profissionais acertam normalmente.',
    Difícil:
        'Desafios significativos. Amadores não têm chance. Profissionais precisam de sorte ou ajuda. Peritos acertam normalmente, mas com atenção.',
    Extrema:
        'Tarefas que beiram o impossível para a maioria. Profissionais não têm chance. Apenas mestres têm alguma garantia de sucesso, peritos precisam de sorte ou ajuda.',
}

/**
 * Regras para fator de acaso
 */
export const REGRAS_ACASO: Record<FatorAcaso, string> = {
    [-2]: 'Azar Terrível: Diminui o resultado em dois níveis',
    [-1]: 'Azar Moderado: Diminui o resultado em um nível',
    [0]: 'Neutro: Sem alteração',
    [1]: 'Sorte Moderada: Aumenta o resultado em um nível',
    [2]: 'Sorte Grandiosa: Aumenta o resultado em dois níveis',
}

/**
 * Regras para determinação do nível de sucesso
 */
export const REGRAS_SUCESSO: Record<NivelSucesso, string> = {
    'Falha Crítica': 'PJ < Dificuldade (em 2+ níveis)',
    Falha: 'PJ < Dificuldade (em 1 nível)',
    'Sucesso Parcial': 'PJ = Dificuldade',
    'Sucesso Total': 'PJ > Dificuldade (em 1 nível)',
    'Sucesso Crítico': 'PJ > Dificuldade (em 2+ níveis)',
}

