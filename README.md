# 🍽️ ReserveAí Back-end

<p align="center">
  <b>API RESTful para gerenciamento de reservas em restaurantes</b><br/>
  Desenvolvido com Node.js, TypeScript, Express e MySQL
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-green"/>
  <img src="https://img.shields.io/badge/TypeScript-5-blue"/>
  <img src="https://img.shields.io/badge/Express-API-lightgrey"/>
  <img src="https://img.shields.io/badge/MySQL-Database-orange"/>
  <img src="https://img.shields.io/badge/JWT-Auth-red"/>
  <img src="https://img.shields.io/badge/Jest-Tests-yellow"/>
</p>

---

## 📖 Sobre o Projeto

O **ReserveAí Back-end** é uma API que gerencia todo o fluxo de reservas de mesas em restaurantes, permitindo:

* 👤 Cadastro e autenticação de usuários
* 🍽️ Gerenciamento de restaurantes
* 🪑 Controle de mesas
* 📅 Criação e gerenciamento de reservas

---

## 🎯 Objetivo

Fornecer uma base sólida para um sistema completo de reservas, separando responsabilidades em camadas e garantindo segurança, organização e escalabilidade.

---

## 🧱 Arquitetura

```
Client → Routes → Controllers → Models → Database
                      ↓
                  Response
```

📌 Padrão utilizado: **MVC**

---

## 📁 Estrutura do Projeto

```
src/
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── tests/
├── types/
├── app.ts
└── server.ts
```

---

## 🚀 Tecnologias

* Node.js
* TypeScript
* Express
* MySQL
* JWT (autenticação)
* bcryptjs (hash de senha)
* Jest + Supertest (testes)

---

## ⚙️ Configuração

### 📄 Criar arquivo `.env`

```
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=reserveai_db
JWT_SECRET=reserveai-secret
JWT_EXPIRES_IN=1d
```

---

## 🗄️ Banco de Dados (XAMPP + DBeaver)

1. Inicie o MySQL no XAMPP
2. Abra o DBeaver
3. Conecte no banco
4. Execute:

```
sql/schema.sql
```

✔ Isso cria todas as tabelas automaticamente

---

## ▶️ Como Rodar

```bash
# instalar dependências
npm install

# rodar projeto
npm run dev
```

🔗 API disponível em:

```
http://localhost:3000
```

---

## 🔐 Autenticação

Use JWT no header:

```
Authorization: Bearer SEU_TOKEN
```

---

## 📡 Principais Endpoints

### 🔐 Auth

* POST `/api/auth/register`
* POST `/api/auth/login`

### 🍽️ Restaurants

* GET `/api/restaurants`
* POST `/api/restaurants`

### 🪑 Tables

* POST `/api/tables`

### 📅 Reservations

* POST `/api/reservations`

---

## 🧪 Testes

```bash
npm test
```

---

## 📌 Exemplo de Resposta

```json
{
  "message": "Login successful",
  "data": {
    "token": "jwt-token",
    "user": {
      "id": 1,
      "name": "Camilla Gomes"
    }
  }
}
```

---

## ⚠️ Erros Comuns

* ❌ 401 → Token inválido
* ❌ 403 → Sem permissão
* ❌ 500 → Erro no servidor

---

## 📈 Futuras Melhorias

* Upload de imagens
* Notificações
* Swagger (documentação)
* Refresh Token

---

## 👩‍💻 Autora

**Camilla Gomes**
🎓 Projeto de TCC — ReserveAí

---

## ⭐ Contribuição

Se esse projeto te ajudou, deixe uma ⭐ no repositório!
