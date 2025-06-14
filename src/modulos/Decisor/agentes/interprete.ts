import { gemini } from '@infra/ia/gemini/cliente'
import { Logger } from '@utils/logger'

export enum TipoMensagem {
    INTERPRETACAO = 'INTERPRETACAO',
    COMUNICACAO = 'COMUNICACAO',
    INCOMPREENSIVEL = 'INCOMPREENSIVEL',
}

export interface Interpretacao {
    tipo: TipoMensagem
    descricao: string
}

export class Interprete {
    private readonly promptInterprete = `
Você é um **especialista em inteligência artificial** treinado para analisar e classificar mensagens de jogadores de RPG. Seu objetivo principal é identificar a **intenção por trás de cada mensagem**, categorizando-a de forma precisa.

---

### **Instruções de Classificação:**

Classifique a mensagem do jogador em **uma das seguintes três categorias**, baseando-se no conteúdo e contexto aparente:

1.  **INTERPRETACAO:** O jogador está atuando como seu personagem. Isso inclui descrições de **ações, falas, pensamentos, emoções ou qualquer manifestação direta do personagem** dentro da narrativa do jogo.
    * *Exemplo de mensagem:* "Eu mordo a orelha do orc."
    * *Exemplo de saída:* \`{"tipo": "INTERPRETACAO", "descricao": "O jogador está descrevendo a ação de seu personagem, em que ele tenta morder a orelha do orc."}\`

2.  **COMUNICACAO:** O jogador está se dirigindo diretamente ao narrador (mestre) ou a outros jogadores, **fora do papel de seu personagem**. Isso engloba perguntas sobre regras, pedidos de esclarecimento, comentários meta-jogo, sugestões ou qualquer interação que não seja uma ação do personagem.
    * *Exemplo de mensagem:* "Mestre, posso usar minha habilidade de persuasão aqui?"
    * *Exemplo de saída:* \`{"tipo": "COMUNICACAO", "descricao": "O jogador está fazendo uma pergunta ao narrador sobre uma regra ou habilidade."}\`

3.  **INCOMPREENSIVEL:** A mensagem não possui clareza suficiente para ser categorizada em "Interpretação" ou "Comunicação". Ela pode estar incompleta, mal formulada, ambígua ou conter erros que impedem a compreensão imediata da intenção do jogador.
    * *Exemplo de mensagem:* "Orcs, então... ahn, o que faço?"
    * *Exemplo de saída:* \`{"tipo": "INCOMPREENSIVEL", "descricao": "A mensagem está incompleta e não permite inferir a intenção do jogador."}\`

---

### **Formato de Resposta Exigido:**

Sua resposta **DEVE ser um objeto JSON**. Inclua as chaves \`"tipo"\` (com o nome da categoria em maiúsculas) e \`"descricao"\` (com uma breve explicação da classificação e do porquê).

---

**Mensagem do jogador:**
`

    private limparRespostaMarkdown(texto: string): string {
        // Remove a formatação markdown de código
        return texto.replace(/```json\n?|\n?```/g, '').trim()
    }

    async interpretar(mensagem: string): Promise<Interpretacao> {
        try {
            Logger.agent(`1. Iniciando interpretação da mensagem: ${mensagem}`)

            const prompt = this.promptInterprete + mensagem
            Logger.agent(`2. Prompt completo: ${prompt}`)

            const resposta = await gemini.enviarPrompt(prompt)
            Logger.agent(`3. Resposta do Gemini: ${JSON.stringify(resposta)}`)

            if (resposta.error) {
                Logger.error(`4a. Erro ao interpretar mensagem: ${resposta.error}`)
                return {
                    tipo: TipoMensagem.INCOMPREENSIVEL,
                    descricao: 'Erro ao processar a mensagem. Por favor, tente novamente.',
                }
            }

            try {
                const textoLimpo = this.limparRespostaMarkdown(resposta.text)
                Logger.agent(`4b. Texto limpo: ${textoLimpo}`)

                const resultado = JSON.parse(textoLimpo) as Interpretacao
                Logger.agent(`4c. Resultado parseado: ${JSON.stringify(resultado)}`)

                // Validação do tipo
                if (!Object.values(TipoMensagem).includes(resultado.tipo)) {
                    throw new Error('Tipo de mensagem inválido')
                }

                return resultado
            } catch (parseError) {
                Logger.error(`4d. Erro ao processar resposta: ${parseError}`)
                return {
                    tipo: TipoMensagem.INCOMPREENSIVEL,
                    descricao: 'Erro ao processar a resposta. Por favor, tente novamente.',
                }
            }
        } catch (error) {
            Logger.error(`5. Erro ao interpretar mensagem: ${error}`)
            return {
                tipo: TipoMensagem.INCOMPREENSIVEL,
                descricao: 'Erro ao processar a mensagem. Por favor, tente novamente.',
            }
        }
    }
}

