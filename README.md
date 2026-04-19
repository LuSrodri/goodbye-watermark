# Goodbye Watermark

Ferramenta de remoção de marca d'água usando IA. Sem necessidade de cadastro.

## Stack

- **Framework:** Next.js 16 (App Router)
- **Estilização:** Tailwind CSS 4
- **Processamento de imagem:** Replicate API (modelo `qwen/qwen-image-edit-2511`)
- **Armazenamento local:** IndexedDB
- **Pagamentos:** Stripe Checkout
- **Analytics:** Vercel Analytics

## Funcionalidades

- Upload de imagens via drag-and-drop, seleção de arquivo ou Ctrl+V
- Processamento com IA para remoção de marcas d'água
- **Plano gratuito:** 5 imagens por dia, reset à meia-noite
- **Créditos pagos:** pacotes de 10 ($3) ou 50 ($0.20/img) créditos via Stripe — não expiram
- Modo batch: seleção e processamento de múltiplas imagens ao mesmo tempo (exclusivo para créditos pagos)
- Download individual ou de todas as imagens processadas
- Histórico de imagens processadas
- Compartilhamento via Web Share API
- Landing pages dinâmicas para SEO (stock-photos, social-media, designers, etc.)

## Sistema de créditos

Os créditos pagos ficam armazenados no IndexedDB do navegador (sem necessidade de conta). O fluxo de pagamento usa Stripe Checkout com redirecionamento — após o pagamento, a sessão é verificada server-side via `/api/verify-payment` antes de liberar os créditos, prevenindo uso duplicado do mesmo comprovante de pagamento.

Prioridade de consumo: créditos pagos são consumidos primeiro. Ao zerarem, o modo gratuito (5/dia) é retomado automaticamente.

## Setup

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Copie `.env.example` para `.env.local` e configure as variáveis:
   ```bash
   cp .env.example .env.local
   ```
   - `REPLICATE_API_TOKEN` — token da API do Replicate
   - `NEXT_PUBLIC_SITE_URL` — URL do site (ex: `http://localhost:3000` para dev)
   - `STRIPE_SECRET_KEY` — chave secreta do Stripe (`sk_test_...` para dev)
   - `RAPIDAPI_PROXY_SECRET` — secret do gateway RapidAPI (header `X-RapidAPI-Proxy-Secret`)
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` — Cloudflare Turnstile (invisible) para proteger `/api/process` no site consumidor. Opcionais em dev: se `TURNSTILE_SECRET_KEY` não estiver setada, a verificação é pulada.

4. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run start` - Servidor de produção
- `npm run lint` - Lint do código
