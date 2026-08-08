<h1 align="center">
  ramonmello.com
</h1>


https://github.com/user-attachments/assets/8e7b808c-1a99-4986-9ddc-c286b323c639




---

## Visão Geral

Neste repositório você encontrará meu **site de portfólio pessoal** desenvolvido em Next.js, uma **game engine** em TypeScript baseada na arquitetura ECS (Entity-component-system) e um **minigame** inspirado no clássico Asteroids da Atari, criado com essa mesma engine que ainda está em desenvolvimento.

## Estrutura do Projeto

```
/ (raiz)
├── apps/
│   └── ramonmello.com/    # Site em Next.js
├── packages/
│   └── engine/            # Game Engine 2D em TypeScript (ECS)
├── pnpm-workspace.yaml    # Configuração do workspace PNPM
└── pnpm-lock.yaml         # Lockfile único do projeto
```

> 🗂️ O pacote `packages/engine/` será extraído para um repositório próprio quando atingir maturidade.

## Tecnologias Utilizadas

- Next.js
- Tailwind CSS
- Typescript
- Tina CMS
- WebGL

## Instalação e Desenvolvimento

1. Clone o repositório:
   ```bash
   git clone https://github.com/ramonmello/ramonmello.com.git
   cd ramonmello.com
   ```
2. Instale as dependências:
   ```bash
   pnpm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   pnpm dev
   ```
4. Acesse em `http://localhost:3000`

> Este monorepo usa PNPM como gerenciador de pacotes. Use `pnpm-lock.yaml` como lockfile canônico.

## Como Contribuir

Este é um projeto pessoal, mas **feedback** e **sugestões** são bem-vindas:

- Abra uma **issue** para discutir ideias ou bugs.
- Crie um **Pull Request** para propor alterações.

## Contato

Ramon Mello — [@ramonmello](https://www.linkedin.com/in/ramonmello/) — ramonomello@gmail.com

