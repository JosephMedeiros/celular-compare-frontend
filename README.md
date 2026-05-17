# Celular Compare - Frontend Estático (Astro + Tailwind CSS)

Este é o frontend do projeto Celular Compare, construído com [Astro](https://astro.build/) para gerar um site estático de alta performance, otimizado para SEO e com custo zero de hospedagem. Ele consome os dados gerados e atualizados automaticamente pelo backend de "Data as Code" (Bloco 1 e 2).

## Funcionalidades

- **Páginas de Produto Dinâmicas**: Rotas `/celulares/[slug]` que exibem detalhes do celular, especificações, avaliações lógicas, gráfico de histórico de preços (Chart.js) e um botão de CTA para o Mercado Livre.
- **Páginas de Comparação Dinâmicas**: Rotas `/compare/[slug1]-vs-[slug2]` que permitem comparar dois celulares lado a lado.
- **SEO Programático**: Geração dinâmica de `sitemap.xml` e injeção de dados estruturados [JSON-LD (Schema.org Product)](https://schema.org/Product) em cada página de produto para melhorar a visibilidade nos resultados de busca do Google.
- **Filtro e Busca Facetada Client-Side**: Um sistema de busca e filtro avançado que funciona 100% no navegador, consumindo um arquivo `search-index.json` gerado no build, eliminando a necessidade de um backend para buscas.
- **Mobile-First Design**: Utiliza [Tailwind CSS](https://tailwindcss.com/) para um design responsivo e moderno.

## Estrutura do Projeto

- `src/pages/`: Contém as páginas do site, incluindo as rotas dinâmicas para celulares e comparações.
  - `celulares/[slug].astro`: Página de detalhes de um celular.
  - `compare/[slug1]-vs-[slug2].astro`: Página de comparação entre dois celulares.
  - `busca.astro`: Página com o filtro e busca client-side.
- `src/layouts/`: Layouts Astro para a estrutura básica das páginas (`Layout.astro`).
- `src/components/`: Componentes reutilizáveis, como `PriceChart.astro` e `ProductSchema.astro`, `SearchFilter.astro`.
- `src/lib/`: Funções utilitárias para carregar e processar os dados JSON (`data.ts`, `generateSearchIndex.ts`).
- `src/styles/`: Arquivos de estilo, incluindo `global.css` para Tailwind CSS.
- `public/`: Assets estáticos e arquivos gerados no build, como `sitemap.xml` e `search-index.json`.
- `scripts/`: Scripts auxiliares para o processo de build, como `generate-sitemap.ts` e `generate-search-index.ts`.

## Desenvolvimento Local

Para rodar o projeto localmente:

1.  Certifique-se de ter o Node.js instalado.
2.  Navegue até a pasta `celular-compare-frontend`.
3.  Instale as dependências:
    ```bash
    npm install
    ```
4.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
    O site estará disponível em `http://localhost:4321`.

## Build para Produção

Para gerar a versão estática do site:

1.  Navegue até a pasta `celular-compare-frontend`.
2.  Execute o comando de build:
    ```bash
    npm run build
    ```
    Isso irá gerar os arquivos estáticos na pasta `dist/`, além de `sitemap.xml` e `search-index.json` na pasta `public/`.

## Deploy Estático (Custo Zero)

O Astro gera um site estático que pode ser hospedado em diversas plataformas de custo zero. As mais recomendadas são Vercel e GitHub Pages.

### Vercel

1.  Crie uma conta gratuita na [Vercel](https://vercel.com/).
2.  Conecte seu repositório GitHub (onde o frontend está localizado).
3.  A Vercel detectará automaticamente que é um projeto Astro e configurará o build. Certifique-se de que o comando de build seja `npm run build` e o diretório de saída seja `dist`.
4.  A cada push para o branch principal, a Vercel fará o deploy automaticamente.

### GitHub Pages

1.  No seu repositório GitHub do frontend, vá em **Settings** > **Pages**.
2.  Em "Source", selecione o branch `main` (ou `master`) e a pasta `/docs` ou `/ (root)`.
3.  Para usar a pasta `dist` gerada pelo Astro, você precisará de um workflow do GitHub Actions para copiar o conteúdo de `dist` para o branch `gh-pages` ou para a pasta `docs`.
    *   **Opção 1 (gh-pages branch)**: Crie um workflow que execute `npm run build` e depois use uma action como `peaceiris/actions-gh-pages@v3` para publicar o conteúdo da pasta `dist` no branch `gh-pages`.
    *   **Opção 2 (docs folder)**: Configure o Astro para gerar o build na pasta `docs` (alterando `outDir` em `astro.config.mjs`) e configure o GitHub Pages para servir dessa pasta no branch `main`.

    Exemplo de `astro.config.mjs` para GitHub Pages (Opção 2):
    ```javascript
    import { defineConfig } from 'astro/config';
    import tailwindcss from '@tailwindcss/vite';

    export default defineConfig({
      integrations: [],
      vite: {
        plugins: [tailwindcss()],
      },
      outDir: './docs', // Altera o diretório de saída para 'docs'
      base: '/celular-compare-frontend/', // Se o site for hospedado em um subdiretório (ex: username.github.io/repo-name)
    });
    ```

## Próximos Passos

- **Personalização**: Ajuste os estilos, adicione mais componentes e refine a experiência do usuário.
- **Novas Páginas**: Crie páginas adicionais como "Sobre", "Contato", "Política de Privacidade", etc.
- **Otimização de Imagens**: Implemente otimização de imagens para melhorar ainda mais a performance.

---
