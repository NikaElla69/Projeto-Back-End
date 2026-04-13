# ReserveAí Back-end

O **ReserveAí Back-end** é uma API RESTful desenvolvida em **Node.js**, **TypeScript**, **Express** e **MySQL** para dar suporte a uma plataforma de reservas de mesas em restaurantes. O projeto foi estruturado em padrão **MVC**, contempla autenticação com **JWT**, operações completas de CRUD para as entidades centrais do domínio e uma suíte inicial de testes unitários e de integração com **Jest**.

A aplicação foi organizada para atender ao cenário acadêmico do sistema **ReserveAí**, cobrindo o fluxo de cadastro de usuários, gerenciamento de restaurantes e mesas, consulta de disponibilidade e criação de reservas com controle de status.

## Objetivo do projeto

A API foi construída para centralizar as regras de negócio da plataforma, permitindo que clientes consultem disponibilidade e solicitem reservas, enquanto administradores e proprietários de restaurantes possam gerenciar estabelecimentos, mesas e aprovações de reservas. A solução também fornece uma base sólida para evolução futura, com separação clara de responsabilidades entre rotas, controladores, modelos e middlewares.

## Tecnologias utilizadas

| Camada | Tecnologia | Finalidade |
| --- | --- | --- |
| Linguagem | TypeScript | Tipagem estática e melhor manutenção do código |
| Runtime | Node.js | Execução da API no servidor |
| Framework HTTP | Express | Definição de rotas, middlewares e respostas da API |
| Banco de dados | MySQL | Persistência de usuários, restaurantes, mesas e reservas |
| Autenticação | JSON Web Token (JWT) | Proteção de rotas autenticadas |
| Segurança de senha | bcryptjs | Geração e comparação de hashes de senha |
| Testes | Jest e Supertest | Testes unitários e de integração da API |
| Ambiente | dotenv | Leitura de variáveis de ambiente |

## Arquitetura da solução

A aplicação segue o padrão **Model-View-Controller**, adaptado ao contexto de uma API REST. As rotas recebem as requisições, os controladores concentram a lógica de entrada e saída HTTP, os modelos encapsulam o acesso ao banco de dados e os middlewares tratam autenticação, autorização e erros.

| Diretório | Responsabilidade |
| --- | --- |
| `src/config` | Configuração de ambiente e conexão com banco de dados |
| `src/controllers` | Regras de entrada e saída HTTP para cada recurso |
| `src/models` | Consultas SQL e operações de persistência |
| `src/routes` | Mapeamento dos endpoints da API |
| `src/middlewares` | Tratamento de autenticação, autorização, erros e fluxos assíncronos |
| `src/types` | Tipagens auxiliares do projeto |
| `src/tests` | Testes unitários e de integração |
| `sql` | Script de criação do banco de dados |

## Estrutura principal do projeto

```text
ReserveAiBackend/
├── sql/
│   └── schema.sql
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   │   └── env.ts
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── tests/
│   │   ├── integration/
│   │   ├── unit/
│   │   └── setup.ts
│   └── types/
├── package.json
├── tsconfig.json
└── README.md
```

## Entidades de domínio

O projeto foi modelado em torno de quatro entidades centrais. A relação entre elas reflete o funcionamento esperado de uma plataforma de reservas gastronômicas.

| Entidade | Descrição |
| --- | --- |
| `users` | Armazena clientes, proprietários e administradores do sistema |
| `restaurants` | Representa os estabelecimentos cadastrados na plataforma |
| `tables` | Registra as mesas de cada restaurante, com capacidade e localização |
| `reservations` | Controla solicitações e confirmações de reserva |

## Regras de negócio contempladas

A implementação cobre as regras essenciais da proposta. Usuários podem ser registrados e autenticados por token. Restaurantes podem ser criados e administrados por perfis com permissão adequada. Mesas são vinculadas a restaurantes específicos e possuem capacidade definida. Reservas armazenam data, horário, quantidade de pessoas e observações do cliente. Além disso, há suporte para consulta de disponibilidade por restaurante, com filtragem baseada em data, horário e número de convidados.

Os status de reserva permitem o acompanhamento operacional do atendimento. A estrutura atual também prevê tratamento para cancelamentos, rejeições e histórico de reservas por usuário, o que facilita a expansão da solução em trabalhos futuros.

## Variáveis de ambiente

A aplicação utiliza um arquivo `.env` na raiz do projeto. Caso nenhuma variável seja informada, o sistema utiliza valores padrão definidos em `src/config/env.ts`.

| Variável | Descrição | Valor padrão |
| --- | --- | --- |
| `NODE_ENV` | Ambiente de execução | `development` |
| `PORT` | Porta da API | `3000` |
| `DB_HOST` | Host do MySQL | `localhost` |
| `DB_PORT` | Porta do MySQL | `3306` |
| `DB_USER` | Usuário do banco | `root` |
| `DB_PASSWORD` | Senha do banco | vazio |
| `DB_NAME` | Nome do banco | `reserveai_db` |
| `JWT_SECRET` | Chave secreta do token | `reserveai-secret` |
| `JWT_EXPIRES_IN` | Duração do token | `1d` |

Um exemplo de configuração pode ser usado como base:

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=reserveai_db
JWT_SECRET=reserveai-secret
JWT_EXPIRES_IN=1d
```

## Instalação e execução

Para executar o projeto localmente, recomenda-se primeiro criar o banco de dados MySQL e aplicar o script `sql/schema.sql`. Em seguida, basta instalar as dependências, configurar o arquivo `.env` e iniciar a aplicação em modo de desenvolvimento.

| Etapa | Comando |
| --- | --- |
| Instalar dependências | `npm install` |
| Executar em desenvolvimento | `npm run dev` |
| Gerar build de produção | `npm run build` |
| Iniciar versão compilada | `npm start` |
| Rodar testes | `npm test` |
| Rodar testes com cobertura | `npm run test:coverage` |

## Script SQL

O arquivo `sql/schema.sql` contém a criação das tabelas principais do sistema. Ele deve ser executado antes do primeiro uso da API. Recomenda-se criar previamente um banco chamado `reserveai_db` ou ajustar o nome para corresponder ao valor configurado na variável `DB_NAME`.

## Autenticação e autorização

A autenticação utiliza **JWT** no cabeçalho `Authorization`, no formato `Bearer <token>`. Após o login, o cliente recebe um token que deve ser enviado nas rotas protegidas. O sistema também diferencia perfis por papel de acesso, permitindo restringir operações administrativas a usuários do tipo `owner` e `admin`.

## Endpoints disponíveis

A API foi organizada com prefixo `/api`. Os principais recursos disponíveis estão descritos nas tabelas abaixo.

### Autenticação

| Método | Endpoint | Descrição | Proteção |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Cadastra um novo usuário | Pública |
| `POST` | `/api/auth/login` | Autentica usuário e retorna token | Pública |
| `GET` | `/api/auth/me` | Retorna dados do usuário autenticado | Privada |

### Usuários

| Método | Endpoint | Descrição | Proteção |
| --- | --- | --- | --- |
| `GET` | `/api/users` | Lista usuários do sistema | `admin` |
| `GET` | `/api/users/:id` | Busca um usuário por identificador | Privada |
| `PUT` | `/api/users/:id` | Atualiza dados de um usuário | Privada |
| `DELETE` | `/api/users/:id` | Remove um usuário | Privada |
| `GET` | `/api/users/:id/reservations/history` | Retorna o histórico de reservas do usuário | Privada |

### Restaurantes

| Método | Endpoint | Descrição | Proteção |
| --- | --- | --- | --- |
| `GET` | `/api/restaurants` | Lista restaurantes cadastrados | Pública |
| `GET` | `/api/restaurants/:id` | Retorna um restaurante específico | Pública |
| `GET` | `/api/restaurants/:id/availability` | Consulta disponibilidade por data, hora e quantidade de pessoas | Pública |
| `POST` | `/api/restaurants` | Cadastra restaurante | `owner` ou `admin` |
| `PUT` | `/api/restaurants/:id` | Atualiza restaurante | `owner` ou `admin` |
| `DELETE` | `/api/restaurants/:id` | Exclui restaurante | `owner` ou `admin` |

### Mesas

| Método | Endpoint | Descrição | Proteção |
| --- | --- | --- | --- |
| `GET` | `/api/tables/restaurant/:restaurantId` | Lista mesas de um restaurante | Pública |
| `GET` | `/api/tables/:id` | Busca uma mesa por identificador | Pública |
| `POST` | `/api/tables` | Cadastra uma mesa | `owner` ou `admin` |
| `PUT` | `/api/tables/:id` | Atualiza dados da mesa | `owner` ou `admin` |
| `DELETE` | `/api/tables/:id` | Remove uma mesa | `owner` ou `admin` |

### Reservas

| Método | Endpoint | Descrição | Proteção |
| --- | --- | --- | --- |
| `GET` | `/api/reservations` | Lista reservas do contexto autenticado | Privada |
| `GET` | `/api/reservations/:id` | Busca uma reserva específica | Privada |
| `POST` | `/api/reservations` | Cria uma nova reserva | Privada |
| `PUT` | `/api/reservations/:id` | Atualiza dados de uma reserva | Privada |
| `PATCH` | `/api/reservations/:id/status` | Altera o status da reserva | Privada |
| `DELETE` | `/api/reservations/:id` | Remove uma reserva | Privada |

## Exemplo de resposta

A estrutura de resposta segue um padrão JSON simples, com mensagens de confirmação e dados do recurso processado. Abaixo está um exemplo resumido de login bem-sucedido:

```json
{
  "message": "Login successful",
  "data": {
    "token": "jwt-token",
    "user": {
      "id": 1,
      "name": "Camilla Gomes",
      "email": "camilla@reserveai.com",
      "role": "customer",
      "created_at": "2026-04-12T00:00:00.000Z"
    }
  }
}
```

## Tratamento de erros

A aplicação possui middleware global de tratamento de erros e um encapsulador para rotas assíncronas. Com isso, falhas de validação, autenticação, autorização e processamento interno retornam respostas padronizadas, facilitando o consumo da API por clientes web ou mobile.

## Testes implementados

A suíte de testes cobre cenários importantes do domínio e do fluxo HTTP. Foram implementados testes unitários para os modelos de usuário, restaurante, mesa e reserva, além de testes de integração para autenticação e consulta de disponibilidade de restaurante.

| Tipo | Arquivos principais | Objetivo |
| --- | --- | --- |
| Unitário | `src/tests/unit/*.test.ts` | Validar operações isoladas dos modelos |
| Integração | `src/tests/integration/*.test.ts` | Validar comportamento dos endpoints principais |

## Resultado da validação

O projeto foi validado com sucesso por meio da compilação TypeScript e da execução da suíte de testes automatizados. Durante a finalização, a aplicação concluiu o processo de build sem erros e obteve aprovação integral dos testes implementados.

| Verificação | Resultado |
| --- | --- |
| `npm run build` | Sucesso |
| `npm test -- --runInBand` | 6 suítes aprovadas e 7 testes aprovados |

## Possíveis evoluções futuras

A base atual permite expansão com recursos adicionais, como paginação, filtros avançados, upload de imagens para restaurantes, documentação OpenAPI, logs estruturados, auditoria de ações, refresh token, recuperação de senha e integração com notificações por e-mail ou WhatsApp. Essas extensões podem transformar o projeto em uma solução pronta para uso em produção acadêmica ou demonstrações mais robustas.

## Autor

Este projeto foi estruturado e documentado por **Manus AI**.
#   P r o j e t o - B a c k - E n d  
 