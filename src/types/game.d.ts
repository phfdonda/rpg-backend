// src/types/game.d.ts

// --- Tipos Base e Enums (Mantidos da versão anterior) ---

type TipoRecursoQualitativo = "vida" | "mana" | "energia"
type TipoRecursoNumerico = "ouro" | "prata" | "cobre"
type TipoEstado =
	| "exaustao"
	| "envenenamento"
	| "sangramento"
	| "confusao"
	| "atordoamento"
	| "medo"
type TipoEstadoAcao = "adicionar" | "remover"
type ModificarEntidadeAcao = "atualizar" | "remover"
type TipoHabilidade =
	| "combate_armado"
	| "combate_desarmado"
	| "arcoeflecha"
	| "furtividade"
	| "habilidades_sociais"
	| "magia_elemental"
	| "alquimia"
	| "medicina"
	| "investigacao"
	| "sobrevivencia"
	| "negociacao"
	| "percepcao"
	| "manipulacao_social"
	| "conjuracao" // Adicionado conjuracao

// --- Interfaces para as Ações do Jogo (Solicitações do Intérprete/Estrategista) ---
// (Estas ações são o que o Intérprete ou Estrategista traduzem em ações mecânicas)
interface ModificarItemAction {
	tipo: "modificar_item"
	item: string
	quantidade: number
	descricao?: string
}
interface AumentarRecursoNumericoAction {
	tipo: "aumentar_recurso_numerico"
	recurso: TipoRecursoNumerico
	quantidade: number
	descricao?: string
}
interface ReduzirRecursoNumericoAction {
	tipo: "reduzir_recurso_numerico"
	recurso: TipoRecursoNumerico
	quantidade: number
	descricao?: string
}
interface ProgredirEstadoRecursoAction {
	tipo: "progredir_estado_recurso"
	recurso: TipoRecursoQualitativo
	descricao?: string
}
interface RegredirEstadoRecursoAction {
	tipo: "regredir_estado_recurso"
	recurso: TipoRecursoQualitativo
	descricao?: string
}
interface ModificarEstadoAction {
	tipo: "modificar_estado"
	tipo_estado: TipoEstado
	acao: TipoEstadoAcao
	descricao?: string
}
interface AlterarLocalAction {
	tipo: "alterar_local"
	novo_local: string
}
interface RegistrarEventoAction {
	tipo: "registrar_evento"
	evento: string
	detalhes?: Record<string, any>
	descricao?: string
}
interface ModificarEntidadeAction {
	tipo: "modificar_entidade"
	entidade_id: string
	acao: ModificarEntidadeAcao
	detalhes?: {
		nome?: string
		descricao?: string
		estado_saude?: string
		estados?: string[]
		[key: string]: any
	}
	descricao?: string
}
interface SolicitarProgressoHabilidadeAction {
	tipo: "solicitar_progresso_habilidade"
	habilidade: TipoHabilidade
	justificativa?: string
	descricao?: string
}

// NOVO: Ação de Combate explícita
interface AcaoCombate {
	tipo: "acao_combate"
	acao:
		| "ataque"
		| "defender"
		| "fugir"
		| "habilidade_especial"
		| "conjurar_magia"
	alvo_id?: string // ID do alvo (jogador ou outro NPC)
	habilidade_usada?: TipoHabilidade | string // Habilidade ou magia específica
	detalhes?: {
		// Detalhes específicos para o Arbitro resolver
		dano_base?: string // Ex: "2d4", "1d6+2"
		tipo_dano?: string // Ex: "Perfurante", "Corte", "Fogo", "Necrótico"
		efeitos_secundarios?: AcaoDoJogo[] // Ex: "alvo_envenenado"
		custo_mana?: number
		custo_energia?: number
		[key: string]: any
	}
	descricao?: string // Descrição narrativa da ação
}

// União de todas as ações que o Intérprete/Estrategista podem propor
type AcaoDoJogo =
	| ModificarItemAction
	| AumentarRecursoNumericoAction
	| ReduzirRecursoNumericoAction
	| ProgredirEstadoRecursoAction
	| RegredirEstadoRecursoAction
	| ModificarEstadoAction
	| AlterarLocalAction
	| RegistrarEventoAction
	| ModificarEntidadeAction
	| SolicitarProgressoHabilidadeAction
	| AcaoCombate // ADICIONADO AcaoCombate

// SolicitacoesAgrupadas: O que o Intérprete OU Estrategista gera (entrada para o Árbitro)
interface SolicitacoesAgrupadas {
	solicitacoes_de_custo: AcaoDoJogo[]
	solicitacoes_de_efeito_proposto: AcaoDoJogo[]
}

// InterpreteOutput: A saída completa do Intérprete (mantido)
interface InterpreteOutputSuccess {
	status: "sucesso"
	solicitacoes: SolicitacoesAgrupadas
}
interface InterpreteOutputClarification {
	status: "clarificacao_necessaria"
	mensagem_clarificacao: string
}
interface InterpreteOutputOffGame {
	status: "pergunta_off_game"
	pergunta: string
}
type InterpreteOutput =
	| InterpreteOutputSuccess
	| InterpreteOutputClarification
	| InterpreteOutputOffGame

// --- Interfaces da Ficha do Personagem e Entidades ---
interface ItemInventario {
	quantidade: number
	descricao?: string
	uso_conhecido?: string[]
}
interface EstadoPersonagem {
	tipo_ferimento: TipoEstado
	estado_ferimento: string
	descricao?: string
}
interface EntidadeAtiva {
	nome: string
	descricao?: string
	estado_saude?: string
	estados?: string[]
	[key: string]: any
}
interface Habilidade {
	grau_de_maestria: string
}
interface FichaPersonagem {
	nome: string
	inventario: { [itemName: string]: ItemInventario }
	ferimentos_e_estados: EstadoPersonagem[]
	moedas: { ouro?: number; prata?: number; cobre?: number }
	vida_atual: string
	mana_atual?: string
	energia_atual?: string
	local_atual: string
	inimigos_ativos: { [id: string]: EntidadeAtiva } // Mantido como inimigos para o jogador ver
	objetos_interagiveis_ativos: { [id: string]: EntidadeAtiva }
	habilidades: { [habilidadeName in TipoHabilidade]?: Habilidade }
	[key: string]: any // Permite flexibilidade
}
type LogProgresso = string[] // O registro textual do que aconteceu no jogo

// --- Interfaces para FichaNPC (Detalhes do Personificador) ---
type TipoNPC =
	| "aliado"
	| "neutro"
	| "antagonista"
	| "mercador"
	| "mentor"
	| "capanga"
	| "vilao_principal"
	| "coadjuvante" // Adicionado tipos para Estrategista

interface DetalhesNPC {
	id: string // ID único para o NPC (AGORA É OBRIGATÓRIO)
	nome: string
	tipo_npc: TipoNPC
	aparencia: string // Descrição detalhada da aparência
	personalidade_explicita: string // Como ele se apresenta
	motivacao_principal: string
	historico_conciso?: string // Breve resumo
	natureza_oculta?: string // Segredos, traços que não são óbvios
	habilidades_relevantes?: (TipoHabilidade | string)[] // Ex: "ótimo espadachim", "habilidoso em barganha", "magia_negra" (PODE SER string para magias customizadas)
	relacoes_com_personagens?: { id_entidade: string; tipo_relacao: string }[]
	itens_comuns?: { item: string; quantidade: number }[]
	vida_atual?: string // NPCs também podem ter vida
	mana_atual?: string
	energia_atual?: string
	ferimentos_e_estados?: EstadoPersonagem[]
	[key: string]: any
}

// --- INTERFACES DOS AGENTES REFINADOS E RECÉM-DEFINIDOS ---

// 1. Árbitro (mantido a definição anterior)
type ResultadoAcaoArbitro =
	| "sucesso_critico"
	| "sucesso_total"
	| "sucesso_parcial"
	| "falha"
	| "falha_crítica"
	| "invalida"
interface AcaoDecididaPeloArbitro {
	acao_original: AcaoDoJogo
	resultado: ResultadoAcaoArbitro
	mudancas_propostas?: { [key: string]: any }
	justificativa?: string
	consequencias_adicionais?: AcaoDoJogo[]
}
interface DecisoesArbitro {
	status: "ok" | "necessita_reavaliacao"
	decisoes: AcaoDecididaPeloArbitro[]
	mensagem_para_orquestrador?: string
}

// 2. Roteirista (Mantido, mas agora pode ter eventos cronometrados)
type TipoEventoNarrativo =
	| "encontro"
	| "desafio"
	| "dialogo"
	| "revelacao"
	| "transicao_cena"
	| "ponto_de_virada"
	| "resolucao_arco_personagem"
	| "gancho_futuro"
	| "novo_objetivo"

interface DetalheEventoNarrativo {
	tipo: TipoEventoNarrativo
	descricao_sumaria: string
	entidades_envolvidas?: {
		id?: string
		nome: string
		tipo: "npc" | "inimigo" | "objeto"
	}[]
	local_sugerido?: string
	informacao_secreta?: boolean
	ganchos_futuros?: string[]
	detalhes_especificos?: Record<string, any>
	npc_requerido_id?: string
	item_requerido_id?: string
	// NOVO: Campo para eventos com duração/trigger temporal
	trigger_temporal?: {
		tipo: "tempo_decorrido" | "data_especifica" | "interacoes"
		valor: string | number // Ex: "5 dias", "data_do_solsticio", 10 (interações)
		consequencia_ao_ativar: string // Descrição do que acontece quando o trigger é ativado
	}
}

interface PlanoNarrativo {
	proxima_cena: string
	objetivos_do_jogador_sugeridos?: string[]
	eventos_chave: DetalheEventoNarrativo[]
	elementos_de_ambiente_sugeridos?: string[]
	questoes_em_aberto_narrativa?: string[]
	requisicoes_criacao?: { tipo: "npc" | "item"; detalhes_basicos: string }[]
}

// 3. Arquiteto (Manter as definições anteriores, adicionando FichaLocal como principal saída para o local)
interface ConexaoLocal {
	nome_local: string
	tipo_conexao: "caminho" | "porta" | "portal"
	requisitos?: string[]
}
interface FichaLocal {
	id: string
	nome: string
	tipo_local:
		| "masmorra"
		| "cidade"
		| "floresta"
		| "taverna"
		| "ruina"
		| "forte"
		| "passagem"
	historia_geral_concisa: string
	proposito_atual_ou_condicao?: string
	caracteristicas_gerais: string[]
	habitantes_comuns_tipo?: string[]
	estrutura_geografica?: {
		tipo_estrutura: "mapa_interno" | "linear" | "aberto"
		comodos_mapa?: {
			[comodoId: string]: {
				nome: string
				conexoes: string[]
				tipo_comodo?: string
				desc_generica?: string
			}
		}
	}
	pontos_de_interesse_lore?: {
		nome: string
		tipo: string
		descricao_curta: string
		localizacao_relativa?: string
	}[]
	[key: string]: any
}
interface SolicitacaoCriacaoLocal {
	nome_sugerido?: string
	tipo_desejado: FichaLocal["tipo_local"]
	requisitos_narrativos_e_lore: string
}

// 4. Cartógrafo (Manter as definições anteriores)
interface SolicitacaoPlantaLocal {
	tipo_local: FichaLocal["tipo_local"]
	requisitos_estrutura: string
	dimensao_sugerida?: "pequena" | "media" | "grande"
}
interface ComodoGeografico {
	id: string
	nome_generico: string
	conexoes: string[]
	desc_geografica_simples?: string
	tipo_passagem?: "porta_simples" | "passagem_secreta" | "buraco_na_parede"
	[key: string]: any
}
interface DadosGeograficosLocal {
	estrutura_geral: "mapa_interno" | "linear" | "aberto"
	comodos: { [comodoId: string]: ComodoGeografico }
	entrada_principal_id: string
}

// 5. Cenógrafo (Manter as definições anteriores)
interface SolicitacaoAmbientacao {
	id_comodo: string
	ficha_local: FichaLocal
	eventos_relevantes_atuais?: string[]
	condicao_personagem_para_sentidos?: {
		luz: string
		ruido: string
		visao: string
	}
}
interface DescricaoAmbientacao {
	id_comodo: string
	prosa_detalhada: string
	elementos_interagiveis_sugeridos?: {
		nome: string
		descricao_curta: string
	}[]
	rastros_de_lore_mencionados?: string[]
}

// 6. Artífice (Manter as definições anteriores)
type TipoItem =
	| "arma"
	| "armadura"
	| "consumivel"
	| "equipamento"
	| "chave"
	| "material"
	| "tesouro"
	| "vestimenta"
interface PropriedadeItem {
	nome: string
	valor: string | number | boolean
	descricao_efeito?: string
}
interface DetalhesItem {
	nome: string
	tipo: TipoItem
	descricao: string
	quantidade_inicial: number
	valor_monetario?: number
	peso?: number
	propriedades_especificas?: PropriedadeItem[]
	uso_conhecido?: string[]
	artefato?: boolean
}
interface SolicitacaoCriacaoItem {
	nome_sugerido?: string
	tipo_desejado?: TipoItem
	requisitos_narrativos?: string
}

// 7. Oráculo (Manter as definições anteriores)
type PadraoComportamento =
	| "agressivo"
	| "furtivo"
	| "diplomatico"
	| "explorador"
	| "recoletor"
	| "curioso"
	| "cauteloso"
	| "impulsivo"
interface InsightsOraculo {
	padroes_de_comportamento_do_jogador?: PadraoComportamento[]
	preferencias_narrativas_sugeridas?: string[]
	predicoes_de_proxima_acao?: string[]
	pontos_cegos_do_jogador?: string[]
	sugestoes_de_dificuldade?: "facil" | "normal" | "desafiador" | "extremo"
}

// 8. Personificador (Manter as definições anteriores, usando a FichaNPC para os detalhes)
interface SolicitacaoCriacaoNPC {
	nome_sugerido?: string
	tipo_desejado?: TipoNPC
	requisitos_narrativos?: string
}

// --- NOVAS INTERFACES PARA ESTRATEGISTA E CRONISTA ---

// 9. Estrategista
interface EstrategistaOutput {
	plano_estrategico_npc: string
	acoes_propostas: SolicitacoesAgrupadas[] // Pode conter múltiplas ações agrupadas
}

// 10. Cronista
interface EventoComContagemRegressiva {
	// Interface para os eventos que o Cronista monitora
	id: string // ID único do evento para rastreamento
	nome: string
	tempo_restante_narrativo: string // Ex: "3 turnos", "4 horas", "1 dia e 12 horas"
	consequencia_final:
		| AcaoDoJogo
		| AcaoDoJogo[]
		| { tipo: "narrativa"; descricao: string } // Pode ser uma ação direta ou apenas algo para o Narrador
	tipo_evento?: "enredo_principal" | "efeito_status" | "ambiente" | "recurso"
	[key: string]: any // Para detalhes adicionais
}

interface EventoPassivoConcluidoNarrativa {
	nome_evento: string
	descricao_consequencia: string // Ex: "A tocha se apagou."
}

interface RelatorioTempoNarrativo {
	passagem_tempo_narrativo: string // Ex: "Alguns minutos se passaram.", "Um dia completo se encerrou."
	eventos_passivos_concluidos_narrativa: EventoPassivoConcluidoNarrativa[]
	alertas_ritmo_narrativa: string[] // Se o jogador está enrolando ou ignorando urgências
}

interface InsightsCronistaParaRoteirista {
	ritmo_atual_do_jogo: "lento" | "normal" | "rapido"
	eventos_proximos_narrativa_cronometrados: {
		nome_evento: string
		tempo_restante_narrativo: string
	}[]
	sugestoes_ajuste_roteiro: string[]
}

interface CronistaOutput {
	relatorio_para_diretor: RelatorioTempoNarrativo
	acoes_para_arquivista: AcaoDoJogo[]
	insights_para_roteirista: InsightsCronistaParaRoteirista
	eventos_com_contagem_regressiva_atualizados: EventoComContagemRegressiva[]
}

// 11. Diretor (Refinado para coordenar Cenógrafo e Cronista)
// Input: Incluir agora RelatorioTempoNarrativo (do Cronista)
interface OrientacaoNarrativa {
	tipo:
		| "evento_principal"
		| "reacao_personagem"
		| "desc_ambiente"
		| "dialogo_npc"
		| "item_encontrado"
		| "inimigo_derrotado"
		| "progresso_habilidade"
		| "resposta_off_game"
		| "clarificacao_necessaria"
		| "passagem_de_tempo"
		| "evento_passivo_concluido"
		| "alerta_ritmo" // Adicionado tipos para Cronista
	texto_base?: string
	id_comodo_ambientado?: string
	entidades_envolvidas?: {
		id?: string
		nome: string
		tipo: "npc" | "inimigo" | "objeto"
		estado?: string
	}[]
	foco_emocional?: string
	detalhes_adicionais_para_prosa?: Record<string, any>
	mostrar_prosa_direta_da_ficha?: boolean
	mensagem_para_jogador?: string
	nivel_sigilo?: "publico" | "sigiloso_roteirista" | "sigiloso_diretor"
}

interface BriefingNarrador {
	orientacoes_narrativas: OrientacaoNarrativa[]
	sugestoes_de_proximas_acoes_jogador?: string[]
	ficha_parcial_para_narracao?: FichaPersonagem
}

// --- FIM DAS INTERFACES DOS AGENTES ---

// Reajuste do ArquivistaOutput para refletir nova entrada/saída do Árbitro
interface ArquivistaOutput {
	ficha_do_personagem_atualizada: FichaPersonagem
	log_de_progresso_completo: LogProgresso
	relatorio_de_resultados: string[] // Texto descritivo do que o Arquivista fez
	error?: string
}

// O NarradorOutput é o texto final que o jogador recebe
type NarradorOutput = string
