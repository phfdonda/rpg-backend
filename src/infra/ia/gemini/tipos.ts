export interface GeminiResponse {
    text: string
    error?: string
}

export interface GeminiConfig {
    model: string
    temperature?: number
    maxOutputTokens?: number
    topP?: number
    topK?: number
}
