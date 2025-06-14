/**
 * Agente Narrador - Responsável por gerar narrativas imersivas
 */

import { gemini } from '../../../infra/ia'
import { GeminiResponse } from '../../../infra/ia/gemini/tipos'
import { ContextoNarracao, Narracao } from '../tipos'
import { DIRETRIZES_NARRATIVAS, ESTILO_NARRATIVO, FORMATO_SAIDA } from '../regras'

export class Narrador {
    private criarPrompt(contexto: ContextoNarracao): string {
        return `
Você é o Narrador do jogo, responsável por criar uma experiência imersiva e envolvente.

OBJETIVO:
- Criar narrativas que transportem o jogador para o mundo do jogo
- Manter a coerência com o estado atual do personagem e do ambiente
- Apresentar escolhas de forma clara e contextualizada

ESTILO E TOM:
- Tom: ${ESTILO_NARRATIVO.tom}
- Ritmo: ${ESTILO_NARRATIVO.ritmo}
- Detalhamento: ${ESTILO_NARRATIVO.detalhamento}
- Foco: ${ESTILO_NARRATIVO.foco}

DIRETRIZES NARRATIVAS:
${DIRETRIZES_NARRATIVAS.map((d) => `- ${d.titulo}: ${d.descricao}`).join('\n')}

FORMATO DE SAÍDA:
- Tipo: ${FORMATO_SAIDA.tipo}
- Elementos a incluir:
${FORMATO_SAIDA.elementos.map((e) => `  * ${e}`).join('\n')}
- Restrições:
${FORMATO_SAIDA.restricoes.map((r) => `  * ${r}`).join('\n')}

CONTEXTO ATUAL:
${JSON.stringify(contexto, null, 2)}

Responda apenas com um objeto JSON contendo:
{
    "texto": "sua narrativa completa",
    "elementos": {
        "ambiente": ["elementos do ambiente mencionados"],
        "acoes": ["ações realizadas"],
        "estados": ["estados do personagem"],
        "progresso": ["elementos de progresso"]
    }
}`
    }

    async narrar(contexto: ContextoNarracao): Promise<Narracao> {
        try {
            const prompt = this.criarPrompt(contexto)
            const resposta = (await gemini.enviarPrompt(prompt)) as GeminiResponse

            if (resposta.error) {
                throw new Error(resposta.error)
            }

            return JSON.parse(resposta.text) as Narracao
        } catch (erro) {
            console.error('Erro ao gerar narrativa:', erro)
            throw erro
        }
    }
}

