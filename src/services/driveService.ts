// src/services/driveService.ts

import { google, Auth } from "googleapis"
import {
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GOOGLE_REDIRECT_URI,
} from "../config/env"
import { FichaPersonagem, LogProgresso } from "../types/game"

// As credenciais OAuth 2.0 são para a autenticação inicial.
// No servidor, você usará essas credenciais para obter um token de acesso
// e um token de atualização (refresh token) para o usuário autenticado.
// O refresh token é usado para obter novos access tokens quando o antigo expirar.
// Para este exemplo, usaremos um client para o fluxo de autorização.
const oauth2Client = new google.auth.OAuth2(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GOOGLE_REDIRECT_URI
)

// Escopos necessários para o Google Drive
const GOOGLE_SCOPES = [
	"https://www.googleapis.com/auth/userinfo.email", // Para identificar o usuário
	"https://www.googleapis.com/auth/drive.appdata", // Para salvar/carregar dados de aplicativo
]

// --- Funções de Autenticação OAuth (Esqueleto) ---

export function getGoogleAuthUrl(): string {
	// Gera a URL de autorização para o frontend.
	// Em uma aplicação real, você pode passar um 'state' para proteção CSRF.
	const authUrl = oauth2Client.generateAuthUrl({
		access_type: "offline", // Necessário para obter um refresh_token
		scope: GOOGLE_SCOPES,
		include_granted_scopes: true,
	})
	return authUrl
}

export async function getGoogleTokens(code: string): Promise<Auth.Credentials> {
	// Troca o código de autorização por tokens de acesso/refresh.
	const { tokens } = await oauth2Client.getToken(code)
	oauth2Client.setCredentials(tokens) // Define as credenciais no cliente
	return tokens
}

// --- Funções para interagir com o Google Drive ---

// Em uma aplicação real, você buscaria as credenciais do usuário em um banco de dados
// com base no user_id, e usaria o refresh_token para garantir que o access_token
// esteja sempre válido antes de fazer a chamada à API do Drive.
// Para esta demo, vamos assumir que `userTokens` é um objeto Auth.Credentials válido
// obtido e atualizado previamente.

async function getDriveService(userTokens: Auth.Credentials) {
	oauth2Client.setCredentials(userTokens)
	// Garante que o access_token está válido, usando o refresh_token se necessário
	await oauth2Client.refreshAccessToken()

	return google.drive({ version: "v3", auth: oauth2Client })
}

export async function saveGameToDrive(
	userId: string,
	gameData: {
		ficha_personagem: FichaPersonagem
		log_progresso: LogProgresso
	},
	userTokens: Auth.Credentials
): Promise<string> {
	const drive = await getDriveService(userTokens)
	const fileName = "rpg_game_data.json"

	try {
		// Verifica se o arquivo já existe na appDataFolder
		const res = await drive.files.list({
			spaces: "appDataFolder",
			q: `name='${fileName}'`,
			fields: "files(id)",
		})
		const files = res.data.files

		if (files && files.length > 0) {
			// Arquivo existe, atualiza
			const fileId = files[0].id!
			await drive.files.update({
				fileId: fileId,
				media: {
					mimeType: "application/json",
					body: JSON.stringify(gameData),
				},
			})
			return `Jogo salvo com sucesso (atualizado) no Google Drive para ${userId}.`
		} else {
			// Arquivo não existe, cria
			const fileMetadata = {
				name: fileName,
				parents: ["appDataFolder"],
				mimeType: "application/json",
			}
			await drive.files.create({
				requestBody: fileMetadata,
				media: {
					mimeType: "application/json",
					body: JSON.stringify(gameData),
				},
			})
			return `Jogo salvo com sucesso (novo) no Google Drive para ${userId}.`
		}
	} catch (error: any) {
		console.error(`Erro ao salvar no Drive para ${userId}:`, error.message)
		throw new Error(`Erro ao salvar jogo no Google Drive: ${error.message}`)
	}
}

export async function loadGameFromDrive(
	userId: string,
	userTokens: Auth.Credentials
): Promise<{
	ficha_personagem: FichaPersonagem
	log_progresso: LogProgresso
} | null> {
	const drive = await getDriveService(userTokens)
	const fileName = "rpg_game_data.json"

	try {
		const res = await drive.files.list({
			spaces: "appDataFolder",
			q: `name='${fileName}'`,
			fields: "files(id)",
		})
		const files = res.data.files

		if (!files || files.length === 0) {
			return null // Nenhum arquivo de save encontrado
		}

		const fileId = files[0].id!
		const response = await drive.files.get(
			{
				fileId: fileId,
				alt: "media",
			},
			{ responseType: "stream" }
		)

		return new Promise((resolve, reject) => {
			let data = ""
			response.data.on("data", (chunk: Buffer) => {
				data += chunk.toString()
			})
			response.data.on("end", () => {
				resolve(JSON.parse(data))
			})
			response.data.on("error", (err: Error) => {
				reject(err)
			})
		})
	} catch (error: any) {
		// Se for um erro 404 (arquivo não encontrado), retorna null
		if (error.code === 404) {
			return null
		}
		console.error(
			`Erro ao carregar do Drive para ${userId}:`,
			error.message
		)
		throw new Error(
			`Erro ao carregar jogo do Google Drive: ${error.message}`
		)
	}
}
