import { google, Auth } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'
import { drive_v3 } from 'googleapis'
import fs from 'fs'
import path from 'path'
import { DRIVE_CONFIG } from '../../../config/drive'
import { DriveCredentials, DriveFile } from './tipos'

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
        this.oauth2Client = new google.auth.OAuth2(
            DRIVE_CONFIG.clientId,
            DRIVE_CONFIG.clientSecret,
            DRIVE_CONFIG.redirectUri
        )
        this.drive = google.drive({ version: 'v3', auth: this.oauth2Client })
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
        const { tokens } = await this.oauth2Client.getToken(code)
        this.oauth2Client.setCredentials(tokens)

        // Salva o token para uso futuro
        fs.writeFileSync(this.TOKEN_PATH, JSON.stringify(tokens))

        return tokens as DriveCredentials
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
        await this.oauth2Client.refreshAccessToken()
    }

    /**
     * Faz upload de um arquivo para o Drive.
     */
    public async uploadFile(filePath: string, fileName: string): Promise<string> {
        try {
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
                throw new Error('ID do arquivo não retornado pelo Google Drive')
            }

            return response.data.id
        } catch (error) {
            console.error('Erro ao fazer upload do arquivo:', error)
            throw error
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

            const dest = fs.createWriteStream(destinationPath)
            response.data
                .on('end', () => console.log('Download concluído'))
                .on('error', (err: Error) => {
                    console.error('Erro durante o download:', err)
                    throw err
                })
                .pipe(dest)
        } catch (error) {
            console.error('Erro ao baixar arquivo:', error)
            throw error
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
            console.error('Erro ao listar arquivos:', error)
            throw error
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
            console.error('Erro ao buscar arquivo:', error)
            throw error
        }
    }

    /**
     * Atualiza um arquivo existente.
     */
    public async updateFile(fileId: string, content: any): Promise<void> {
        try {
            await this.drive.files.update({
                fileId,
                media: {
                    mimeType: 'application/json',
                    body: JSON.stringify(content),
                },
            })
        } catch (error) {
            console.error('Erro ao atualizar arquivo:', error)
            throw error
        }
    }

    /**
     * Cria um novo arquivo.
     */
    public async createFile(fileName: string, content: any): Promise<string> {
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
                throw new Error('ID do arquivo não retornado pelo Google Drive')
            }

            return response.data.id
        } catch (error) {
            console.error('Erro ao criar arquivo:', error)
            throw error
        }
    }
}

// Exporta uma instância única do cliente
export const driveCliente = new DriveCliente()

