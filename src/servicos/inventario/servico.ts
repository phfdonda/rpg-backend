/**
 * Serviço de Inventário - Gerencia itens e inventários dos personagens
 */

import { v4 as uuidv4 } from 'uuid'
import { Item, Inventario, OperacaoInventario, ResultadoOperacao } from './tipos'
import { Gerenciador } from '../../modulos/Gerenciador'

export class ServicoInventario {
    private inventarios: Map<string, Inventario> = new Map()
    private gerenciador: Gerenciador

    constructor() {
        this.gerenciador = new Gerenciador()
    }

    async criarInventario(dono: string, capacidade: number): Promise<Inventario> {
        const inventario: Inventario = {
            id: uuidv4(),
            dono,
            capacidade,
            pesoAtual: 0,
            itens: [],
        }

        this.inventarios.set(inventario.id, inventario)
        return inventario
    }

    async realizarOperacao(operacao: OperacaoInventario): Promise<ResultadoOperacao> {
        const inventario = this.inventarios.get(operacao.item.id)
        if (!inventario) {
            throw new Error('Inventário não encontrado')
        }

        let resultado: ResultadoOperacao = {
            sucesso: false,
            mensagem: '',
            inventarioAtualizado: { ...inventario },
            itensAfetados: [],
        }

        switch (operacao.tipo) {
            case 'adicionar':
                resultado = await this.adicionarItem(inventario, operacao)
                break
            case 'remover':
                resultado = await this.removerItem(inventario, operacao)
                break
            case 'usar':
                resultado = await this.usarItem(inventario, operacao)
                break
            case 'transferir':
                resultado = await this.transferirItem(inventario, operacao)
                break
        }

        if (resultado.sucesso) {
            this.inventarios.set(inventario.id, resultado.inventarioAtualizado)
        }

        return resultado
    }

    private async adicionarItem(
        inventario: Inventario,
        operacao: OperacaoInventario
    ): Promise<ResultadoOperacao> {
        const novoPeso =
            inventario.pesoAtual + (operacao.item.atributos.peso || 0) * operacao.quantidade

        if (novoPeso > inventario.capacidade) {
            return {
                sucesso: false,
                mensagem: 'Capacidade do inventário excedida',
                inventarioAtualizado: inventario,
                itensAfetados: [],
            }
        }

        const itemExistente = inventario.itens.find((i) => i.id === operacao.item.id)
        if (itemExistente) {
            itemExistente.quantidade += operacao.quantidade
        } else {
            inventario.itens.push({ ...operacao.item })
        }

        return {
            sucesso: true,
            mensagem: 'Item adicionado com sucesso',
            inventarioAtualizado: {
                ...inventario,
                pesoAtual: novoPeso,
            },
            itensAfetados: [operacao.item],
        }
    }

    private async removerItem(
        inventario: Inventario,
        operacao: OperacaoInventario
    ): Promise<ResultadoOperacao> {
        const itemIndex = inventario.itens.findIndex((i) => i.id === operacao.item.id)
        if (itemIndex === -1) {
            return {
                sucesso: false,
                mensagem: 'Item não encontrado no inventário',
                inventarioAtualizado: inventario,
                itensAfetados: [],
            }
        }

        const item = inventario.itens[itemIndex]
        if (item.quantidade < operacao.quantidade) {
            return {
                sucesso: false,
                mensagem: 'Quantidade insuficiente do item',
                inventarioAtualizado: inventario,
                itensAfetados: [],
            }
        }

        item.quantidade -= operacao.quantidade
        if (item.quantidade === 0) {
            inventario.itens.splice(itemIndex, 1)
        }

        return {
            sucesso: true,
            mensagem: 'Item removido com sucesso',
            inventarioAtualizado: {
                ...inventario,
                pesoAtual: inventario.pesoAtual - (item.atributos.peso || 0) * operacao.quantidade,
            },
            itensAfetados: [item],
        }
    }

    private async usarItem(
        inventario: Inventario,
        operacao: OperacaoInventario
    ): Promise<ResultadoOperacao> {
        const itemIndex = inventario.itens.findIndex((i) => i.id === operacao.item.id)
        if (itemIndex === -1) {
            return {
                sucesso: false,
                mensagem: 'Item não encontrado no inventário',
                inventarioAtualizado: inventario,
                itensAfetados: [],
            }
        }

        const item = inventario.itens[itemIndex]
        if (item.quantidade < operacao.quantidade) {
            return {
                sucesso: false,
                mensagem: 'Quantidade insuficiente do item',
                inventarioAtualizado: inventario,
                itensAfetados: [],
            }
        }

        // Processa o uso do item através do Gerenciador
        const resultado = await this.gerenciador.processarAcoes([
            {
                tipo: 'usar_item',
                item: item.id,
                quantidade: operacao.quantidade,
            },
        ])

        if (!resultado.sucesso) {
            return {
                sucesso: false,
                mensagem: resultado.mensagem,
                inventarioAtualizado: inventario,
                itensAfetados: [],
            }
        }

        return this.removerItem(inventario, operacao)
    }

    private async transferirItem(
        inventario: Inventario,
        operacao: OperacaoInventario
    ): Promise<ResultadoOperacao> {
        if (!operacao.destino) {
            return {
                sucesso: false,
                mensagem: 'Destino não especificado',
                inventarioAtualizado: inventario,
                itensAfetados: [],
            }
        }

        const inventarioDestino = this.inventarios.get(operacao.destino)
        if (!inventarioDestino) {
            return {
                sucesso: false,
                mensagem: 'Inventário de destino não encontrado',
                inventarioAtualizado: inventario,
                itensAfetados: [],
            }
        }

        const resultadoRemocao = await this.removerItem(inventario, operacao)
        if (!resultadoRemocao.sucesso) {
            return resultadoRemocao
        }

        const resultadoAdicao = await this.adicionarItem(inventarioDestino, operacao)
        if (!resultadoAdicao.sucesso) {
            // Reverte a remoção se a adição falhar
            await this.adicionarItem(inventario, operacao)
            return {
                sucesso: false,
                mensagem: 'Falha ao transferir item',
                inventarioAtualizado: inventario,
                itensAfetados: [],
            }
        }

        return {
            sucesso: true,
            mensagem: 'Item transferido com sucesso',
            inventarioAtualizado: resultadoRemocao.inventarioAtualizado,
            itensAfetados: resultadoRemocao.itensAfetados,
        }
    }

    getInventario(id: string): Inventario | undefined {
        return this.inventarios.get(id)
    }

    listarInventarios(): Inventario[] {
        return Array.from(this.inventarios.values())
    }
}

