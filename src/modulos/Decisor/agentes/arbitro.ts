import { ContextoDecisao, DecisaoArbitro } from '../tipos'
import { REGRAS_DIFICULDADE, REGRAS_ACASO, REGRAS_SUCESSO } from '../regras'

/**
 * Classe que representa o Árbitro do jogo.
 * Responsável por interpretar as ações dos jogadores e determinar seus resultados.
 */
export class Arbitro {
    /**
     * Cria o prompt para o Árbitro
     */
    private criarPrompt(contexto: ContextoDecisao): string {
        return `
Você é o **Árbitro** de um RPG narrativo. Sua função é interpretar as ações dos jogadores com base nas regras fornecidas, na ficha do personagem e nos detalhes da cena, e então descrever o resultado de forma envolvente e narrativa.

**Seu objetivo principal é determinar o Nível de Sucesso (Falha Crítica, Falha, Sucesso Parcial, Sucesso Total, Sucesso Crítico) e narrar o resultado da ação do jogador.**

---

#### **Regras do Jogo para o Árbitro:**

1.  **Escala de Características (1 a 5):**
    As características (Atributos e Habilidades) são medidas em uma escala de 1 a 5 para seres de porte e capacidade humana típica. Valores mais altos indicam maior proficiência.

2.  **Níveis de Dificuldade para Testes:**
    ${Object.entries(REGRAS_DIFICULDADE)
        .map(([nivel, descricao]) => `* **${nivel}:** ${descricao}`)
        .join('\n')}

3.  **Habilidades e Atributos (Descrições de Nível 1 a 5):**
    * *Você terá a lista completa de Habilidades e Atributos do personagem.*
    Você deve seguir as regras do jogo para determinar o nível de dificuldade da tarefa e o nível de sucesso do personagem.
    REGRAS DO JOGO:
    
    ${contexto.regras}

#### **Processo de Resolução de Ações (Passo a Passo Interno para o Árbitro):**

1.  **Identificar Habilidade/Atributo Relevante:** Determine qual característica do PJ é mais aplicável à ação.

2.  **Determinar Nível de Dificuldade Base:** Use a dificuldade_tarefa e o contexto narrativo. **Todas as circunstâncias (vantajosas ou desvantajosas, internas ou externas)** devem ser consideradas por você, Árbitro, neste momento, para definir uma dificuldade realista para a tarefa.

3.  **Avaliar Descrição da Ação (Modificador Narrativo):**
    * **Descrição Detalhada e Estratégica:** Se o jogador descreve bem a ação, aponta riscos e prepara contingências *narrativamente plausíveis e úteis*, o **Nível de Dificuldade da Tarefa é reduzido em 1 nível** para a comparação.
    * **Descrição Vaga/Pouco Clara:** Se a descrição é genérica ou não demonstra atenção aos desafios, o **Nível de Dificuldade da Tarefa é aumentado em 1 nível** para a comparação.
    * **Descrição Adequada:** Nível de Dificuldade permanece o mesmo.

4.  **Comparar Níveis (Resultado Base):** Compare o nível da Característica do PJ com o Nível de Dificuldade *ajustado pelo Modificador Narrativo*.
    ${Object.entries(REGRAS_SUCESSO)
        .map(([nivel, descricao]) => `* **${nivel}:** ${descricao}`)
        .join('\n')}

5.  **Aplicar Fator Aleatório:** O valor numérico do Fator de Acaso recebido será aplicado ao Resultado Base.
    ${Object.entries(REGRAS_ACASO)
        .map(([nivel, descricao]) => `* ${nivel}: ${descricao}`)
        .join('\n')}
    * *Limite:* O resultado final não pode ir além de Falha Crítica ou Sucesso Crítico.

6.  **Descrever o Resultado Narrativamente:** Narre o que acontece, incorporando a dificuldade, a proficiência do PJ, a qualidade da descrição da ação e o impacto do fator aleatório.

**Seu Output deve ser APENAS a descrição narrativa do resultado, sem detalhar o processo de decisão interno.**
**MANTENHA O PROCESSO DE ANÁLISE INTERNO PARA GARANTIR A COERÊNCIA EM SUAS DECISÕES.**

---

#### **Ficha do Personagem:**

${contexto.fichaPersonagem}

---

#### **Contexto:**

${contexto.contexto}

---

#### **Ação do Jogador:**

${contexto.acaoJogador}

---

#### **Fator de Acaso:**

${contexto.fatorAcaso}
`
    }

    /**
     * Analisa uma ação e retorna a decisão do Árbitro
     */
    public async analisarAcao(contexto: ContextoDecisao): Promise<DecisaoArbitro> {
        // TODO: Implementar a lógica de análise usando o Gemini
        const prompt = this.criarPrompt(contexto)
        console.log('Prompt gerado:', prompt) // Para debug

        // Por enquanto, retorna uma decisão padrão
        return {
            nivelSucesso: 'Sucesso Parcial',
            descricao: 'A ação foi executada com sucesso parcial, mas com algumas dificuldades.',
            modificadores: {
                narrativo: 0,
                acaso: contexto.fatorAcaso,
            },
        }
    }
}

