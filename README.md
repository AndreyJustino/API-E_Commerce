# E-Commerce API

## 📖 Descrição do Projeto

Esta API foi desenvolvida para servir a aplicação de e-commerce construída com **Node.js**, **Express**, **SQLite**, e **Sequelize**. A API gerencia operações relacionadas a usuários, produtos e carrinhos de compras, incluindo o registro de usuários, autenticação, manipulação de dados de produtos e gerenciamento de carrinhos.

## 🛠️ Tecnologias Utilizadas

- **Node.js**: Plataforma de execução JavaScript no lado do servidor.
- **Express**: Framework web para Node.js.
- **SQLite**: Banco de dados leve utilizado para armazenamento de dados.
- **Sequelize**: ORM para facilitar a comunicação entre a aplicação e o banco de dados.
- **JWT**: Para autenticação e autorização via token.
  
## 🚀 Funcionalidades Principais

### Rotas de Usuários

- `GET /getUser/:email`: Retorna informações do usuário com base no email. (Autenticado)
- `POST /register`: Registra um novo usuário.
- `POST /loginUser`: Realiza o login de um usuário.
- `PUT /updateUser`: Atualiza informações do usuário. (Autenticado)
- `DELETE /deleteUser`: Deleta um usuário. (Autenticado)

### Rotas de Produtos

- `DELETE /deleteProducts`: Deleta um produto. (Autenticado)
- `POST /postProduct`: Cria um novo produto. (Autenticado)
- `GET /getProducts/:nome`: Retorna um produto pelo nome.
- `PUT /putProduct`: Atualiza as informações de um produto. (Autenticado)
- `GET /getAllProducts`: Retorna todos os produtos disponíveis.

### Rotas de Carrinho

- `GET /getCart/:emailComprador`: Retorna os itens do carrinho de um usuário com base no email. (Autenticado)
- `POST /postCart`: Adiciona itens ao carrinho. (Autenticado)
- `DELETE /deleteCart`: Remove itens do carrinho. (Autenticado)

## 🔒 Autenticação e Autorização

Esta API utiliza **JSON Web Tokens (JWT)** para autenticação e autorização. As rotas protegidas requerem um token válido, que deve ser enviado nos headers das requisições sob a chave `Authorization`.

Para gerar um token, o usuário deve fazer login através da rota `/loginUser`, que retorna um token no sucesso da autenticação.

## 🔧 Como Executar o Projeto

### Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/en/)
- [Git](https://git-scm.com)

### Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/AndreyJustino/API-E_Commerce
   ```

2. Acesse o diretório do projeto:

   ```bash
   cd api-e_commerce
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

4. Execute a API:

   ```bash
   node server.js
   ```

5. Acesse a API no navegador ou em um cliente HTTP:

   ```bash
   http://localhost:3000
   ```

## 📂 Estrutura de Pastas
A estrutura de pastas do projeto é organizada da seguinte maneira:

```bash

src/
 ├── controllers/        # Lógica de manipulação de dados para cada rota
 ├── models/             # Definições dos modelos do banco de dados (Sequelize)
 ├── routes/             # Definição das rotas da API
 ├── middlewares/        # Funções intermediárias (e.g., verificação de token)
 ├── database/           # Configuração do banco de dados e Sequelize
 └── app.js              # Arquivo principal da aplicação
```

## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env

`PORT_API`

`SECRET`

## Demonstração

[End-Point](https://api-e-commerce-m17f.onrender.com)
