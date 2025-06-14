/**
 * Agente Criador - Responsável por gerar elementos do jogo e narrativas
 */

import { gemini } from '../../../infra/ia'
import { GeminiResponse } from '../../../infra/ia/gemini/tipos'
import { ContextoCriacao, Criacao } from '../tipos'
import { DIRETRIZES_CRIACAO, TIPOS_ELEMENTOS, REGRAS_CRIACAO } from '../regras'

export class Criador {
    private criarPrompt(contexto: ContextoCriacao): string {
        return `
Você é o Criador do jogo, responsável por gerar elementos e narrativas imersivas.

OBJETIVO:
- Criar elementos do jogo que sejam coerentes e interconectados
- Desenvolver narrativas envolventes e significativas
- Manter o balanceamento entre desafios e recompensas

DIRETRIZES DE CRIAÇÃO:
${DIRETRIZES_CRIACAO.map((d) => `- ${d.titulo}: ${d.descricao}`).join('\n')}

TIPOS DE ELEMENTOS:
${Object.entries(TIPOS_ELEMENTOS)
    .map(
        ([tipo, info]) => `
${tipo.toUpperCase()}:
- Atributos Base: ${info.atributosBase.join(', ')}
- Relacionamentos: ${info.relacionamentos.join(', ')}`
    )
    .join('\n')}

REGRAS DE CRIAÇÃO:
- Narrativa:
  * Introdução: ${REGRAS_CRIACAO.narrativa.introducao}
  * Desenvolvimento: ${REGRAS_CRIACAO.narrativa.desenvolvimento}
  * Conclusão: ${REGRAS_CRIACAO.narrativa.conclusao}
- Elementos:
  * Quantidade: ${REGRAS_CRIACAO.elementos.quantidade.min} a ${REGRAS_CRIACAO.elementos.quantidade.max}
  * Profundidade: Mínimo de ${REGRAS_CRIACAO.elementos.profundidade.minAtributos} atributos e ${REGRAS_CRIACAO.elementos.profundidade.minRelacionamentos} relacionamentos
- Conexões:
  * Mínimo de ${REGRAS_CRIACAO.conexoes.minPorElemento} e máximo de ${REGRAS_CRIACAO.conexoes.maxPorElemento} por elemento

CONTEXTO ATUAL:
${JSON.stringify(contexto, null, 2)}

Responda apenas com um objeto JSON contendo:
{
    "elementos": [
        {
            "id": "string",
            "nome": "string",
            "descricao": "string",
            "tipo": "personagem|local|item|inimigo|evento",
            "atributos": {},
            "relacionamentos": {}
        }
    ],
    "narrativa": {
        "introducao": "string",
        "desenvolvimento": "string",
        "conclusao": "string"
    },
    "conexoes": {
        "entreElementos": {},
        "comNarrativa": {}
    }
}`
    }

    async criar(contexto: ContextoCriacao): Promise<Criacao> {
        try {
            const prompt = this.criarPrompt(contexto)
            const resposta = (await gemini.enviarPrompt(prompt)) as GeminiResponse

            if (resposta.error) {
                throw new Error(resposta.error)
            }

            return JSON.parse(resposta.text) as Criacao
        } catch (erro) {
            console.error('Erro ao criar elementos:', erro)
            throw erro
        }
    }
}
