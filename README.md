# RPG Narrator AI

Um backend modular para jogos de RPG com inteligência artificial, integração com Google Drive e arquitetura escalável.

## Funcionalidades

- Autenticação com Google para acesso ao Google Drive
- Geração de narrativas e decisões usando a API Gemini do Google
- Modularização por agentes: Decisor, Gerenciador, Narrador, Criador
- Serviços para conversa, inventário e personagem
- Utilidades para validação e aleatoriedade
- Salvamento automático das histórias no Google Drive
- Sistema de contexto para manter a coerência da narrativa
- Sistema de decisão baseado em regras e fatores aleatórios

## Estrutura do Projeto

```
src/
├── api/                # Rotas e controladores da API
├── config/             # Configurações e variáveis de ambiente
├── infra/              # Infraestrutura (IA, armazenamento)
│   ├── ia/gemini/      # Cliente e tipos Gemini
│   └── armazenamento/drive/ # Cliente e tipos Google Drive
├── modulos/            # Módulos de lógica do jogo
│   ├── Decisor/        # Árbitro (decisões)
│   ├── Gerenciador/    # Arquivista (gestão de estado)
│   ├── Narrador/       # Narrador (narrativas)
│   └── Criador/        # Criador (elementos do jogo)
├── servicos/           # Serviços de conversa, inventário e personagem
├── tipos/              # Tipos globais e utilitários
├── utils/              # Utilidades (aleatoriedade, validação)
└── public/             # Frontend (se aplicável)
```

### Importações Absolutas

O projeto utiliza importações absolutas para melhor organização e manutenção do código. Os aliases configurados são:

#### Aliases Principais
- `@/*` - Aponta para `src/*`
- `@config/*` - Aponta para `src/config/*`
- `@api/*` - Aponta para `src/api/*`
- `@utils/*` - Aponta para `src/utils/*`

#### Aliases de Módulos
- `@Decisor/*` - Aponta para `src/modulos/Decisor/*`
- `@Narrador/*` - Aponta para `src/modulos/Narrador/*`
- `@Gerenciador/*` - Aponta para `src/modulos/Gerenciador/*`
- `@Criador/*` - Aponta para `src/modulos/Criador/*`

#### Aliases de Serviços e Infraestrutura
- `@servicos/*` - Aponta para `src/servicos/*`
- `@infra/*` - Aponta para `src/infra/*`

Exemplo de uso:
```typescript
// Importação relativa (não recomendada)
import { ServicoConversa } from '../../servicos/conversa'
import { Arbitro } from '../../modulos/Decisor/agentes/arbitro'

// Importação absoluta (recomendada)
import { ServicoConversa } from '@servicos/conversa'
import { Arbitro } from '@Decisor/agentes/arbitro'
```

## Fluxo Principal

1. **Jogador envia ação** via rota `/chat`.
2. **ServicoConversa** processa a mensagem:
   - Chama o Decisor para decisões de regras.
   - Chama o Gerenciador para atualizar estados e inventário.
   - Chama o Narrador para gerar a narrativa.
3. **Respostas** são retornadas ao frontend e salvas no histórico.
4. **Google Drive** é usado para persistência e backup.

## Requisitos

- Node.js 18 ou superior
- Conta Google com acesso ao Google Drive
- Chave de API do Google Gemini

## Configuração

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITORIO]
cd rpg-backend
```

2. Instale as dependências:
```bash
npm install
```

3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```
# Configuração do Gemini
GEMINI_API_KEY=sua_chave_api_gemini

# Configuração do Google Drive
GOOGLE_CLIENT_ID=seu_client_id_google
GOOGLE_CLIENT_SECRET=seu_client_secret_google
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
GOOGLE_DRIVE_FOLDER_ID=id_da_pasta_do_drive

# Configuração do Servidor
PORT=3000
```

> **Nota**: Você pode obter as credenciais do Google Cloud Console e do Gemini AI Platform. O `GOOGLE_DRIVE_FOLDER_ID` é o ID da pasta no Google Drive onde as histórias serão salvas.

4. Configure o projeto no Google Cloud Console:
   - Crie um novo projeto
   - Ative as APIs do Google Drive e Gemini
   - Configure as credenciais OAuth 2.0
   - Adicione `http://localhost:3000/auth/google/callback` como URI de redirecionamento autorizado

5. Inicie o servidor:
```bash
npm run dev
```

6. Acesse o aplicativo em `http://localhost:3000`

## Como Usar

1. Autentique-se com Google
2. Descreva o contexto inicial da sua história
3. Digite as ações do seu personagem
4. Veja a narrativa gerada e o estado atualizado
5. Salve sua história no Google Drive

## Testes

- Recomenda-se criar testes unitários para cada serviço e módulo em `src/servicos/` e `src/modulos/`.
- Utilize Jest ou outra biblioteca de testes para garantir a integridade das regras de negócio.

## Scripts de Seed

- Para popular dados iniciais (personagens, itens, etc.), crie scripts em `src/scripts/seed.ts`.

## Tecnologias Utilizadas

- TypeScript
- Express.js
- Google Gemini AI
- Google Drive API
- Jest (para testes)
- HTML5/CSS3/JavaScript (frontend)

## Contribuindo

Contribuições são bem-vindas! Por favor, leia o guia de contribuição antes de enviar um pull request.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

## Sistema de Decisão

O módulo Decisor é responsável por avaliar as ações dos jogadores e determinar seus resultados. Ele utiliza um sistema de regras e fatores aleatórios para criar uma experiência dinâmica e imprevisível.

### Componentes do Sistema de Decisão

1. **Árbitro**: Responsável por interpretar as ações dos jogadores e determinar seus resultados.
   - Avalia a dificuldade da tarefa
   - Considera a descrição da ação do jogador
   - Aplica fatores aleatórios (-2 a +2)
   - Determina o nível de sucesso (Falha Crítica a Sucesso Crítico)

2. **Regras de Dificuldade**:
   - Trivial: Tarefas simples e diretas
   - Simples: Tarefas comuns com pequenos desafios
   - Moderada: Tarefas que requerem atenção e habilidade
   - Difícil: Tarefas complexas que testam os limites
   - Extrema: Tarefas que desafiam até mesmo os mais experientes

3. **Níveis de Sucesso**:
   - Falha Crítica: O pior resultado possível
   - Falha: Ação não bem-sucedida
   - Sucesso Parcial: Resultado parcialmente satisfatório
   - Sucesso Total: Ação bem-sucedida
   - Sucesso Crítico: O melhor resultado possível

4. **Fatores Aleatórios**:
   - -2: Grande desvantagem
   - -1: Pequena desvantagem
   - 0: Neutro
   - +1: Pequena vantagem
   - +2: Grande vantagem

### Fluxo de Decisão

1. O jogador descreve sua ação
2. O Árbitro analisa o contexto e a ação
3. A dificuldade base é determinada
4. Modificadores narrativos são aplicados
5. Fatores aleatórios são considerados
6. O resultado final é determinado e narrado 