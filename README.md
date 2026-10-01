# Portfólio — Alan Mateus

Versão estática pronta para GitHub Pages, com os últimos ajustes, animações, slides e links dos protótipos.

## Publicar agora (sem instalar nada)

1. Extraia o ZIP e copie o conteúdo desta pasta para a raiz do repositório. Não envie o ZIP nem crie outra pasta envolvendo os arquivos.
2. Faça commit e push para `main` (ou a branch que você usa).
3. No GitHub, abra **Settings → Pages**.
4. Em **Source**, selecione **Deploy from a branch**.
5. Selecione **main** e **/docs**. Clique em **Save**.
6. Aguarde a publicação. O endereço aparecerá nessa tela.

A pasta `docs` já está compilada e deve entrar no commit. Não precisa rodar npm para publicar. Os caminhos relativos funcionam tanto em `usuario.github.io` quanto em `usuario.github.io/repositorio/`.

## Arquivos

- `docs/`: site pronto, incluindo HTML, JavaScript, CSS, imagens e slides.
- `src/page.tsx`: estrutura visual e seções.
- `src/projects.ts`: textos dos projetos.
- `src/project-actions.tsx`: links Figma e visualizadores de slides.
- `src/globals.css`: estilos e animações.
- `public/assets/`: imagens e slides usados na compilação.
- `public/favicon.svg`: ícone da aba.
- `index.html`: título e descrição.
- `vite.config.ts`: configuração de compilação.

## Editar depois

Instale Node.js 22.13 ou superior e execute na pasta:

```bash
npm install
npm run dev
```

Edite `src/` ou `public/`. Depois execute:

```bash
npm run build
```

Faça commit e push dos arquivos alterados, incluindo `docs/`. O Pages atualizará o site. Inclua também o `package-lock.json` gerado pelo npm.

Para conferir a versão compilada, execute `npm run preview` e abra o endereço mostrado. Não abra `docs/index.html` por duplo clique: módulos JavaScript precisam de servidor HTTP.

As fontes usam Google Fonts; os protótipos abrem no Figma. Todas as imagens e apresentações estão incluídas. Não precisa de servidor, conta no Sites, credenciais ou variáveis de ambiente.

Documentação: https://docs.github.com/pt/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
