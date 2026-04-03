# Sensimilla Records — site

Site institucional da gravadora **Sensimilla Records**: uma página longa com scroll suave, animações (GSAP + ScrollTrigger) e seções para equipe, lançamentos, tour, merch e editorial.

## Estrutura

```
SensimillaRecords/
├── package.json          # atalhos npm que delegam para web/
└── web/                  # app Next.js (código principal)
    ├── src/
    │   ├── app/          # layout, página inicial, estilos globais
    │   ├── components/   # seções, SmoothScroll (Lenis), etc.
    │   ├── content/
    │   │   └── copy.json # textos longos (manifesto, rascunhos legais)
    │   ├── data/
    │   │   └── site.ts   # textos, integrantes, links, mocks
    │   └── lib/
    │       └── site-config.ts  # URL canônica (env)
    └── public/
        └── media/        # fotos da gravadora (coloque JPG/WebP aqui)
```

O app fica dentro de **`web/`** porque o nome da pasta pai em maiúsculas conflitava com regras do `create-next-app`. Na raiz existe um `package.json` só para você rodar comandos sem precisar entrar em `web` toda vez.

## Requisitos

- **Node.js** 20+ (recomendado)
- **npm** (vem com o Node)

## Como rodar

Na pasta **`SensimillaRecords`**:

```bash
npm install --prefix web
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Variáveis de ambiente

Copie o exemplo e ajuste a URL quando tiver domínio:

```bash
cp web/.env.example web/.env.local
```

- **`NEXT_PUBLIC_SITE_URL`** — URL pública (sem barra no final). Usada em metadata, Open Graph, `sitemap.xml` e `robots.txt`.
- **`NEXT_PUBLIC_CONTACT_FORM_ACTION`** (opcional) — URL para onde o formulário de **Contato** envia dados (API, Formspree, etc.). Sem isso, o envio fica só em modo demonstração (log no console).

Alternativa (equivalente):

```bash
cd web
npm install
npm run dev
```

## Scripts (raiz do repositório)

| Comando        | Descrição              |
|----------------|------------------------|
| `npm run dev`    | Servidor de desenvolvimento |
| `npm run build`  | Build de produção           |
| `npm run start`  | Sobe o build (após `build`) |
| `npm run lint`   | ESLint no projeto `web`     |

## Rotas

| Caminho | Conteúdo |
|---------|----------|
| `/` | Home (experiência longa com scroll) |
| `/contato` | Formulário de contato |
| `/referencias` | Listagem interna de **todos** os links públicos (Instagram, Spotify, YouTube, IDs, faixas, pendências) — `noindex` |
| `/privacidade` | Política de privacidade (rascunho) |
| `/termos` | Termos de uso (rascunho) |

Há também **`sitemap.xml`**, **`robots.txt`** e imagem **Open Graph** gerada em `/opengraph-image`.

## CI

Com push/PR em `main` ou `master`, o workflow **`.github/workflows/ci.yml`** roda `lint` e `build` em `web/`.

## Acessibilidade e motion

Quem usa **“reduzir movimento”** no sistema recebe scroll nativo (sem Lenis), animações GSAP desativadas e o bloco vertical em **imagem estática** em vez de vídeo.

## Stack

- **Next.js** (App Router) + **React** + **TypeScript**
- **Tailwind CSS** v4
- **Lenis** — scroll suave
- **GSAP** + **ScrollTrigger** — animações ligadas ao scroll

## Onde editar conteúdo

Quase tudo que é “copiável” (nomes da equipe, links sociais, lançamentos mock, vídeo do hero, etc.) está em:

**`web/src/data/site.ts`** — dados estruturados do site (importa URLs de `dossie.ts`).

**`web/src/data/dossie.ts`** — **fonte única** com selo, todos os links, IDs Spotify, Instagram/YouTube por pessoa, eventos (OFDM’s), faixas citadas, textos de apoio e **pendências** a conferir.

**`web/src/content/copy.json`** — manifesto e textos-base das páginas legais (substituir antes do lançamento).

Pontos úteis em `site.ts`:

- **`members`** — integrantes e slots “Em breve” (`image: null` + `isPlaceholder: true`).
- **`heroSpotlightMemberId`** — quem aparece no card do hero.
- **`roster.featuredMemberId`** — card em destaque na seção da equipe (costuma ser o mesmo id do hero).
- Imagens locais: **`web/public/media/`** (ou outra pasta em `public/`) e caminhos como `"/media/nome.jpg"` em `members`, `editorialCollage`, `heroVideoPoster`, etc.

Seções e layout visual ficam em **`web/src/components/`** (`sections/`, `home-experience.tsx`, `smooth-scroll.tsx`).

## Fotos e mídia (como encher melhor)

1. **Arquivos locais** — crie pastas em **`web/public/media/`** (já existe) ou `public/fotos/`, exporte do Instagram em boa resolução ou use fotos de show/estúdio com direito de uso. No código, referencie como `"/media/nome-do-arquivo.jpg"` (sem `public` no caminho).

2. **Equipe** — em **`members[].image`** (`site.ts`), troque URLs do Spotify por fotos suas quando tiver retratos oficiais; quem está com `image: null` ganha foto assim que você colocar o ficheiro e o caminho.

3. **Colagem “Visuais”** — o array **`editorialCollage`** em `site.ts` hoje usa retratos oficiais do Spotify (COGU, Bright, Vivet). Substitua cada `{ src, alt }` por fotos da gravadora e **sempre preencha `alt`** (acessibilidade e SEO).

4. **Hero** — **`heroVideoPoster`** é a imagem mostrada antes do vídeo carregar; pode apontar para um frame 16:9 ou logo em `public/`. O clip continua em **`heroVideoSrc`** (URL externa ou ficheiro em `public/`).

5. **Clipe vertical** — **`reelPoster`** (`site.ts`): ideal é um frame **9:16** real do Reels/clipe; hoje usa retrato do Vivet como placeholder.

6. **Capas de lançamentos** — em **`featuredRelease.cover`** e **`catalogReleases[].cover`**, use arte oficial (ficheiro local ou URL estável). Domínios novos para `next/image` → **`next.config.ts`**.

7. **Próximo nível** — pasta **press kit** zip no `/contato`, integração **CMS** (Sanity, Contentful) ou **Instagram Basic Display** (só com app review) para puxar posts automaticamente.

## Imagens remotas

Domínios permitidos para `next/image` estão em **`web/next.config.ts`** (`remotePatterns`). Para um host novo, adicione o padrão lá.

## Licença / uso

Projeto privado da gravadora; ajuste licença e créditos conforme a necessidade de vocês.
