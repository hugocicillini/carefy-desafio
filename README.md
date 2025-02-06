# API de Lista de Desejos de Filmes

## Descrição

API desenvolvida para gerenciar uma lista de desejos de filmes, permitindo adicionar, listar, editar, ordenar, e avaliar filmes. O projeto foi desenvolvido como parte de um desafio técnico para a vaga de Desenvolvedor(a) Back-end Jr da Carefy.

## Tecnologias Utilizadas

- **Node.js** com **Express.js**
- **MongoDB** (Banco de Dados NoSQL)
- **Docker** e **Docker Compose**
- **Swagger** para documentação da API
- **TypeScript** para tipagem segura
- **Mongoose** como ORM para MongoDB
- **Autenticação** via Basic Auth

## Instalação e Execução

### 1. Clonar o repositório

```bash
git clone https://github.com/hugocicillini/carefy-desafio.git
cd carefy-desafio
```

### 2. Configurar variáveis de ambiente

Crie um arquivo **.env** na raiz do projeto e defina as variáveis necessárias:

```env
BASIC_AUTH_USER=user
BASIC_AUTH_PASS=123456
MONGO_URI=mongodb://mongo:27017/carefy-desafio
PORT=5000
```

### 3. Rodar com Docker

Se desejar executar o projeto com **Docker**, utilize:

```bash
docker-compose up --build
```

A API estará disponível em `http://localhost:5000`.

### 4. Rodar sem Docker (modo local)

Se preferir rodar sem Docker, siga estes passos:

```env
BASIC_AUTH_USER=user
BASIC_AUTH_PASS=123456
MONGO_URI=mongodb://localhost:27017/carefy-desafio
PORT=5000
```

```bash
npm install # Instala as dependências
npm run dev # Inicia o servidor
```

## Endpoints da API

A documentação completa pode ser acessada via Swagger:

```
http://localhost:5000/api-docs
```

## Autor

Desenvolvido por **Hugo Cicillini**.
