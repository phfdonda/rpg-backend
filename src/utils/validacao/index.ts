/**
 * Utilitários para validação de dados
 */

/**
 * Valida se um valor está dentro de um intervalo
 */
export function validarIntervalo(valor: number, min: number, max: number, mensagem?: string): void {
    if (valor < min || valor > max) {
        throw new Error(mensagem || `Valor ${valor} fora do intervalo [${min}, ${max}]`)
    }
}

/**
 * Valida se uma string não está vazia
 */
export function validarStringNaoVazia(valor: string, mensagem?: string): void {
    if (!valor || valor.trim().length === 0) {
        throw new Error(mensagem || 'String não pode estar vazia')
    }
}

/**
 * Valida se um array não está vazio
 */
export function validarArrayNaoVazio<T>(array: T[], mensagem?: string): void {
    if (!array || array.length === 0) {
        throw new Error(mensagem || 'Array não pode estar vazio')
    }
}

/**
 * Valida se um objeto tem todas as propriedades requeridas
 */
export function validarPropriedadesRequeridas(
    objeto: Record<string, any>,
    propriedades: string[],
    mensagem?: string
): void {
    const faltantes = propriedades.filter((prop) => !(prop in objeto))
    if (faltantes.length > 0) {
        throw new Error(mensagem || `Propriedades requeridas faltando: ${faltantes.join(', ')}`)
    }
}

/**
 * Valida se um valor é um número válido
 */
export function validarNumero(valor: any, mensagem?: string): void {
    if (typeof valor !== 'number' || isNaN(valor)) {
        throw new Error(mensagem || 'Valor deve ser um número válido')
    }
}

/**
 * Valida se um valor é uma string válida
 */
export function validarString(valor: any, mensagem?: string): void {
    if (typeof valor !== 'string') {
        throw new Error(mensagem || 'Valor deve ser uma string')
    }
}

/**
 * Valida se um valor é um array válido
 */
export function validarArray(valor: any, mensagem?: string): void {
    if (!Array.isArray(valor)) {
        throw new Error(mensagem || 'Valor deve ser um array')
    }
}

/**
 * Valida se um valor é um objeto válido
 */
export function validarObjeto(valor: any, mensagem?: string): void {
    if (typeof valor !== 'object' || valor === null || Array.isArray(valor)) {
        throw new Error(mensagem || 'Valor deve ser um objeto')
    }
}

/**
 * Valida se um valor é uma data válida
 */
export function validarData(valor: any, mensagem?: string): void {
    const data = new Date(valor)
    if (isNaN(data.getTime())) {
        throw new Error(mensagem || 'Valor deve ser uma data válida')
    }
}

/**
 * Valida se um valor é um booleano válido
 */
export function validarBooleano(valor: any, mensagem?: string): void {
    if (typeof valor !== 'boolean') {
        throw new Error(mensagem || 'Valor deve ser um booleano')
    }
}

/**
 * Valida se um valor é um ID válido
 */
export function validarId(valor: any, mensagem?: string): void {
    if (typeof valor !== 'string' || valor.trim().length === 0) {
        throw new Error(mensagem || 'Valor deve ser um ID válido')
    }
}
