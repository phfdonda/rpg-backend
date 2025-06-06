import {
	GoogleGenerativeAI,
	GenerativeModel,
	Content,
} from "@google/generative-ai"
import { GEMINI_API_KEY } from "../config/env"

// Inicializa o cliente da API Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

// Define instâncias de modelos específicos para cada papel
export const MODEL_INTERPRETE = genAI.getGenerativeModel({
	model: "gemini-1.5-flash-latest",
})
export const MODEL_ARQUIVISTA = genAI.getGenerativeModel({
	model: "gemini-1.5-flash-latest",
})
export const MODEL_NARRADOR = genAI.getGenerativeModel({
	model: "gemini-1.5-flash-latest",
})

export async function callLLMApi(
	systemInstruction: string,
	userPrompt: string,
	modelInstance: GenerativeModel,
	maxTokens: number = 1000,
	temperature: number = 0.7
): Promise<string> {
	try {
		const history: Content[] = [
			{ role: "user", parts: [{ text: systemInstruction }] },
			{
				role: "model",
				parts: [
					{
						text: "OK. Compreendi as instruções e estou pronto para processar as ações do jogador.",
					},
				],
			},
		]

		const chat = modelInstance.startChat({
			history,
			generationConfig: {
				// <-- generationConfig deve ser passado aqui
				maxOutputTokens: maxTokens,
				temperature: temperature,
				responseMimeType: "application/json", // Isso garante JSON para o Intérprete/Arquivista
			},
		})

		const result = await chat.sendMessage(userPrompt)

		const response = await result.response
		return response.text()
	} catch (e: any) {
		console.error(`Ocorreu um erro ao chamar o LLM: ${e.message || e}`)
		return JSON.stringify({
			error: `Erro inesperado na chamada LLM: ${e.message || e}`,
		})
	}
}
