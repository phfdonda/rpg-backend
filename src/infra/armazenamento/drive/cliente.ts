import { google, Auth } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'
import { drive_v3 } from 'googleapis'
import fs from 'fs'
import path from 'path'
import { DRIVE_CONFIG } from '../../../config/drive'
import { DriveCredentials, DriveFile } from './tipos'

/**
 * Erro personalizado para operações do Drive
 */
export class DriveError extends Error {
    constructor(
        message: string,
        public readonly originalError?: unknown
    ) {
        super(message)
        this.name = 'DriveError'
    }
}

/**
 * Cliente responsável por gerenciar a comunicação com o Google Drive.
 * Implementa funcionalidades de autenticação, upload, download e gerenciamento de arquivos.
 */
export class DriveCliente {
    private oauth2Client: OAuth2Client
    private drive: drive_v3.Drive
    private readonly SCOPES = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/drive.appdata',
        'https://www.googleapis.com/auth/drive.file',
    ]
    private readonly TOKEN_PATH = path.join(process.cwd(), 'token.json')

    constructor() {
        this.validarConfiguracao()
        this.oauth2Client = new google.auth.OAuth2(
            DRIVE_CONFIG.clientId,
            DRIVE_CONFIG.clientSecret,
            DRIVE_CONFIG.redirectUri
        )
        this.drive = google.drive({ version: 'v3', auth: this.oauth2Client })
        this.carregarTokenSalvo()
    }

    /**
     * Valida se todas as configurações necessárias estão presentes
     */
    private validarConfiguracao(): void {
        const camposObrigatorios = ['clientId', 'clientSecret', 'redirectUri', 'pastaId']
        const camposFaltantes = camposObrigatorios.filter(
            (campo) => !DRIVE_CONFIG[campo as keyof typeof DRIVE_CONFIG]
        )

        if (camposFaltantes.length > 0) {
            throw new DriveError(
                `Configurações obrigatórias faltando: ${camposFaltantes.join(', ')}`
            )
        }
    }

    /**
     * Carrega o token salvo se existir
     */
    private carregarTokenSalvo(): void {
        try {
            if (fs.existsSync(this.TOKEN_PATH)) {
                const token = JSON.parse(fs.readFileSync(this.TOKEN_PATH, 'utf-8'))
                this.setCredentials(token)
            }
        } catch (error) {
            console.warn('Não foi possível carregar o token salvo:', error)
        }
    }

    /**
     * Gera a URL de autorização para o frontend iniciar o processo de autenticação.
     */
    public getAuthUrl(): string {
        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: this.SCOPES,
            include_granted_scopes: true,
        })
    }

    /**
     * Troca o código de autorização por tokens de acesso.
     */
    public async handleAuthCode(code: string): Promise<DriveCredentials> {
        try {
            const { tokens } = await this.oauth2Client.getToken(code)
            this.oauth2Client.setCredentials(tokens)

            // Salva o token para uso futuro
            fs.writeFileSync(this.TOKEN_PATH, JSON.stringify(tokens))

            return tokens as DriveCredentials
        } catch (error) {
            throw new DriveError('Falha ao obter token de acesso', error)
        }
    }

    /**
     * Configura as credenciais do cliente.
     */
    public setCredentials(credentials: DriveCredentials): void {
        this.oauth2Client.setCredentials(credentials)
    }

    /**
     * Atualiza o token de acesso se necessário.
     */
    public async refreshAccessToken(): Promise<void> {
        try {
            await this.oauth2Client.refreshAccessToken()
        } catch (error) {
            throw new DriveError('Falha ao atualizar token de acesso', error)
        }
    }

    /**
     * Faz upload de um arquivo para o Drive.
     */
    public async uploadFile(filePath: string, fileName: string): Promise<string> {
        try {
            if (!fs.existsSync(filePath)) {
                throw new DriveError(`Arquivo não encontrado: ${filePath}`)
            }

            const fileMetadata = {
                name: fileName,
                mimeType: 'application/json',
                parents: [DRIVE_CONFIG.pastaId],
            }

            const media = {
                mimeType: 'application/json',
                body: fs.createReadStream(filePath),
            }

            const response = await this.drive.files.create({
                requestBody: fileMetadata,
                media: media,
                fields: 'id',
            })

            if (!response.data.id) {
                throw new DriveError('ID do arquivo não retornado pelo Google Drive')
            }

            return response.data.id
        } catch (error) {
            throw new DriveError('Erro ao fazer upload do arquivo', error)
        }
    }

    /**
     * Faz download de um arquivo do Drive.
     */
    public async downloadFile(fileId: string, destinationPath: string): Promise<void> {
        try {
            const response = await this.drive.files.get(
                { fileId, alt: 'media' },
                { responseType: 'stream' }
            )

            return new Promise((resolve, reject) => {
                const dest = fs.createWriteStream(destinationPath)

                response.data
                    .on('end', () => {
                        resolve()
                    })
                    .on('error', (err: Error) => {
                        dest.destroy()
                        reject(new DriveError('Erro durante o download', err))
                    })
                    .pipe(dest)

                dest.on('error', (err) => {
                    reject(new DriveError('Erro ao salvar arquivo', err))
                })
            })
        } catch (error) {
            throw new DriveError('Erro ao baixar arquivo', error)
        }
    }

    /**
     * Lista arquivos no Drive.
     */
    public async listFiles(): Promise<DriveFile[]> {
        try {
            const response = await this.drive.files.list({
                pageSize: 10,
                fields: 'nextPageToken, files(id, name, mimeType)',
                q: `'${DRIVE_CONFIG.pastaId}' in parents`,
            })

            return (response.data.files || []).map((file) => ({
                id: file.id!,
                name: file.name!,
                mimeType: file.mimeType || undefined,
            }))
        } catch (error) {
            throw new DriveError('Erro ao listar arquivos', error)
        }
    }

    /**
     * Busca um arquivo específico por nome.
     */
    public async findFile(fileName: string): Promise<DriveFile | null> {
        try {
            const response = await this.drive.files.list({
                q: `name='${fileName}' and '${DRIVE_CONFIG.pastaId}' in parents`,
                fields: 'files(id, name, mimeType)',
            })

            const file = response.data.files?.[0]
            if (!file?.id || !file?.name) return null

            return {
                id: file.id,
                name: file.name,
                mimeType: file.mimeType || undefined,
            }
        } catch (error) {
            throw new DriveError('Erro ao buscar arquivo', error)
        }
    }

    /**
     * Atualiza um arquivo existente.
     */
    public async updateFile<T>(fileId: string, content: T): Promise<void> {
        try {
            await this.drive.files.update({
                fileId,
                media: {
                    mimeType: 'application/json',
                    body: JSON.stringify(content),
                },
            })
        } catch (error) {
            throw new DriveError('Erro ao atualizar arquivo', error)
        }
    }

    /**
     * Cria um novo arquivo.
     */
    public async createFile<T>(fileName: string, content: T): Promise<string> {
        try {
            const fileMetadata = {
                name: fileName,
                mimeType: 'application/json',
                parents: [DRIVE_CONFIG.pastaId],
            }

            const response = await this.drive.files.create({
                requestBody: fileMetadata,
                media: {
                    mimeType: 'application/json',
                    body: JSON.stringify(content),
                },
                fields: 'id',
            })

            if (!response.data.id) {
                throw new DriveError('ID do arquivo não retornado pelo Google Drive')
            }

            return response.data.id
        } catch (error) {
            throw new DriveError('Erro ao criar arquivo', error)
        }
    }
}

// Exporta uma instância única do cliente
export const driveCliente = new DriveCliente()

