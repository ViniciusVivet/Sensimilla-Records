# Arquivos de midia

Esta pasta separa os arquivos-fonte locais dos arquivos realmente publicados pelo site.

- `source/images/` - logos, fotografias, capturas e mockups originais.
- `source/videos/` - videos brutos antes de serem preparados para o site.
- `source/documents/` - apresentacoes, portfolios e outros documentos de trabalho.

O diretorio `source/` e ignorado pelo Git para evitar duplicar arquivos pesados ou enviar materiais de trabalho no deploy. Os assets usados em producao ficam em `web/public/`, com nomes normalizados e referenciados pelo codigo.
