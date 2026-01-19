# Instruções para Publicar no npm

Este documento explica como publicar este repositório como pacote npm para usar como addon em projetos de blocos WordPress.

## 📋 Pré-requisitos

1. **Conta no npm**: Cria uma conta em [npmjs.com](https://www.npmjs.com/signup)
2. **Node.js**: Versão 14.0.0 ou superior
3. **Git**: Repositório configurado e sincronizado com GitHub

## 🔧 Configuração Inicial

### 1. Verificar o package.json

O `package.json` já está configurado com:
- Nome do pacote: `@carmopereira/wp-block-setup`
- Versão: `1.0.0`
- Binário: `carmo-wp-block-setup`
- Ficheiros incluídos: `setup.js` e `setups/`

### 2. Fazer login no npm

```bash
npm login
```

Introduz as tuas credenciais:
- Username
- Password
- Email
- OTP (se tiveres 2FA ativado)

### 3. Verificar que estás logado

```bash
npm whoami
```

Deve mostrar o teu username do npm.

## 📦 Publicar no npm

### Opção 1: Publicação Normal

```bash
npm publish --access public
```

> **Nota**: O `--access public` é necessário porque o pacote usa um scope (`@carmopereira/`). Scoped packages são privados por padrão.

### Opção 2: Publicação com Verificação

Antes de publicar, podes verificar o que será incluído:

```bash
# Ver o que será publicado
npm pack --dry-run

# Criar um tarball local para testar
npm pack
```

Isto cria um ficheiro `.tgz` que podes inspecionar.

## 🔄 Atualizar Versão

Quando fizeres alterações e quiseres publicar uma nova versão:

### Método 1: Atualizar manualmente

1. Edita o `package.json` e incrementa a versão:
   - Patch: `1.0.0` → `1.0.1` (correções)
   - Minor: `1.0.0` → `1.1.0` (novas funcionalidades)
   - Major: `1.0.0` → `2.0.0` (mudanças incompatíveis)

2. Publica:
```bash
npm publish --access public
```

### Método 2: Usar npm version (recomendado)

```bash
# Patch version (1.0.0 → 1.0.1)
npm version patch

# Minor version (1.0.0 → 1.1.0)
npm version minor

# Major version (1.0.0 → 2.0.0)
npm version major
```

Isto automaticamente:
- Atualiza o `package.json`
- Cria um commit git com a tag
- Podes depois fazer `npm publish --access public`

## ✅ Verificar Publicação

Após publicar, verifica se está disponível:

1. **No navegador**: https://www.npmjs.com/package/@carmopereira/wp-block-setup
2. **Via CLI**:
```bash
npm view @carmopereira/wp-block-setup
```

## 🚀 Usar o Pacote Publicado

Depois de publicado, outros desenvolvedores podem usar:

### Instalação Global

```bash
npm install -g @carmopereira/wp-block-setup
```

Depois usar:
```bash
carmo-wp-block-setup
```

### Usar com npx (sem instalar)

```bash
npx @carmopereira/wp-block-setup
```

### Instalação Local no Projeto

```bash
npm install --save-dev @carmopereira/wp-block-setup
```

Depois adicionar ao `package.json` do projeto:
```json
{
  "scripts": {
    "setup": "carmo-wp-block-setup"
  }
}
```

## 🧪 Testar Localmente Antes de Publicar

### Usar npm link

1. No diretório deste projeto:
```bash
npm link
```

2. Noutro projeto onde queres testar:
```bash
npm link @carmopereira/wp-block-setup
```

3. Testar:
```bash
npx @carmopereira/wp-block-setup
```

4. Quando terminares, desfazer o link:
```bash
npm unlink @carmopereira/wp-block-setup
```

## 📝 Checklist Antes de Publicar

- [ ] Versão atualizada no `package.json`
- [ ] README.md atualizado e completo
- [ ] Código testado localmente
- [ ] `.npmignore` configurado corretamente
- [ ] Ficheiros desnecessários não incluídos
- [ ] Login no npm feito (`npm whoami`)
- [ ] Repositório Git sincronizado

## 🔍 Estrutura do Pacote Publicado

Quando publicado, o npm incluirá apenas:
- `setup.js` (ficheiro principal)
- `setups/` (diretório com os setups)
- `package.json` (metadados)

Ficheiros excluídos (via `.npmignore`):
- `README.md` (mas o npm mostra o README do repositório)
- `.git/`
- Ficheiros de desenvolvimento

## ⚠️ Problemas Comuns

### Erro: "You do not have permission to publish"

- Verifica que estás logado: `npm whoami`
- Verifica que o nome do pacote está correto
- Se o pacote já existe, só o dono pode publicar atualizações

### Erro: "Package name too similar to existing package"

- O nome `@carmopereira/wp-block-setup` já está reservado para ti
- Se quiseres mudar, edita o `package.json` antes de publicar

### Erro: "You cannot publish over the previously published versions"

- A versão já existe no npm
- Incrementa a versão no `package.json`

## 📚 Recursos Adicionais

- [Documentação oficial do npm](https://docs.npmjs.com/)
- [Guia de publicação de pacotes](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)
