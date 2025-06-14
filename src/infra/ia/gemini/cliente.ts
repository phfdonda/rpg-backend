import { GoogleGenAI } from '@google/genai'
import { GEMINI_API_KEY } from '../../../config/env'

// Inicializa o cliente da API Gemini
console.log('Inicializando cliente Gemini...')
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY })
console.log('Cliente Gemini inicializado com sucesso')

export const gemini = {
    async enviarPrompt(prompt: string, modelo: string = 'gemini-2.0-flash') {
        try {
            const response = await ai.models.generateContent({
                model: modelo,
                contents: prompt,
            })
            return response.text || ''
        } catch (error) {
            console.error('Erro ao enviar prompt para o Gemini:', error)
            throw error
        }
    },
}
