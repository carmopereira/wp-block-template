# @carmopereira/wp-block-setup

Ferramenta para adicionar scripts custom e configurações aos projetos WordPress criados com `@wordpress/create-block`.

## Instalação

```bash
npm install -g @carmopereira/wp-block-setup
```

Ou usar diretamente com `npx`:

```bash
npx @carmopereira/wp-block-setup
```

## Uso

### 1. Criar um novo block WordPress

```bash
npx @wordpress/create-block@latest meu-plugin --variant=dynamic
cd meu-plugin
```

### 2. Aplicar o setup custom

```bash
npx @carmopereira/wp-block-setup create-block-carmo-addon
```

Ou sem argumento para escolher interativamente:

```bash
npx @carmopereira/wp-block-setup
```

## O que é adicionado

O setup `create-block-carmo-addon` adiciona:

### Scripts ao package.json

- **`prebuild`**: Atualiza automaticamente a versão antes do build (patch version)
- **`updateGIT`**: Script interativo para fazer git add, commit e push
- **`symlink`**: Script para criar symlink do plugin no diretório WordPress

### Scripts na pasta `scripts/`

- **`sync-version.js`**: Sincroniza a versão entre `package.json`, ficheiro PHP principal e `block.json`
- **`create-symlink.js`**: Cria symlink do plugin para o diretório `wp-content/plugins`
- **`update-git.js`**: Facilita o processo de commit e push

### Atualizações ao `.gitignore`

Adiciona entradas padrão para build artefacts, logs, etc.

## Scripts disponíveis

Após aplicar o setup, podes usar:

```bash
# Criar symlink do plugin
npm run symlink

# Fazer commit e push
npm run updateGIT

# Build (atualiza versão automaticamente)
npm run build
```

## Estrutura do repositório

```
carmo-wp-block-template/
├── setups/
│   └── create-block-carmo-addon/
│       ├── setup/
│       │   ├── create-symlink.js
│       │   ├── sync-version.js
│       │   └── update-git.js
│       ├── .gitignore
│       └── package-scripts.json
├── setup.js
├── package.json
├── .npmignore
└── README.md
```

## Desenvolvimento

Para testar localmente:

```bash
npm link
cd /caminho/para/projeto-wordpress
npx @carmopereira/wp-block-setup
```

## Publicar no npm

```bash
npm login
npm publish --access public
```

## Licença

GPL-2.0-or-later
