import { GoogleGenAI } from '@google/genai'
import { GEMINI_API_KEY } from '@config/env'
import { GeminiResponse } from './tipos'

// Inicializa o cliente da API Gemini
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY })

export const gemini = {
    async enviarPrompt(
        prompt: string,
        modelo: string = 'gemini-2.0-flash'
    ): Promise<GeminiResponse> {
        try {
            console.log('1. Gemini: Iniciando envio do prompt')
            console.log('2. Gemini: Modelo:', modelo)
            console.log('3. Gemini: Prompt:', prompt)

            const response = await ai.models.generateContent({
                model: modelo,
                contents: prompt,
            })

            console.log('4. Gemini: Resposta recebida:', response)

            if (!response.text) {
                console.log('5a. Gemini: Resposta vazia')
                return {
                    text: '',
                    error: 'Resposta vazia do Gemini',
                }
            }

            console.log('5b. Gemini: Resposta processada com sucesso')
            return {
                text: response.text,
            }
        } catch (error) {
            console.error('6. Gemini: Erro:', error)
            const errorMessage =
                error instanceof Error ? error.message : 'Erro desconhecido ao enviar prompt'

            // Verifica se é um erro de API key
            if (
                errorMessage.includes('API key expired') ||
                errorMessage.includes('API_KEY_INVALID')
            ) {
                console.log('7a. Gemini: Erro de API key')
                return {
                    text: '',
                    error: 'Chave de API do Gemini inválida ou expirada. Por favor, atualize a chave no arquivo .env',
                }
            }

            console.log('7b. Gemini: Erro genérico')
            return {
                text: '',
                error: errorMessage,
            }
        }
    },
}

