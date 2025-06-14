/**
 * Utilitários para geração de números aleatórios
 */

/**
 * Gera um número inteiro aleatório entre min e max (inclusive)
 */
export function numeroAleatorio(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Gera um número decimal aleatório entre min e max (inclusive)
 */
export function decimalAleatorio(min: number, max: number): number {
    return Math.random() * (max - min) + min
}

/**
 * Escolhe um elemento aleatório de um array
 */
export function escolherAleatorio<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
}

/**
 * Embaralha um array usando o algoritmo Fisher-Yates
 */
export function embaralhar<T>(array: T[]): T[] {
    const resultado = [...array]
    for (let i = resultado.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[resultado[i], resultado[j]] = [resultado[j], resultado[i]]
    }
    return resultado
}

/**
 * Gera um ID aleatório
 */
export function gerarId(): string {
    return Math.random().toString(36).substring(2, 15)
}

/**
 * Gera um número aleatório seguindo uma distribuição normal (gaussiana)
 */
export function normalAleatorio(media: number, desvioPadrao: number): number {
    let u = 0
    let v = 0
    while (u === 0) u = Math.random()
    while (v === 0) v = Math.random()
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
    return z * desvioPadrao + media
}

/**
 * Gera um número aleatório seguindo uma distribuição triangular
 */
export function triangularAleatorio(min: number, max: number, moda: number): number {
    const u = Math.random()
    const c = (moda - min) / (max - min)
    if (u <= c) {
        return min + Math.sqrt(u * (max - min) * (moda - min))
    } else {
        return max - Math.sqrt((1 - u) * (max - min) * (max - moda))
    }
}
