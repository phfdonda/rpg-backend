// src/services/driveService.ts
/**
 * Serviço responsável por gerenciar o salvamento e carregamento de dados do jogo no Google Drive.
 * Implementa um sistema de backup automático para prevenir perda de dados.
 */

import { google, Auth } from 'googleapis'
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } from '../config/env'
import { FichaPersonagem, LogProgresso } from '../types/game'

/**
 * Configuração do cliente OAuth2 para autenticação com o Google Drive.
 * Este cliente é usado para obter tokens de acesso e refresh tokens.
 */
const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
)

/**
 * Escopos necessários para acessar o Google Drive.
 * - userinfo.email: Para identificar o usuário
 * - drive.appdata: Para salvar/carregar dados na pasta de aplicativo do usuário
 */
const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/drive.appdata',
]

/**
 * Gera a URL de autorização para o frontend iniciar o processo de autenticação.
 * @returns URL de autorização do Google
 */
export function getGoogleAuthUrl(): string {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline', // Necessário para obter refresh_token
    scope: GOOGLE_SCOPES,
    include_granted_scopes: true,
  })
  return authUrl
}

/**
 * Troca o código de autorização por tokens de acesso.
 * @param code Código de autorização recebido do frontend
 * @returns Tokens de acesso e refresh
 */
export async function getGoogleTokens(code: string): Promise<Auth.Credentials> {
  const { tokens } = await oauth2Client.getToken(code)
  oauth2Client.setCredentials(tokens)
  return tokens
}

/**
 * Obtém uma instância do serviço do Google Drive com as credenciais do usuário.
 * @param userTokens Tokens de acesso do usuário
 * @returns Instância do serviço do Google Drive
 */
async function getDriveService(userTokens: Auth.Credentials) {
  oauth2Client.setCredentials(userTokens)
  await oauth2Client.refreshAccessToken()
  return google.drive({ version: 'v3', auth: oauth2Client })
}

/**
 * Sufixo usado para identificar arquivos de backup
 */
const BACKUP_SUFFIX = '_backup.json'

/**
 * Cria ou atualiza um arquivo de backup com os dados atuais do jogo.
 * @param drive Instância do serviço do Google Drive
 * @param userId ID do usuário
 * @param currentData Dados atuais do jogo
 */
async function createBackup(drive: any, userId: string, currentData: any): Promise<void> {
  const backupFileName = `rpg_game_data${BACKUP_SUFFIX}`

  try {
    // Verifica se já existe um backup
    const res = await drive.files.list({
      spaces: 'appDataFolder',
      q: `name='${backupFileName}'`,
      fields: 'files(id)',
    })
    const files = res.data.files

    if (files && files.length > 0) {
      // Atualiza o backup existente
      const fileId = files[0].id!
      await drive.files.update({
        fileId: fileId,
        media: {
          mimeType: 'application/json',
          body: JSON.stringify(currentData),
        },
      })
    } else {
      // Cria novo backup
      const fileMetadata = {
        name: backupFileName,
        parents: ['appDataFolder'],
        mimeType: 'application/json',
      }
      await drive.files.create({
        requestBody: fileMetadata,
        media: {
          mimeType: 'application/json',
          body: JSON.stringify(currentData),
        },
      })
    }
  } catch (error: any) {
    console.error(`Erro ao criar backup para ${userId}:`, error.message)
    throw new Error(`Erro ao criar backup: ${error.message}`)
  }
}

/**
 * Tenta restaurar dados do arquivo de backup.
 * @param drive Instância do serviço do Google Drive
 * @param userId ID do usuário
 * @returns Dados do backup ou null se não houver backup
 */
async function restoreFromBackup(drive: any, userId: string): Promise<any> {
  const backupFileName = `rpg_game_data${BACKUP_SUFFIX}`

  try {
    const res = await drive.files.list({
      spaces: 'appDataFolder',
      q: `name='${backupFileName}'`,
      fields: 'files(id)',
    })
    const files = res.data.files

    if (!files || files.length === 0) {
      return null
    }

    const fileId = files[0].id!
    const response = await drive.files.get(
      {
        fileId: fileId,
        alt: 'media',
      },
      { responseType: 'stream' }
    )

    return new Promise((resolve, reject) => {
      let data = ''
      response.data.on('data', (chunk: Buffer) => {
        data += chunk.toString()
      })
      response.data.on('end', () => {
        resolve(JSON.parse(data))
      })
      response.data.on('error', (err: Error) => {
        reject(err)
      })
    })
  } catch (error: any) {
    console.error(`Erro ao restaurar backup para ${userId}:`, error.message)
    return null
  }
}

/**
 * Interface para as requisições de salvamento/carregamento
 */
interface SaveLoadRequest {
  isLoad: boolean
  userId: string
  userTokens: Auth.Credentials
  data?: {
    ficha_personagem: FichaPersonagem
    log_progresso: LogProgresso
  }
}

/**
 * Manipula requisições de salvamento ou carregamento de dados.
 * @param request Requisição contendo informações sobre a operação
 * @returns Dados carregados ou mensagem de sucesso do salvamento
 */
export async function handleSaveLoad(request: SaveLoadRequest): Promise<any> {
  try {
    if (request.isLoad) {
      return await loadGameFromDrive(request.userId, request.userTokens)
    } else {
      if (!request.data) {
        throw new Error('Dados são necessários para salvar')
      }
      return await saveGameToDrive(request.userId, request.data, request.userTokens)
    }
  } catch (error: any) {
    console.error(`Erro ao ${request.isLoad ? 'carregar' : 'salvar'} dados:`, error.message)
    throw new Error(`Erro ao ${request.isLoad ? 'carregar' : 'salvar'} jogo: ${error.message}`)
  }
}

/**
 * Salva os dados do jogo no Google Drive.
 * Fluxo de salvamento:
 * 1. Verifica se existe um arquivo principal
 * 2. Se existir, faz backup dos dados atuais
 * 3. Salva os novos dados no arquivo principal
 *
 * @param userId ID do usuário
 * @param gameData Dados do jogo a serem salvos
 * @param userTokens Tokens de acesso do usuário
 * @returns Mensagem de sucesso
 */
export async function saveGameToDrive(
  userId: string,
  gameData: {
    ficha_personagem: FichaPersonagem
    log_progresso: LogProgresso
  },
  userTokens: Auth.Credentials
): Promise<string> {
  const drive = await getDriveService(userTokens)
  const fileName = 'rpg_game_data.json'

  try {
    // Primeiro, faz backup dos dados atuais se existirem
    const res = await drive.files.list({
      spaces: 'appDataFolder',
      q: `name='${fileName}'`,
      fields: 'files(id)',
    })
    const files = res.data.files

    if (files && files.length > 0) {
      const currentData = await loadGameFromDrive(userId, userTokens)
      if (currentData) {
        await createBackup(drive, userId, currentData)
      }
    }

    // Agora salva os novos dados
    if (files && files.length > 0) {
      const fileId = files[0].id!
      await drive.files.update({
        fileId: fileId,
        media: {
          mimeType: 'application/json',
          body: JSON.stringify(gameData),
        },
      })
      return `Jogo salvo com sucesso (atualizado) no Google Drive para ${userId}.`
    } else {
      const fileMetadata = {
        name: fileName,
        parents: ['appDataFolder'],
        mimeType: 'application/json',
      }
      await drive.files.create({
        requestBody: fileMetadata,
        media: {
          mimeType: 'application/json',
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

/**
 * Carrega os dados do jogo do Google Drive.
 * Fluxo de carregamento:
 * 1. Tenta carregar do arquivo principal
 * 2. Se falhar por qualquer motivo, tenta carregar do backup
 * 3. Se ambos falharem, retorna null
 *
 * @param userId ID do usuário
 * @param userTokens Tokens de acesso do usuário
 * @returns Dados do jogo ou null se não houver dados
 */
export async function loadGameFromDrive(
  userId: string,
  userTokens: Auth.Credentials
): Promise<{
  ficha_personagem: FichaPersonagem
  log_progresso: LogProgresso
} | null> {
  const drive = await getDriveService(userTokens)
  const fileName = 'rpg_game_data.json'

  try {
    const res = await drive.files.list({
      spaces: 'appDataFolder',
      q: `name='${fileName}'`,
      fields: 'files(id)',
    })
    const files = res.data.files

    if (!files || files.length === 0) {
      // Tenta carregar do backup se o arquivo principal não existir
      return await restoreFromBackup(drive, userId)
    }

    const fileId = files[0].id!
    const response = await drive.files.get(
      {
        fileId: fileId,
        alt: 'media',
      },
      { responseType: 'stream' }
    )

    return new Promise((resolve, reject) => {
      let data = ''
      response.data.on('data', (chunk: Buffer) => {
        data += chunk.toString()
      })
      response.data.on('end', () => {
        try {
          const parsedData = JSON.parse(data)
          resolve(parsedData)
        } catch (parseError) {
          // Se houver erro ao parsear o JSON, tenta restaurar do backup
          restoreFromBackup(drive, userId)
            .then((backupData) => resolve(backupData))
            .catch((backupError) => reject(backupError))
        }
      })
      response.data.on('error', (err: Error) => {
        // Se houver erro ao ler o arquivo, tenta restaurar do backup
        restoreFromBackup(drive, userId)
          .then((backupData) => resolve(backupData))
          .catch((backupError) => reject(backupError))
      })
    })
  } catch (error: any) {
    // Se for um erro 404 ou qualquer outro erro, tenta restaurar do backup
    return await restoreFromBackup(drive, userId)
  }
}
