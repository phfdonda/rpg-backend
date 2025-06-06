// src/api/authRoutes.ts

import { Router, Request, Response, NextFunction } from "express"
import { OAuth2Client } from "google-auth-library"
import {
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GOOGLE_REDIRECT_URI,
} from "../config/env"

// Importe e configure a sessão se ainda não o fez, para armazenar tokens
// import session from 'express-session';
// app.use(session({
//   secret: 'SEGREDO_SUPER_SECRETO', // Use uma string forte e do env
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: process.env.NODE_ENV === 'production' } // secure: true em produção para HTTPS
// }));

const router = Router()

// Configuração do cliente OAuth2
const oauth2Client = new OAuth2Client(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GOOGLE_REDIRECT_URI
)

// Middleware para autenticar o usuário via Google Access Token
// Esta função é uma middleware padrão do Express
export const authenticateUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const authHeader = req.headers.authorization
	if (!authHeader) {
		return res.status(401).json({ error: "Authorization header required." })
	}

	const token = authHeader.split(" ")[1] // Espera "Bearer SEU_ACCESS_TOKEN"

	if (!token) {
		return res
			.status(401)
			.json({ error: "Token de autenticação não fornecido." })
	}

	try {
		// Verifica o token de ID
		const ticket = await oauth2Client.verifyIdToken({
			idToken: token,
			audience: GOOGLE_CLIENT_ID, // Opcional, mas recomendado para segurança
		})
		const payload = ticket.getPayload() // Obtém o payload do token
		if (!payload) {
			return res.status(401).json({ error: "Payload do token inválido." })
		}

		// Anexa as informações do usuário ao objeto de requisição para uso posterior
		// Se você estiver usando express-session, pode armazenar os tokens aqui também
		;(req as any).user = {
			email: payload.email,
			name: payload.name,
			// Assumindo que os tokens de acesso e refresh foram armazenados na sessão
			// após o login/callback, você pode acessá-los aqui se necessário.
			// Ex: tokens: (req as any).session?.tokens
		}
		next() // Passa o controle para o próximo middleware ou rota
	} catch (error: any) {
		console.error("Erro de autenticação:", error)
		if (error.message.includes("Token used too late")) {
			return res.status(401).json({
				error: "Token expirado ou inválido. Por favor, faça login novamente.",
			})
		}
		return res.status(401).json({
			error:
				"Falha na autenticação: " +
				(error.message || "Token inválido."),
		})
	}
}

// Rota de login para iniciar o fluxo OAuth
router.get("/login", (req: Request, res: Response) => {
	const authorizeUrl = oauth2Client.generateAuthUrl({
		access_type: "offline", // Para obter um refresh token
		scope: [
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
			"https://www.googleapis.com/auth/drive.appdata",
		],
		prompt: "consent", // Para garantir que o usuário dê consentimento novamente e possibilite o refresh token
	})
	res.redirect(authorizeUrl)
})

// Rota de callback após o Google redirecionar
router.get("/callback", async (req: Request, res: Response) => {
	const code = req.query.code as string
	if (!code) {
		return res
			.status(400)
			.json({ error: "Código de autorização não fornecido." })
	}

	try {
		const { tokens } = await oauth2Client.getToken(code)
		oauth2Client.setCredentials(tokens)

		// Armazene os tokens na sessão do usuário ou em algum lugar seguro
		// (req as any).session.tokens = tokens;

		// Redirecione para o seu frontend ou retorne os tokens/informações de sucesso
		// Você pode redirecionar para uma URL de sucesso no frontend com os tokens ou um status
		res.redirect(
			`http://localhost:4321/auth-success?access_token=${tokens.access_token}&id_token=${tokens.id_token}`
		)
	} catch (error: any) {
		console.error("Erro ao trocar código por tokens:", error)
		res.status(500).json({
			error:
				"Falha ao autenticar com o Google: " +
				(error.message || "Erro desconhecido."),
		})
	}
})

// Exemplo de rota protegida para testar o middleware authenticateUser
router.get(
	"/profile",
	authenticateUser,
	async (req: Request, res: Response) => {
		// Se chegamos aqui, o usuário está autenticado e suas infos estão em req.user
		res.json({
			message: "Dados do perfil do usuário",
			user: (req as any).user,
		})
	}
)

export default router
