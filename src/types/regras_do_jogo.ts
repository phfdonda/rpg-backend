// Tipos e constantes para as regras do jogo

export const graus_de_maestria = {
  mestre: 'Extremamente proficiente, quase sem falhas em condições normais.',
  perito: 'Muito bom, raramente falha em condições normais, destaque em sua área.',
  bom: 'Acima da média, competente na maioria das situações.',
  mediano:
    'Capacidade normal, desempenho mediano, pode falhar ou ter sucesso dependendo das circunstâncias.',
  iniciante: 'Pouca prática, propenso a erros, sucesso é raro e difícil.',
  pessimo: 'Quase nenhuma capacidade, muito propenso a falhas.',
} as const

export const dificuldade_tarefa = {
  trivial: 'Quase impossível de falhar para "Mediano" ou superior.',
  simples:
    '"Bom" ou superior tem sucesso fácil. "Mediano" precisa de sorte/circunstâncias favoráveis.',
  moderada: '"Perito" tem sucesso fácil. "Bom" precisa de sorte. "Mediano" é difícil.',
  dificil: '"Mestre" tem sucesso em condições normais. "Perito" precisa de sorte ou ajuda.',
  extrema:
    'Apenas "Mestre" com sorte ou condições muito favoráveis pode ter sucesso. "Perito" pode ter sucesso parcial.',
} as const

export const comparacao_maestria = {
  superior: 'Se a Habilidade do Executor for 2 ou mais graus acima da Habilidade do Oponente.',
  equilibrada: 'Se a Habilidade do Executor estiver dentro de 1 grau da Habilidade do Oponente.',
  inferior: 'Se a Habilidade do Executor for 2 ou mais graus abaixo da Habilidade do Oponente.',
} as const

export const modificadores_circunstancia = {
  vantagem_significativa:
    'Grande ajuda (ex: escuridão total para Furtividade, arma lendária para Combate). Pode melhorar o resultado em até 2 níveis.',
  vantagem_menor:
    'Ajuda pequena (ex: cobertura parcial, leve distração). Pode melhorar o resultado em 1 nível.',
  desvantagem_menor:
    'Pequeno obstáculo (ex: chão escorregadio, ruído leve). Pode piorar o resultado em 1 nível.',
  desvantagem_significativa:
    'Grande obstáculo (ex: cegueira, ferimento grave, exaustão severa). Pode piorar o resultado em até 2 níveis.',
} as const

export const influencia_acaso = {
  muita_sorte:
    'Pode elevar o resultado em 2 níveis. Permite "Sucesso Crítico" mesmo em situações difíceis.',
  sorte_inesperada:
    'Pode elevar o resultado em 1 nível. Ajuda a transformar sucesso em crítico em condições favoráveis.',
  neutro: 'Nenhuma mudança no resultado.',
  azar_inesperado:
    'Pode rebaixar o resultado em 1 nível. Pode levar a "Falha Crítica" em situações já difíceis.',
  muito_azar: 'Pode rebaixar o resultado em 2 níveis. Aumenta muito a chance de "Falha Crítica".',
} as const

export const tipos_resultado = {
  sucesso_critico: 'Resultado excepcional, com benefícios adicionais ou efeitos espetaculares.',
  sucesso_total: 'Ação realizada com êxito, sem problemas.',
  sucesso_parcial: 'Ação realizada com êxito, mas com custo, complicação ou efeito reduzido.',
  falha: 'Ação não realizada.',
  falha_critica:
    'Ação não realizada com consequências negativas adicionais ou revés significativo.',
  invalida: 'Ação não pode ser tentada devido a pré-requisitos não atendidos.',
} as const

export const resultados_combate = {
  sucesso_critico: 'Causa Ferimento Grave ao alvo e pode impor um Estado Negativo adicional.',
  sucesso_total: 'Causa Ferimento Leve ao alvo.',
  sucesso_parcial: 'Causa Ferimento Superficial ou impõe Desvantagem Menor ao alvo.',
  falha: 'Não causa dano.',
  falha_critica: 'Não causa dano e pode impor Ferimento Superficial ao atacante.',
} as const

export const estados_saude = {
  intacto: 'Sem ferimentos.',
  saudavel: 'Pequenos arranhões, mas plenamente capaz.',
  ferimento_superficial: 'Marcas menores, sem impacto mecânico imediato.',
  ferimento_leve:
    'Redução menor na capacidade de combate, pode impor Desvantagem Menor em ações complexas.',
  ferimento_moderado: 'Dificuldade clara, impõe Desvantagem Menor em todas as ações.',
  ferimento_grave:
    'Capacidade severamente comprometida, impõe Desvantagem Significativa em todas as ações.',
  incapacitado: 'Não pode agir.',
  morto: 'Vira cadáver (objeto), o corpo mantido na descrição para manter a coerência narrativa.',
} as const

// Tipos para as constantes
export type GrauMaestria = keyof typeof graus_de_maestria
export type DificuldadeTarefa = keyof typeof dificuldade_tarefa
export type ComparacaoMaestria = keyof typeof comparacao_maestria
export type ModificadorCircunstancia = keyof typeof modificadores_circunstancia
export type InfluenciaAcaso = keyof typeof influencia_acaso
export type TipoResultado = keyof typeof tipos_resultado
export type ResultadoCombate = keyof typeof resultados_combate
export type EstadoSaude = keyof typeof estados_saude
