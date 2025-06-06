import dotenv from "dotenv"

dotenv.config()

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ""
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ""
export const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || ""

if (!GEMINI_API_KEY) {
	console.warn("GEMINI_API_KEY não definida. As chamadas ao Gemini falharão.")
}
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
	console.warn(
		"Credenciais do Google OAuth incompletas. O login com Google Drive pode falhar."
	)
}
