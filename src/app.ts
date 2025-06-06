// src/app.ts

import express from "express"
import cors from "cors"
import path from "path"
import { google } from "googleapis"
import { GoogleGenerativeAI } from "@google/generative-ai"
import {
	GEMINI_API_KEY,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GOOGLE_REDIRECT_URI,
} from "@config/env" // Garante que as vars são carregadas
import authRoutes from "./api/authRoutes"
import gameRoutes from "./api/gameRoutes"

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json()) // Para parsear o corpo das requisições como JSON
app.use(express.static(path.join(__dirname, "../public")))

// Initialize Google OAuth2 client
const oauth2Client = new google.auth.OAuth2(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GOOGLE_REDIRECT_URI
)

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

// Rotas da API
app.use("/auth", authRoutes) // Rotas de autenticação
app.use("/api", gameRoutes) // Rotas do jogo

// Routes
app.get("/auth/google", (req, res) => {
	const authUrl = oauth2Client.generateAuthUrl({
		access_type: "offline",
		scope: ["https://www.googleapis.com/auth/drive.file"],
	})
	res.json({ url: authUrl })
})

app.post("/auth/google/callback", async (req, res) => {
	const { code } = req.body
	try {
		const { tokens } = await oauth2Client.getToken(code)
		oauth2Client.setCredentials(tokens)
		res.json({ success: true, tokens })
	} catch (error) {
		res.status(500).json({ error: "Failed to authenticate with Google" })
	}
})

app.post("/generate-story", async (req, res) => {
	const { prompt, context } = req.body
	try {
		const model = genAI.getGenerativeModel({ model: "gemini-pro" })
		const result = await model.generateContent(prompt)
		const response = await result.response
		const story = response.text()
		res.json({ story })
	} catch (error) {
		res.status(500).json({ error: "Failed to generate story" })
	}
})

app.post("/save-to-drive", async (req, res) => {
	const { content, title } = req.body
	const access_token = req.headers.access_token as string

	if (!access_token) {
		return res.status(401).json({ error: "No access token provided" })
	}

	try {
		oauth2Client.setCredentials({ access_token })
		const drive = google.drive({ version: "v3", auth: oauth2Client })

		const fileMetadata = {
			name: title,
			mimeType: "text/plain",
		}

		const media = {
			mimeType: "text/plain",
			body: content,
		}

		const file = await drive.files.create({
			requestBody: fileMetadata,
			media: media,
			fields: "id",
		})

		res.json({ success: true, fileId: file.data.id })
	} catch (error) {
		res.status(500).json({ error: "Failed to save to Google Drive" })
	}
})

// Rota de teste
app.get("/", (req, res) => {
	res.send("Servidor RPG LLM em TypeScript está rodando!")
})

// Inicializa o servidor
app.listen(PORT, () => {
	console.log(`Servidor rodando em http://localhost:${PORT}`)
	if (!GEMINI_API_KEY) {
		console.warn("AVISO: GEMINI_API_KEY não está configurada!")
	}
	if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
		console.warn(
			"AVISO: Credenciais GOOGLE_CLIENT_ID/SECRET não estão configuradas para OAuth!"
		)
	}
})
