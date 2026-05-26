# Painel admin (CMS) — Sensimilla Records

O site ja tem um painel em **`/admin`** para o dono editar conteudo sem mexer no codigo.

## O que da para editar

| Aba no admin | O que muda no site |
|--------------|-------------------|
| **Eventos** | Secao **Tour** (data, cidade, local, nota, link de ingresso) |
| **Membros** | Cards da **Equipe** (foto, bio, links, video no modal) |
| **Musicas** | **Out Now**, mini player Spotify e **Destaque** |
| **Merch** | Produtos da loja (imagem, preco, nome) |
| **Galeria** | Secao **Visuais** / editorial |
| **YouTube** | Hub de videos na home |
| **Redes** | Links do hero e rodape (Instagram, Spotify, etc.) |
| **Midias globais** | Logo do hero, banner, rodape, ID do clipe vertical |

Sem Supabase configurado, o site continua funcionando com os dados padrao de `src/data/site.ts`.

## Configuracao (uma vez)

### 1. Criar projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com) e crie um projeto gratuito.
2. Em **SQL Editor**, abra e execute o arquivo inteiro:
   - `web/supabase/schema.sql`
3. Isso cria tabelas, politicas de seguranca (RLS) e o bucket **`site-media`** para uploads.

### 2. Variaveis na Vercel e local

No painel do projeto (Vercel → Settings → Environment Variables) e em `web/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...sua-anon-key...
```

Valores em Supabase → **Project Settings** → **API** (URL + `anon` `public` key).

Faca **redeploy** na Vercel depois de salvar.

### 3. Usuario admin (login)

1. Supabase → **Authentication** → **Users** → **Add user**.
2. E-mail e senha do dono do site (ex.: e-mail da gravadora).
3. Confirme o e-mail se o projeto exigir confirmacao.

### 4. Acessar o painel

- Producao: `https://seu-dominio.com/admin`
- Local: `http://localhost:3000/admin`

Entre com o e-mail e senha criados no passo 3.

## Uso rapido

- **Novo evento:** aba Eventos → preencha data, cidade, local → marque **Publicado** → Salvar.
- **Trocar foto:** campo de imagem → escolha arquivo (sobe para o Supabase Storage) ou cole URL.
- **Ordem:** campo **Ordem** (`sort_order`) — numero menor aparece primeiro.
- **Rascunho:** desmarque **Publicado** — nao aparece no site, mas fica salvo no admin.

Alteracoes na home aparecem em segundos (sem novo deploy).

## Seguranca

- Apenas usuarios **autenticados** no Supabase podem criar/editar/apagar.
- Visitantes so **leem** registros com `active = true` (politicas RLS no `schema.sql`).
- `/admin` esta com `noindex` e bloqueado em `robots.txt`.

Nao compartilhe a senha do admin. Para outra pessoa, crie outro usuario no Supabase Auth.

## Problemas comuns

| Sintoma | Solucao |
|---------|---------|
| "Supabase nao configurado" | Falta `NEXT_PUBLIC_SUPABASE_*` no `.env.local` ou na Vercel |
| Login falha | Usuario existe em Auth? Senha correta? E-mail confirmado? |
| Upload falha | Rode de novo o `schema.sql` (bucket `site-media` + policies) |
| Site nao muda | Item esta **Publicado**? Tabelas tem dados? (vazio = fallback do `site.ts`) |

## Dados iniciais opcionais

Depois do schema, voce pode cadastrar tudo pelo admin ou rodar inserts manuais no SQL Editor. O evento OFDM's de abril pode ser recriado na aba **Eventos** com a data `2026-04-11`.
