// src/api/gameRoutes.ts

import { Router, Request, Response } from "express"
import { startGame, performGameAction } from "../game/ponte"
import { FichaPersonagem, LogProgresso, GameState } from "../types/game"
import { saveGameToDrive, loadGameFromDrive } from "../services/driveService"
import { authenticateUser } from "./authRoutes" // Importe o middleware de autenticação

const router = Router()

// Endpoint para iniciar um novo jogo ou carregar um salvo
// Esta rota é protegida e espera que o usuário esteja autenticado
router.post(
	"/start_game",
	authenticateUser,
	async (req: Request, res: Response) => {
		try {
			// userId agora é obtido do objeto 'user' anexado pelo middleware authenticateUser
			const userId = (req as any).user.email
			let gameData: (GameState & { message?: string }) | null = null

			if (userId) {
				const userTokens = (req as any).user.tokens
				gameData = await loadGameFromDrive(userId, userTokens)
			}

			if (gameData) {
				return res.json({
					...gameData,
					message:
						gameData.message ||
						"Jogo carregado com sucesso do Google Drive.",
				})
			} else {
				const initialGameState = await startGame()
				return res.json({
					...initialGameState,
					message:
						"Nenhum jogo salvo encontrado no Google Drive. Iniciando um novo jogo.",
				})
			}
		} catch (error: any) {
			console.error("Erro ao iniciar/carregar jogo:", error)
			res.status(500).json({
				error:
					error.message || "Erro interno ao iniciar/carregar jogo.",
			})
		}
	}
)

// Endpoint para processar uma ação do jogador
// Esta rota é protegida e espera que o usuário esteja autenticado
router.post(
	"/perform_action",
	authenticateUser,
	async (req: Request, res: Response) => {
		const { acao_jogador, ficha_personagem_atual, log_progresso_atual } =
			req.body

		if (!acao_jogador || !ficha_personagem_atual || !log_progresso_atual) {
			return res
				.status(400)
				.json({ error: "Dados incompletos para a ação do jogador." })
		}

		try {
			const userId = (req as any).user.email // Obtém o userId do middleware de autenticação
			const result = await performGameAction(
				acao_jogador,
				ficha_personagem_atual,
				log_progresso_atual
			)

			// Salvar o jogo no Drive automaticamente após cada turno
			// Se o middleware authenticateUser passou, userId e userTokens estarão disponíveis
			if (userId && (req as any).user.tokens) {
				const userTokens = (req as any).user.tokens
				await saveGameToDrive(
					userId,
					{
						ficha_personagem: result.ficha_personagem,
						log_progresso: result.log_progresso,
					},
					userTokens
				)
				console.log(`Progresso salvo automaticamente para ${userId}.`)
			}

			res.json(result)
		} catch (error: any) {
			console.error("Erro ao processar ação:", error)
			res.status(500).json({
				error: error.message || "Erro interno ao processar ação.",
			})
		}
	}
)

export default router
