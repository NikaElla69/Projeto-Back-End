# ReserveAí Front-end

O **ReserveAí Front-end** é a interface web do sistema de reservas de restaurantes construída em **React + TypeScript**, com navegação em **React Router**, consumo da API por **Axios** e estilização com **Tailwind CSS** e componentes reutilizáveis. O projeto foi desenhado para funcionar em conjunto com o back-end já desenvolvido para autenticação, listagem de restaurantes, consulta de mesas e gerenciamento de reservas.

## Visão geral da aplicação

A experiência foi organizada para cobrir o fluxo principal do usuário: **cadastro**, **login**, **exploração de restaurantes**, **consulta de mesas disponíveis**, **criação de reservas**, **listagem das reservas pessoais** e **cancelamento**. O token JWT retornado pela API é armazenado localmente e enviado automaticamente no cabeçalho `Authorization` nas rotas protegidas.

| Camada | Responsabilidade |
| --- | --- |
| `pages/` | Telas do fluxo principal, como login, cadastro, home, detalhes do restaurante e reservas |
| `components/` | Blocos reutilizáveis de interface, layout, feedback visual e cartões de dados |
| `services/` | Comunicação com a API usando Axios e organização das operações por domínio |
| `routes/` | Definição das rotas públicas e privadas da aplicação |
| `styles/` | Tokens e decisões visuais auxiliares do projeto |
| `contexts/` | Estado global, especialmente autenticação do usuário |

## Tecnologias utilizadas

O projeto utiliza **React 19**, **TypeScript**, **Vite**, **Axios**, **React Router DOM**, **Tailwind CSS 4**, **Framer Motion**, **shadcn/ui** e **Sonner** para notificações.

## Requisitos

Antes de iniciar o front-end, deixe preparado o ambiente abaixo.

| Requisito | Versão sugerida |
| --- | --- |
| Node.js | 20 ou superior |
| pnpm | 10 ou superior |
| Back-end ReserveAí | Rodando localmente |
| Navegador | Chrome, Edge ou Firefox atual |

## Como instalar as dependências

No terminal, entre na pasta do projeto e execute a instalação das dependências.

```bash
cd reserveai-frontend
pnpm install
```

O comando `pnpm install` lê o `package.json`, baixa as bibliotecas necessárias e cria a pasta `node_modules`.

## Como configurar a URL da API

O front-end lê a URL do back-end pela variável **`VITE_API_BASE_URL`**. Essa variável deve apontar para a API com o prefixo `/api`.

> Exemplo recomendado para ambiente local: `http://localhost:3000/api`

Como o ambiente de desenvolvimento pode variar entre máquina local, prévia e demonstração, a forma mais simples é criar um arquivo `.env` na raiz do projeto com o conteúdo abaixo:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Se você estiver executando o back-end em outra porta ou em outro host, basta substituir o valor.

| Cenário | Valor sugerido para `VITE_API_BASE_URL` |
| --- | --- |
| Back-end local padrão | `http://localhost:3000/api` |
| Back-end local em outra porta | `http://localhost:4000/api` |
| Back-end publicado | `https://seu-backend/api` |

## Como rodar o projeto

Depois de instalar as dependências e configurar a URL da API, execute:

```bash
pnpm run dev
```

Esse comando inicia o servidor de desenvolvimento do Vite. Neste projeto, a porta padrão configurada é **5173**.

Se tudo estiver correto, o terminal exibirá um endereço parecido com este:

```bash
Local:   http://localhost:5173/
```

## Scripts disponíveis

| Comando | Função |
| --- | --- |
| `pnpm run dev` | Inicia o front-end em desenvolvimento |
| `pnpm run check` | Executa a checagem de tipos TypeScript |
| `pnpm run build` | Gera a versão de produção |
| `pnpm run preview` | Abre a prévia da build gerada |
| `pnpm run format` | Formata os arquivos do projeto |

## Como conectar com o back-end

O front-end foi preparado para consumir as rotas do projeto **ReserveAí Back-end**. A comunicação acontece por serviços organizados em `client/src/services/`, e o arquivo central `client/src/services/api.ts` faz três papéis principais: define a URL base da API, anexa automaticamente o token JWT ao cabeçalho `Authorization` e transforma falhas de rede em mensagens mais legíveis.

### Fluxo de autenticação

1. O usuário acessa a tela de cadastro ou login.
2. O front-end envia a requisição para a API.
3. Ao autenticar com sucesso, o token JWT é salvo no navegador.
4. As páginas privadas passam a ser acessíveis.
5. As próximas requisições protegidas enviam o token automaticamente.

## Rotas principais da interface

| Rota | Objetivo | Proteção |
| --- | --- | --- |
| `/` | Home com listagem de restaurantes | Pública |
| `/login` | Entrada do usuário | Pública |
| `/register` | Cadastro de usuário | Pública |
| `/restaurants/:id` | Detalhes do restaurante e mesas | Pública |
| `/reservations/new` | Criação de reserva | Privada |
| `/reservations` | Listagem das reservas do usuário | Privada |

## Estrutura principal do projeto

```text
reserveai-frontend/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
├── ideas.md
├── package.json
└── vite.config.ts
```

## Como testar o fluxo completo

Para validar se o sistema está funcionando corretamente com o back-end, siga a sequência abaixo.

### 1. Inicie o back-end

Suba o projeto da API ReserveAí e confirme que ele está funcionando na porta configurada, por exemplo `http://localhost:3000/api`.

### 2. Inicie o front-end

```bash
pnpm run dev
```

Abra `http://localhost:5173` no navegador.

### 3. Crie um usuário

Acesse a rota de cadastro e preencha os dados solicitados. Após o sucesso, o sistema deverá permitir a autenticação ou redirecionar para o próximo passo previsto pela interface.

### 4. Faça login

Entre com as credenciais cadastradas. Se a API responder corretamente, o token será armazenado localmente e as rotas privadas ficarão disponíveis.

### 5. Navegue pela home

A tela inicial deve exibir os restaurantes retornados pela API. Se não houver API configurada, o sistema mostrará a mensagem orientando a definição de `VITE_API_BASE_URL`.

### 6. Acesse um restaurante

Abra a página de detalhes de um restaurante para visualizar as informações principais e as mesas disponíveis.

### 7. Crie uma reserva

Com o usuário autenticado, acesse a tela de nova reserva, informe os dados exigidos e confirme a operação. A resposta bem-sucedida da API deve aparecer como feedback visual na interface.

### 8. Liste as reservas

Entre na página **Minhas reservas** para verificar se a reserva recém-criada aparece corretamente.

### 9. Cancele uma reserva

Use a ação de cancelamento para validar o fluxo de exclusão ou atualização de status conforme a API disponível.

## Tratamento de erros e feedbacks

O projeto já inclui mensagens de erro amigáveis para cenários comuns, como API indisponível, timeout, ausência de URL base configurada e falhas de autenticação. Também há estados visuais de carregamento para reduzir ambiguidades na navegação.

| Situação | Comportamento esperado |
| --- | --- |
| API fora do ar | Exibição de erro de conexão |
| Token ausente em rota privada | Redirecionamento para login |
| URL da API não configurada | Mensagem orientando configurar `VITE_API_BASE_URL` |
| Requisição lenta | Mensagem de timeout amigável |

## Integração local recomendada

A configuração mais direta para desenvolvimento local é a seguinte.

| Serviço | Endereço sugerido |
| --- | --- |
| Back-end ReserveAí | `http://localhost:3000/api` |
| Front-end ReserveAí | `http://localhost:5173` |

## Observações finais

Este front-end foi preparado para ser uma camada de apresentação limpa, responsiva e funcional sobre o back-end do **ReserveAí**. Caso você altere contratos da API, nomes de campos, rotas ou regras de autenticação, revise os arquivos dentro de `client/src/services/`, `client/src/types/` e `client/src/pages/` para manter a integração consistente.
