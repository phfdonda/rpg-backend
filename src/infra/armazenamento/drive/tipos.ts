import { drive_v3 } from 'googleapis'

/**
 * Credenciais de acesso ao Google Drive
 */
export interface DriveCredentials {
    access_token: string
    refresh_token: string
    scope: string
    token_type: string
    expiry_date: number
}

/**
 * Representa um arquivo no Google Drive
 */
export interface DriveFile {
    id: string
    name: string
    mimeType?: string
}

/**
 * Configuração necessária para o cliente do Drive
 */
export interface DriveConfig {
    clientId: string
    clientSecret: string
    redirectUri: string
    pastaId: string
}

/**
 * Opções para upload de arquivo
 */
export interface UploadOptions {
    fileName: string
    mimeType?: string
    parents?: string[]
}

/**
 * Opções para download de arquivo
 */
export interface DownloadOptions {
    fileId: string
    destinationPath: string
}

/**
 * Opções para busca de arquivo
 */
export interface SearchOptions {
    fileName?: string
    mimeType?: string
    parents?: string[]
    pageSize?: number
}

