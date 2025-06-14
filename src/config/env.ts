import dotenv from 'dotenv'

dotenv.config()

// Configuração do Gemini
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''

// Configuração do Google Drive
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ''
export const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || ''
export const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || ''

if (!GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY não definida. As chamadas ao Gemini falharão.')
}
