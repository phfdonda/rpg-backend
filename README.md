# RPG Narrator AI

Um aplicativo web que usa inteligência artificial para narrar histórias de RPG e salvá-las no Google Drive do jogador.

## Funcionalidades

- Autenticação com Google para acesso ao Google Drive
- Geração de narrativas usando a API Gemini do Google
- Interface moderna e responsiva
- Salvamento automático das histórias no Google Drive
- Sistema de contexto para manter a coerência da narrativa

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
GEMINI_API_KEY=sua_chave_api_gemini
GOOGLE_CLIENT_ID=seu_client_id_google
GOOGLE_CLIENT_SECRET=seu_client_secret_google
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
```

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

1. Clique em "Entrar com Google" para autenticar
2. Descreva o contexto inicial da sua história
3. Digite as ações do seu personagem
4. Clique em "Gerar Narrativa" para ver a resposta da IA
5. Use "Salvar no Google Drive" para guardar sua história

## Tecnologias Utilizadas

- TypeScript
- Express.js
- Google Gemini AI
- Google Drive API
- Tailwind CSS
- HTML5/CSS3/JavaScript

## Contribuindo

Contribuições são bem-vindas! Por favor, leia o guia de contribuição antes de enviar um pull request.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes. 