import { drive_v3 } from 'googleapis'

export interface DriveCredentials {
    access_token: string
    refresh_token: string
    scope: string
    token_type: string
    expiry_date: number
}

export type DriveFile = {
    id: string
    name: string
    mimeType?: string
}

export interface DriveConfig {
    clientId: string
    clientSecret: string
    redirectUri: string
    pastaId: string
}

