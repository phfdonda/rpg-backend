/**
 * Regras e diretrizes para o módulo Narrador
 */

import { DiretrizNarrativa } from '../tipos'

export const DIRETRIZES_NARRATIVAS: DiretrizNarrativa[] = [
    {
        titulo: 'Descrição Ambiental',
        descricao: 'Descreva o ambiente atual, incluindo elementos visuais, sonoros e atmosféricos',
        prioridade: 1,
    },
    {
        titulo: 'Reações às Ações',
        descricao: 'Descreva as consequências imediatas das ações do personagem',
        prioridade: 2,
    },
    {
        titulo: 'Coerência Narrativa',
        descricao: 'Mantenha a narrativa coerente com o estado atual do personagem e do ambiente',
        prioridade: 3,
    },
    {
        titulo: 'Escolhas do Jogador',
        descricao: 'Apresente as escolhas disponíveis de forma clara e contextualizada',
        prioridade: 4,
    },
]

export const ESTILO_NARRATIVO = {
    tom: 'sombrio e misterioso',
    ritmo: 'tenso e envolvente',
    detalhamento: 'rico em detalhes sensoriais',
    foco: 'experiência imersiva do personagem',
}

export const FORMATO_SAIDA = {
    tipo: 'texto narrativo livre',
    elementos: [
        'descrição do ambiente',
        'consequências das ações',
        'estado do personagem',
        'escolhas disponíveis',
    ],
    restricoes: [
        'sem formatação adicional',
        'sem marcadores ou numeração',
        'sem separadores explícitos',
    ],
}

