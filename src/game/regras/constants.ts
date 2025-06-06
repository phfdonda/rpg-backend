// // src/game/constants.ts

// import { FichaPersonagem, LogProgresso } from "../../types/game"

// // --- Ficha Inicial do Personagem ---
// export const FICHA_INICIAL_PERSONAGEM: FichaPersonagem = {
// 	nome: "Aelys",
// 	ocupacao: "Mago Aprendiz",
// 	ferimentos_e_estados: [
// 		{
// 			tipo_ferimento: "exaustao",
// 			estado_ferimento: "exaustao_leve",
// 			descricao: "Uma leve exaustão mental pela conjuração recente.",
// 		},
// 	],
// 	inventario: {
// 		"poção de cura": {
// 			quantidade: 2,
// 			descricao:
// 				"Uma garrafa pequena com um líquido vermelho borbulhante.",
// 			uso_conhecido: ["restaura_saude_leve"],
// 		},
// 		"cajado de madeira": {
// 			quantidade: 1,
// 			descricao: "Um cajado simples de carvalho.",
// 			uso_conhecido: ["arma_combate_corpo_a_corpo", "foco_magico_basico"],
// 		},
// 		flecha: {
// 			quantidade: 5,
// 			descricao: "Flechas de madeira com pontas de ferro.",
// 		},
// 	},
// 	habilidades_magicas: {
// 		"mãos flamejantes": {
// 			descricao:
// 				"Uma labareda concentrada que pode ser disparada das mãos do mago, causando dano de queimadura em um único alvo ou incendiando objetos leves.",
// 			custo_narrativo: "exaustao_leve",
// 			efeito_conhecido: ["causa_dano_queimadura", "incendeia_objetos"],
// 		},
// 		"luz arcana": {
// 			descricao:
// 				"Conjura uma pequena orbe de luz flutuante que ilumina uma área equivalente a uma tocha, durando por alguns minutos.",
// 			custo_narrativo: "foco_mental_leve",
// 			efeito_conhecido: ["ilumina_area", "afasta_trevas_magicas"],
// 		},
// 	},
// 	moedas: {
// 		ouro: 50,
// 		prata: 20,
// 		cobre: 100,
// 	},
// 	local_atual: "Uma caverna escura, úmida e com cheiro de mofo.",
// 	inimigo_atual:
// 		"Um goblin faminto com um olhar malicioso e uma faca enferrujada.",
// }

// // --- Log de Progresso Inicial ---
// export const LOG_INICIAL_PROGRESSO: LogProgresso = []

// export const TIPOS_DE_RECURSO_VALIDOS = [
// 	"ouro",
// 	"prata",
// 	"cobre",
// 	"mana",
// 	"energia",
// 	"vida_atual",
// ]

// export const TIPOS_DE_ESTADO = {
// 	fisico: [
// 		"exaustao",
// 		"corte",
// 		"contusao",
// 		"fratura",
// 		"torcao",
// 		"sangrando",
// 		"envenenado",
// 		"doente",
// 		"queimado",
// 		"cego",
// 		"surdo",
// 		"aleijado",
// 		"paralisado_fisico",
// 		"atordoado",
// 	],
// 	mental: [
// 		"confusao",
// 		"loucura",
// 		"furia",
// 		"panico",
// 		"desorientado",
// 		"fascinado",
// 		"amnesico",
// 		"iludido",
// 		"traumatizado",
// 		"insone",
// 	],
// 	emocional: [
// 		"deprimido",
// 		"confiante",
// 		"amedrontado",
// 		"esperancoso",
// 		"desesperado",
// 		"determinado",
// 		"apatico",
// 		"euforico",
// 		"culpa",
// 		"orgulho",
// 	],
// 	magico: [
// 		"encantado",
// 		"paralisado_magico",
// 		"silenciado",
// 		"amaldicoado",
// 		"abencoado",
// 		"transformado",
// 		"possesso",
// 		"ligado_magicamente",
// 		"vulneravel_magia",
// 		"resistente_magia",
// 	],
// }

// export const PROGRESSAO_ESTADOS_MAP = {
// 	// Físico
// 	exaustao: ["ligeiramente_ofegante", "cansado", "exaurido", "colapso"],
// 	corte: ["arranhado", "ferido", "corte_profundo", "hemorragia_severa"],
// 	contusao: ["dolorido", "hematoma", "dor_aguda", "membro_comprometido"],
// 	fratura: [
// 		"rachadura",
// 		"fratura_simples",
// 		"fratura_exposta",
// 		"dano_permanente",
// 	],
// 	torcao: ["distendido", "torcao_leve", "torcao_grave", "ruptura_total"],
// 	sangrando: [
// 		"sangramento_leve",
// 		"sangramento_moderado",
// 		"sangramento_intenso",
// 		"choque_hipovolemico",
// 	],
// 	envenenado: [
// 		"leve_envenenamento",
// 		"envenenado_moderado",
// 		"envenenado_grave",
// 		"falencia_organica",
// 	],
// 	doente: [
// 		"leve_doenca",
// 		"doente_moderado",
// 		"doente_grave",
// 		"doenca_terminal",
// 	],
// 	queimado: [
// 		"queimadura_leve",
// 		"queimadura_moderada",
// 		"queimadura_grave",
// 		"carbonizado",
// 	],
// 	cego: [
// 		"visao_turva",
// 		"parcialmente_cego",
// 		"totalmente_cego",
// 		"cegueira_permanente",
// 	],
// 	surdo: [
// 		"audicao_reduzida",
// 		"parcialmente_surdo",
// 		"totalmente_surdo",
// 		"surdez_permanente",
// 	],
// 	aleijado: [
// 		"mancando",
// 		"dificuldade_de_movimento",
// 		"incapacidade_permanente",
// 	], // Menos níveis, mais focado na consequência
// 	paralisado_fisico: [
// 		"rigidez_muscular",
// 		"imovel",
// 		"paralisia_extensa",
// 		"estado_vegetativo",
// 	],
// 	atordoado: ["desorientacao_leve", "tonto", "inconsciente", "coma"],

// 	// Mental
// 	confusao: [
// 		"perplexo",
// 		"pensamento_lento",
// 		"desorientacao_mental",
// 		"delirio_severo",
// 	],
// 	loucura: ["mania", "paranoia", "alucinacao", "psicose"],
// 	furia: ["irritado", "agressivo", "berserk"],
// 	panico: ["ansiedade", "medo_intenso", "terror", "colapso_nervoso"],
// 	desorientado: ["perda_de_raciocinio", "sem_direcao", "amnesia_temporaria"],
// 	fascinado: ["hipnotizado", "controle_mental", "servidao_mental"], // Progressão para um controle maior
// 	amnesico: [
// 		"esquecido_parcialmente",
// 		"totalmente_amnesico",
// 		"perda_total_de_memoria",
// 	],
// 	iludido: ["cair_na_ilusao", "crenca_absoluta", "dissociacao_da_realidade"],
// 	traumatizado: ["choque_emocional", "flashbacks", "sindrome_do_panico"],
// 	insone: ["sonolento", "exaustao_mental", "psicose_induzida"],

// 	// Emocional
// 	deprimido: ["triste", "melancolico", "desesperanca", "ideacao_suicida"],
// 	confiante: ["otimista", "convicto", "arrogante"], // "Megalomania" e "auto_destruicao" podem ser mais desfechos do que progressões do estado em si.
// 	amedrontado: ["apreensivo", "terrorizado", "fobia_extrema"],
// 	esperancoso: ["otimista_leve", "inspirado", "desesperanca_crescente"],
// 	desesperado: ["resignado", "sem_saida", "impulso_destrutivo"],
// 	determinado: ["foco_total", "obstinado", "fanatismo"],
// 	apatico: ["indiferente", "sem_reacao", "letargia_profunda"],
// 	euforico: ["alegria_intensa", "mania_emocional", "mania_psicotica"],
// 	culpa: ["arrependimento", "remorso", "auto_depreciacao"],
// 	orgulho: ["satisfacao", "arrogancia_por_orgulho", "hibris"],

// 	// Mágico
// 	encantado: ["sob_influencia", "controlado", "marionete_magica"],
// 	paralisado_magico: [
// 		"imovel_por_magia",
// 		"magicamente_aprisionado",
// 		"congelado_no_tempo",
// 	],
// 	silenciado: ["voz_fraca", "incapaz_de_conjurar", "magicamente_mudo"],
// 	amaldicoado: ["maleficio_leve", "maleficio_grave", "maldicao_terminal"],
// 	abencoado: [
// 		"beneficio_leve",
// 		"beneficio_poderoso",
// 		"sobrecarregado_por_bencao",
// 	], // "Essencia_instavel" e "explosao_magica" seriam resultados de superabundância, não progressão da benção.
// 	transformado: [
// 		"forma_instavel",
// 		"transformado_completamente",
// 		"mutacao_irreversivel",
// 	],
// 	possesso: ["controle_parcial", "totalmente_possesso", "fusao_de_almas"],
// 	ligado_magicamente: ["conexao_fraca", "conexao_forte", "dreno_de_energia"],
// 	vulneravel_magia: [
// 		"defesa_magica_reduzida",
// 		"sem_defesa_magica",
// 		"absorcao_negativa_de_magia",
// 	],
// 	resistente_magia: [
// 		"resistencia_leve",
// 		"alta_resistencia",
// 		"esgotamento_magico_severo",
// 	],
// }

// // --- Modificadores de Qualidade da Descrição Narrativa (para cálculo de sucesso) ---
// export const MODIFICADORES_QUALIDADE_NARRATIVA: { [key: string]: number } = {
// 	ruim: -1,
// 	mediana: 0,
// 	boa: +1,
// 	excelente: +2,
// }

// // --- Modificadores de Probabilidade Narrativa da Ação (para cálculo de sucesso) ---
// export const MODIFICADORES_PROBABILIDADE: { [key: string]: number } = {
// 	improvavel: -2,
// 	baixa: -1,
// 	media: 0,
// 	alta: +1,
// 	certa: +2,
// }

// // --- Faixas de Resultado Mecânico (para determinar o tipo de sucesso/falha) ---
// // Formato: [min_valor, max_valor, "TIPO_DE_RESULTADO"]
// export const FAIXAS_RESULTADO_MECANICO: [number, number, string][] = [
// 	[1, 10, "FALHA_CRITICA"],
// 	[11, 30, "FALHA_SIMPLES"],
// 	[31, 70, "SUCESSO_NORMAL"],
// 	[71, 90, "SUCESSO_BOM"],
// 	[91, 100, "SUCESSO_CRITICO"],
// ]

// // --- Instruções de Sistema para os Modelos LLM ---

// export const system_instruction_narrador = `
// Você é o Narrador do jogo. Sua função é transformar as informações fornecidas pelo Orquestrador em uma prosa rica, envolvente e imaginativa, que continue a história do RPG.

// Você deve responder APENAS com a prosa narrativa. **Não adicione nenhum JSON, nem qualquer texto além da narrativa.**

// Detalhes para a Narrativa:
// -   **Fluxo Contínuo:** A narrativa deve ser uma continuação natural do log de progresso anterior.
// -   **Contexto:** Use o 'contexto_para_narrador' para moldar a descrição do que está acontecendo.
// -   **Resultado Mecânico:** Incorpore o 'resultado_mecanico_final' (SUCESSO_CRITICO, FALHA_SIMPLES, etc.) de forma orgânica na narrativa.
//     * **Sucesso Crítico:** Descreva a ação com maestria, com resultados surpreendentemente favoráveis e épicos e detalhes vívidos.
//     * **Sucesso Bom:** A ação é bem-sucedida, talvez com um pequeno bônus ou um toque elegante.
//     * **Sucesso Normal:** A ação é realizada com o esperado, sem grandes destaques.
//     * **Falha Simples:** A ação falha, mas as consequências não são desastrosas. Pode haver um contratempo ou um atraso.
//     * **Falha Crítica:** A ação falha de forma espetacular, com consequências negativas graves e inesperadas.
// -   **Relatório do Arquivista:** Se houver um 'relatorio_de_resultados_arquivista', integre as informações sobre custos e efeitos (especialmente as falhas) na narrativa de forma coesa.
// -   **Ficha e Log Atualizados:** Use a 'ficha_do_personagem_atualizada' e o 'log_de_progresso_completo' para garantir que a narrativa seja consistente com o estado atual do jogo.
// -   **Engajamento:** Mantenha o jogador engajado, usando descrições sensoriais e uma linguagem rica.
// -   **Conclusão do Turno:** A narrativa deve levar a uma nova situação ou dilema, convidando o jogador à próxima ação.

// **Exemplo de interação:**
// Ação do Jogador: "Aelys tenta conjurar 'mãos flamejantes' para incendiar a teia de aranha gigante que bloqueia o caminho."
// Ficha Atualizada: {Aqui vem a ficha atualizada do personagem}
// Log Atualizado: {Aqui vem o log de progresso atualizado}
// Contexto para Narrador: "Aelys tenta usar magia de fogo para queimar uma teia de aranha gigante e liberar o caminho."
// Resultado Mecânico Final: "SUCESSO_BOM"
// Relatório do Arquivista: ["Ferimento 'exaustao' (leve) adicionado."]

// Resposta esperada (prosa):
// "Com um brilho determinado nos olhos, Aelys estende as mãos, as palmas faiscando com energia arcana. Uma labareda vibrante irrompe, lambendo a espessa teia de aranha à sua frente. O fogo crepita e ruge, e com uma intensidade surpreendente, a teia começa a murchar e se consumir em cinzas incandescentes, abrindo uma passagem clara. Aelys sente uma leve pontada de exaustão, mas a satisfação da magia bem-sucedida o impulsiona para frente. O caminho agora está desobstruído, revelando uma passagem ainda mais escura adiante."`
