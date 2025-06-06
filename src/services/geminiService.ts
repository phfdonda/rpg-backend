import { GoogleGenerativeAI, Content } from '@google/generative-ai'
import { GEMINI_API_KEY } from '../config/env'

// Inicializa o cliente da API Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

// Define uma única instância do modelo Gemini
export const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash-latest',
})

interface SaveLoadRequest {
  isLoad: boolean
  data?: any
}

export async function handleSaveLoad(request: SaveLoadRequest): Promise<any> {
  const systemInstruction = request.isLoad
    ? 'Você é um assistente que carrega dados salvos. Retorne apenas os dados carregados em formato JSON.'
    : "Você é um assistente que salva dados. Confirme o salvamento retornando um objeto com status: 'success' e message: 'Dados salvos com sucesso'."

  const userPrompt = request.isLoad
    ? 'Carregue os dados salvos.'
    : `Salve os seguintes dados: ${JSON.stringify(request.data)}`

  try {
    const history: Content[] = [
      { role: 'user', parts: [{ text: systemInstruction }] },
      {
        role: 'model',
        parts: [{ text: 'OK. Compreendi as instruções.' }],
      },
    ]

    const chat = geminiModel.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
        responseMimeType: 'application/json',
      },
    })

    const result = await chat.sendMessage(userPrompt)
    const response = await result.response
    return JSON.parse(response.text())
  } catch (e: any) {
    console.error(`Erro ao ${request.isLoad ? 'carregar' : 'salvar'} dados: ${e.message || e}`)
    return {
      error: `Erro inesperado ao ${request.isLoad ? 'carregar' : 'salvar'} dados: ${e.message || e}`,
    }
  }
}

export async function callGemini(
  systemInstruction: string,
  userPrompt: string,
  maxTokens: number = 1000,
  temperature: number = 0.7
): Promise<string> {
  try {
    const history: Content[] = [
      { role: 'user', parts: [{ text: systemInstruction }] },
      {
        role: 'model',
        parts: [
          {
            text: 'OK. Compreendi as instruções e estou pronto para processar sua solicitação.',
          },
        ],
      },
    ]

    const chat = geminiModel.startChat({
      history,
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature: temperature,
        responseMimeType: 'application/json',
      },
    })

    const result = await chat.sendMessage(userPrompt)
    const response = await result.response
    return response.text()
  } catch (e: any) {
    console.error(`Erro ao chamar o Gemini: ${e.message || e}`)
    return JSON.stringify({
      error: `Erro inesperado na chamada Gemini: ${e.message || e}`,
    })
  }
}
