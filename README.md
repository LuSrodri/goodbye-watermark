# Goodbye Watermark

Ferramenta gratuita de remoção de marca d'água usando IA. Sem necessidade de cadastro.

## Stack

- **Framework:** Next.js 16 (App Router)
- **Estilização:** Tailwind CSS 4
- **Processamento de imagem:** Replicate API (modelo `qwen/qwen-image-edit-2511`)
- **Armazenamento local:** IndexedDB
- **Analytics:** Vercel Analytics

## Funcionalidades

- Upload de imagens via drag-and-drop ou seleção de arquivo
- Processamento com IA para remoção de marcas d'água
- Limite de 5 imagens por dia por sessão
- Histórico de imagens processadas
- Compartilhamento via Web Share API
- Landing pages dinâmicas para SEO (stock-photos, social-media, designers, etc.)

## Setup

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Copie `.env.example` para `.env.local` e configure as variáveis:
   - `REPLICATE_API_TOKEN` - Token da API do Replicate

4. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run start` - Servidor de produção
- `npm run lint` - Lint do código
