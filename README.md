# Sistema de Gestão Acadêmica

Sistema web desenvolvido para gerenciamento de informações acadêmicas, permitindo cadastrar, visualizar, editar e excluir alunos, cursos e disciplinas.

O projeto foi desenvolvido com o objetivo de praticar desenvolvimento Full Stack, integração entre frontend e backend, criação de APIs REST e utilização de banco de dados relacional.

##  Funcionalidades

###  Alunos

- Cadastro de alunos
- Listagem de alunos
- Edição de alunos
- Exclusão de alunos
- Associação de aluno a um curso
- Validação de CPF duplicado

###  Cursos

- Cadastro de cursos
- Listagem de cursos
- Edição de cursos
- Exclusão de cursos
- Código único para cada curso
- Modalidade do curso
- Duração em semestres

### Disciplinas

- Cadastro de disciplinas
- Listagem de disciplinas
- Edição de disciplinas
- Exclusão de disciplinas
- Associação da disciplina a um curso
- Controle de carga horária
- Código único para cada disciplina

### Dashboard

O sistema possui um dashboard que apresenta:

- Total de alunos cadastrados
- Total de cursos cadastrados
- Total de disciplinas cadastradas

## Tecnologias utilizadas

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Node.js
- Express
- MySQL2
- CORS
- Dotenv

### Banco de dados

- MySQL

## Estrutura do projeto
```
gestao-academica/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── index.html
│   ├── index.css
│   └── script.js
│
├── database.sql
├── .env.example
├── .gitignore
└── README.md
```

## Banco de dados

O projeto utiliza o banco de dados MySQL.

As principais tabelas são:

- `alunos`
- `cursos`
- `disciplinas`

Os alunos podem ser associados a cursos através de uma chave estrangeira.

As disciplinas também são relacionadas aos cursos através de uma chave estrangeira.

O arquivo `database.sql` contém a estrutura necessária para criação do banco de dados.

## Como executar o projeto

### 1. Clone o repositório

```bash
git clone URL_DO_REPOSITORIO
```

Depois entre na pasta:

```bash
cd gestao-academica
```

### 2. Configure o banco de dados

Abra o MySQL Workbench e execute o arquivo:

```text
database.sql
```

Isso criará o banco:

```text
gestao_academica
```

e as tabelas necessárias.

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` dentro da pasta `backend`.

Utilize o `.env.example` como referência:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=gestao_academica
```

Cada usuário deve utilizar suas próprias credenciais do MySQL.

### 4. Instale as dependências

Entre na pasta do backend:

```bash
cd backend
```

Execute:

```bash
npm install
```

### 5. Inicie o servidor

```bash
node server.js
```

O backend será iniciado em:

```text
http://127.0.0.1:3000
```

### 6. Execute o frontend

Abra a pasta `frontend` no VS Code.

Abra o arquivo `index.html` utilizando o Live Server.

O sistema estará pronto para uso.

## 🔗 Principais rotas da API

### Alunos

```text
GET    /alunos
GET    /alunos/:id
POST   /alunos
PUT    /alunos/:id
DELETE /alunos/:id
```

### Cursos

```text
GET    /cursos
GET    /cursos/:id
POST   /cursos
PUT    /cursos/:id
DELETE /cursos/:id
```

### Disciplinas

```text
GET    /disciplinas
GET    /disciplinas/:id
POST   /disciplinas
PUT    /disciplinas/:id
DELETE /disciplinas/:id
```

### Dashboard

```text
GET /dashboard
```

## Segurança

As credenciais do banco de dados são armazenadas no arquivo `.env`.

Esse arquivo não deve ser enviado ao GitHub e está protegido através do `.gitignore`.

O arquivo `.env.example` mostra quais variáveis precisam ser configuradas sem expor senhas ou informações privadas.

## Objetivo do projeto

Este projeto foi desenvolvido como parte do meu portfólio profissional, com foco na aplicação prática de conceitos de desenvolvimento de software.

Durante o desenvolvimento foram utilizados conceitos como:

- CRUD
- API REST
- Integração entre frontend e backend
- Banco de dados relacional
- Chaves estrangeiras
- Variáveis de ambiente
- Validação de dados
- Organização de projeto Full Stack

##  Autor

Vinicius Cunha

Formado em Análise e Desenvolvimento de Sistemas pela Facens e estudante de pós-graduação em Arquitetura de Software.