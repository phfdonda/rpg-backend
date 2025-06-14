/**
 * Serviço de Personagem - Gerencia personagens e suas modificações
 */

import { v4 as uuidv4 } from 'uuid'
import {
    Personagem,
    ModificacaoPersonagem,
    ResultadoModificacao,
    Atributos,
    Habilidades,
    Estado,
} from './tipos'
import { Gerenciador } from '@Gerenciador'
import { ServicoInventario } from '../inventario'

export class ServicoPersonagem {
    private personagens: Map<string, Personagem> = new Map()
    private gerenciador: Gerenciador
    private servicoInventario: ServicoInventario

    constructor() {
        this.gerenciador = new Gerenciador()
        this.servicoInventario = new ServicoInventario()
    }

    async criarPersonagem(
        nome: string,
        atributos: Atributos,
        habilidades: Habilidades[] = []
    ): Promise<Personagem> {
        const inventario = await this.servicoInventario.criarInventario(nome, 100)

        const personagem: Personagem = {
            id: uuidv4(),
            nome,
            nivel: 1,
            experiencia: 0,
            vida: {
                atual: 100,
                maximo: 100,
            },
            energia: {
                atual: 100,
                maximo: 100,
            },
            atributos,
            habilidades,
            estados: [],
            inventario: inventario.id,
            local: 'inicio',
        }

        this.personagens.set(personagem.id, personagem)
        return personagem
    }

    async aplicarModificacao(
        personagemId: string,
        modificacao: ModificacaoPersonagem
    ): Promise<ResultadoModificacao> {
        const personagem = this.personagens.get(personagemId)
        if (!personagem) {
            throw new Error('Personagem não encontrado')
        }

        const resultado: ResultadoModificacao = {
            sucesso: false,
            mensagem: '',
            personagem: { ...personagem },
            modificacoes: [],
        }

        switch (modificacao.tipo) {
            case 'atributo':
                resultado.personagem.atributos = this.modificarAtributos(
                    personagem.atributos,
                    modificacao.valor as Partial<Atributos>,
                    modificacao.operacao
                )
                break
            case 'habilidade':
                resultado.personagem.habilidades = this.modificarHabilidades(
                    personagem.habilidades,
                    modificacao.valor as Habilidades,
                    modificacao.operacao
                )
                break
            case 'estado':
                resultado.personagem.estados = this.modificarEstados(
                    personagem.estados,
                    modificacao.valor as Estado,
                    modificacao.operacao
                )
                break
            case 'vida':
                resultado.personagem.vida = this.modificarRecurso(
                    personagem.vida,
                    modificacao.valor as number,
                    modificacao.operacao
                )
                break
            case 'energia':
                resultado.personagem.energia = this.modificarRecurso(
                    personagem.energia,
                    modificacao.valor as number,
                    modificacao.operacao
                )
                break
            case 'experiencia':
                resultado.personagem.experiencia = this.modificarExperiencia(
                    personagem,
                    modificacao.valor as number,
                    modificacao.operacao
                )
                break
        }

        // Processa as modificações através do Gerenciador
        const resultadoGerenciador = await this.gerenciador.processarAcoes([
            {
                tipo: 'modificar_personagem',
                personagem: personagemId,
                modificacao,
            },
        ])

        if (!resultadoGerenciador.sucesso) {
            return {
                sucesso: false,
                mensagem: resultadoGerenciador.mensagem,
                personagem,
                modificacoes: [],
            }
        }

        resultado.sucesso = true
        resultado.mensagem = 'Modificação aplicada com sucesso'
        resultado.modificacoes = [modificacao]

        this.personagens.set(personagemId, resultado.personagem)
        return resultado
    }

    private modificarAtributos(
        atributos: Atributos,
        modificacao: Partial<Atributos>,
        operacao: 'adicionar' | 'remover' | 'modificar'
    ): Atributos {
        const resultado = { ...atributos }
        for (const [atributo, valor] of Object.entries(modificacao)) {
            if (operacao === 'adicionar') {
                resultado[atributo as keyof Atributos] += valor as number
            } else if (operacao === 'remover') {
                resultado[atributo as keyof Atributos] -= valor as number
            } else {
                resultado[atributo as keyof Atributos] = valor as number
            }
        }
        return resultado
    }

    private modificarHabilidades(
        habilidades: Habilidades[],
        modificacao: Habilidades,
        operacao: 'adicionar' | 'remover' | 'modificar'
    ): Habilidades[] {
        const resultado = [...habilidades]
        const index = resultado.findIndex((h) => h.nome === modificacao.nome)

        if (operacao === 'adicionar') {
            if (index === -1) {
                resultado.push(modificacao)
            }
        } else if (operacao === 'remover') {
            if (index !== -1) {
                resultado.splice(index, 1)
            }
        } else {
            if (index !== -1) {
                resultado[index] = modificacao
            }
        }

        return resultado
    }

    private modificarEstados(
        estados: Estado[],
        modificacao: Estado,
        operacao: 'adicionar' | 'remover' | 'modificar'
    ): Estado[] {
        const resultado = [...estados]
        const index = resultado.findIndex((e) => e.tipo === modificacao.tipo)

        if (operacao === 'adicionar') {
            if (index === -1) {
                resultado.push(modificacao)
            }
        } else if (operacao === 'remover') {
            if (index !== -1) {
                resultado.splice(index, 1)
            }
        } else {
            if (index !== -1) {
                resultado[index] = modificacao
            }
        }

        return resultado
    }

    private modificarRecurso(
        recurso: { atual: number; maximo: number },
        valor: number,
        operacao: 'adicionar' | 'remover' | 'modificar'
    ): { atual: number; maximo: number } {
        const resultado = { ...recurso }
        if (operacao === 'adicionar') {
            resultado.atual = Math.min(resultado.atual + valor, resultado.maximo)
        } else if (operacao === 'remover') {
            resultado.atual = Math.max(resultado.atual - valor, 0)
        } else {
            resultado.atual = Math.min(valor, resultado.maximo)
        }
        return resultado
    }

    private modificarExperiencia(
        personagem: Personagem,
        valor: number,
        operacao: 'adicionar' | 'remover' | 'modificar'
    ): number {
        let novaExperiencia = personagem.experiencia
        if (operacao === 'adicionar') {
            novaExperiencia += valor
        } else if (operacao === 'remover') {
            novaExperiencia = Math.max(novaExperiencia - valor, 0)
        } else {
            novaExperiencia = valor
        }

        // Verifica se o personagem subiu de nível
        const nivelAtual = Math.floor(novaExperiencia / 1000) + 1
        if (nivelAtual > personagem.nivel) {
            personagem.nivel = nivelAtual
            // Aumenta atributos e vida máxima ao subir de nível
            personagem.vida.maximo += 10
            personagem.vida.atual = personagem.vida.maximo
            personagem.energia.maximo += 5
            personagem.energia.atual = personagem.energia.maximo
        }

        return novaExperiencia
    }

    getPersonagem(id: string): Personagem | undefined {
        return this.personagens.get(id)
    }

    listarPersonagens(): Personagem[] {
        return Array.from(this.personagens.values())
    }
}

