import { Acao, FichaPersonagem, RespostaArquivista } from '../tipos'
import { TIPOS_DE_ESTADO, PROGRESSAO_ESTADOS_MAP, REGRAS_ACOES, REGRAS_ESPECIAIS } from '../regras'

/**
 * Classe que representa o Arquivista do jogo.
 * Responsável por processar as ações e atualizar o estado do jogo.
 */
export class Arquivista {
    /**
     * Cria o prompt para o Arquivista
     */
    private criarPrompt(acoes: Acao[], fichaAtual: FichaPersonagem, logAnterior: string[]): string {
        return `
Você é o Arquivista do jogo. Sua função é processar as solicitações do Orquestrador e aplicar as mudanças na ficha do personagem e no log de progresso.
Você deve simular as mudanças e retornar o estado ATUALIZADO da ficha e do log, além de um relatório detalhado.

Você deve responder APENAS com um JSON. Não adicione nenhum texto adicional fora do JSON.

O JSON DEVE ter o seguinte formato e campos (todos obrigatórios):
{
  "ficha_do_personagem_atualizada": {}, // Objeto JSON completo da ficha atualizada
  "log_de_progresso_completo": [],      // Lista de strings do log de progresso atualizado
  "relatorio_de_resultados": [],       // Lista de strings com um breve relatório sobre cada solicitação processada
  "error"?: "string" // Opcional: Se houver um erro grave de processamento
}

Você tem acesso aos seguintes mapeamentos para estados (não para modificar, apenas para referência sobre a progressão):
TIPOS_DE_ESTADO: ${JSON.stringify(TIPOS_DE_ESTADO, null, 2)}
PROGRESSAO_ESTADOS_MAP: ${JSON.stringify(PROGRESSAO_ESTADOS_MAP, null, 2)}

Detalhes de Processamento de Solicitações (Sempre crie NOVOS OBJETOS/ARRAYS para imutabilidade):

${Object.entries(REGRAS_ACOES)
    .map(([tipo, regras]) => `- **${tipo}**: ${regras}`)
    .join('\n\n')}

**Regras Especiais:**
${Object.entries(REGRAS_ESPECIAIS)
    .map(([tipo, regras]) => `- **${tipo}**: ${regras}`)
    .join('\n')}

**Exemplo de Interação:**
Solicitações a processar: ${JSON.stringify(acoes, null, 2)}
Ficha do Personagem Atual: ${JSON.stringify(fichaAtual, null, 2)}
Log de Progresso Anterior: ${JSON.stringify(logAnterior, null, 2)}
`
    }

    /**
     * Processa uma lista de ações e retorna o estado atualizado
     */
    public async processarAcoes(
        acoes: Acao[],
        fichaAtual: FichaPersonagem,
        logAnterior: string[]
    ): Promise<RespostaArquivista> {
        // TODO: Implementar a lógica de processamento usando o Gemini
        throw new Error('Método não implementado')
    }
}

