# Sensimilla Records — contexto para o assistente (Claude / Cursor)

## O que é este projeto

Site institucional da **Sensimilla Records** (marca pública **@sensi.rec** no Instagram). É uma **single page** longa na home (`/`) com scroll suave (Lenis), animações com **GSAP + ScrollTrigger**, e rotas extras: `/contato`, `/privacidade`, `/termos`. Stack: **Next.js 16** (App Router), **React 19**, **TypeScript**, **Tailwind CSS v4**.

O repositório na raiz (`SensimillaRecords/`) tem um `package.json` que delega comandos para a pasta **`web/`** — o app Next mora em `web/` (limitação histórica do nome da pasta em maiúsculas no `create-next-app`).

## Onde mexer com frequência

| Área | Caminho |
|------|---------|
| Textos, equipe, links, releases, tour | `src/data/site.ts` (importa links de `dossie.ts`) |
| **Dossiê completo** (todos os URLs, IDs, faixas, pendências) | `src/data/dossie.ts` |
| Página listagem interna | `/referencias` (noindex) |
| Textos longos (manifesto, rascunhos legais) | `src/content/copy.json` |
| Seções da home | `src/components/sections/` |
| Composição da home + scroll | `src/components/home-experience.tsx`, `smooth-scroll.tsx` |
| SEO, layout global, providers | `src/app/layout.tsx` |
| URL canônica / env | `NEXT_PUBLIC_SITE_URL` em `.env.local` (ver `.env.example`) |
| Imagens remotas permitidas | `next.config.ts` → `remotePatterns` |

Conteúdo da gravadora já foi parcialmente povoado com dados reais (integrantes, Spotify, Instagram, OFDM’s, etc.); ajustes finos continuam em `site.ts` e `copy.json`.

## Regras de autonomia (para não ficar ingessado)

- **Pode agir com autonomia** em implementações, correções, refactors pequenos, instalação de deps quando fizer sentido, rodar `lint`/`build`, e **fazer commit** quando encerrar um bloco de trabalho coerente.
- **Commits:** preferir **varios commits pequenos e logicos** (evitar um unico commit gigante). Estilo **Conventional Commits**: tipo e escopo em **ingles** (`feat`, `fix`, `docs`, `chore`, `refactor`, `style`, `test`, `ci`, etc.); primeira linha curta (`tipo(escopo opcional): resumo`). Corpo opcional em **portugues tecnico**, **ASCII sem acentos** (ex.: `secao`, `configuracao`, `referencias`). Exemplo de assunto: `feat(web): secao roster com links spotify`.
- **Push:** **tem permissao para dar push**, mas **avise o humano imediatamente antes** (na mesma resposta, antes de executar o push): confirme branch, o que vai subir e se ha risco (ex.: force push). Nao faca push silencioso.
- **Pergunte ao humano** só quando for decisão **importante** ou de **alto impacto técnico**, por exemplo: troca de stack, mudança de arquitetura grande, remoção de features, custos (API paga), segurança sensível, ou quando houver **ambiguidade forte** que mude o produto. Para o resto, escolha o caminho razoável e documente no commit/PR.
- **Não peça confirmação** para cada arquivo ou linha — evite micro-permissões.

## Idioma e tom

- Respostas ao utilizador em **português** (preferência do projeto).
- Codigo e commits seguem as convencoes acima (tipos em ingles; texto descritivo em portugues ASCII quando for corpo de mensagem).

## Outros ficheiros úteis

- `../README.md` (raiz do repo): como rodar, env, CI, rotas.
- `AGENTS.md` nesta pasta: nota sobre convenções Next.js / breaking changes — consultar quando for mexer em APIs do framework.

## Commits (conventional)

- **Assunto:** `tipo(escopo): resumo curto` — tipo e escopo em **ingles** (ex.: `feat(web):`, `fix(ui):`, `docs(repo):`).
- **Corpo:** opcional; **portugues tecnico** em **ASCII** (sem cedilha/acentos: use `acao`, `secao`, `nao`, etc.).
- **Granularidade:** varios commits logicos > um monolito; agrupar por intencao (dados, UI, SEO, CI, docs).
- **Remote:** `origin` aponta para o GitHub do projeto; branch padrao local costuma ser `master` ou `main` — alinhar com o remoto ao fazer push.

## CI

Workflow em `.github/workflows/ci.yml` (na raiz do repo): lint + build em `web/`.
