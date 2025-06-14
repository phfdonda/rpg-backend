/**
 * Regras e diretrizes para o módulo Criador
 */

import { DiretrizCriacao } from '../tipos'

export const DIRETRIZES_CRIACAO: DiretrizCriacao[] = [
    {
        titulo: 'Coerência Narrativa',
        descricao:
            'Garantir que todos os elementos criados mantenham coerência com a narrativa e entre si',
        prioridade: 1,
    },
    {
        titulo: 'Profundidade dos Elementos',
        descricao: 'Criar elementos com profundidade e detalhes que enriqueçam a experiência',
        prioridade: 2,
    },
    {
        titulo: 'Conexões Significativas',
        descricao: 'Estabelecer conexões significativas entre os elementos criados',
        prioridade: 3,
    },
    {
        titulo: 'Balanceamento',
        descricao: 'Manter o balanceamento entre desafios e recompensas',
        prioridade: 4,
    },
]

export const TIPOS_ELEMENTOS = {
    personagem: {
        atributosBase: ['vida', 'energia', 'força', 'destreza', 'inteligência'],
        relacionamentos: ['aliados', 'inimigos', 'objetivos'],
    },
    local: {
        atributosBase: ['tipo', 'clima', 'periculosidade'],
        relacionamentos: ['habitantes', 'conexoes', 'recursos'],
    },
    item: {
        atributosBase: ['tipo', 'raridade', 'valor'],
        relacionamentos: ['proprietario', 'localizacao', 'efeitos'],
    },
    inimigo: {
        atributosBase: ['vida', 'dano', 'resistencia'],
        relacionamentos: ['territorio', 'objetivos', 'fraquezas'],
    },
    evento: {
        atributosBase: ['tipo', 'impacto', 'duracao'],
        relacionamentos: ['participantes', 'consequencias', 'gatilhos'],
    },
}

export const REGRAS_CRIACAO = {
    narrativa: {
        introducao: 'Apresentar o contexto e os elementos principais',
        desenvolvimento: 'Expandir a história e introduzir conflitos',
        conclusao: 'Resolver conflitos e apresentar consequências',
    },
    elementos: {
        quantidade: {
            min: 3,
            max: 10,
        },
        profundidade: {
            minAtributos: 3,
            minRelacionamentos: 2,
        },
    },
    conexoes: {
        minPorElemento: 2,
        maxPorElemento: 5,
    },
}
