<h1 align="center">💼 Price Tracker API</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.13-blue?style=flat-square&logo=python" />
  <img src="https://img.shields.io/badge/Flask-3.1.3-lightgrey?style=flat-square&logo=flask" />
  <img src="https://img.shields.io/badge/FlaskSQLAlchemy-3.1.1-ff6347?style=flat-square" />
  <img src="https://img.shields.io/badge/Playwright-Web%20Scraping-2ea44f?style=flat-square&logo=playwright" />
  <img src="https://img.shields.io/badge/Pytest-Testes-6c5ce7?style=flat-square" />
  <img src="https://img.shields.io/badge/GitHub%20Actions-CI-2088FF?style=flat-square&logo=githubactions" />
</p>

<p align="center">
  API RESTful para autenticação de usuários, cadastro de produtos por URL, scraping de preço, histórico de preços e estatísticas de variação ao longo do tempo.
</p>

---

## 📌 Sobre o projeto

A proposta da API é simples e útil: o usuário cadastra um produto com um link válido da **Amazon Brasil** ou do **Mercado Livre**, e a aplicação:

- autentica o usuário com JWT
- isola os dados por usuário
- identifica automaticamente qual scraper usar com base na URL
- coleta o **preço atual** e o **nome real do produto**
- cria o produto já com o **primeiro registro no histórico de preços**
- permite atualizar o preço futuramente sem recriar o produto
- transforma o histórico em estatísticas úteis

Em vez de o usuário informar preço manualmente no cadastro, a API usa **Playwright** para buscar esse valor direto na página do produto.

---

## ✨ Fluxo principal da aplicação

1. o usuário cria conta e faz login
2. envia `product` + `url` para cadastrar um produto
3. a API resolve o scraper correto pela URL
4. o preço e o nome raspado do produto são coletados
5. o produto é salvo no banco
6. o primeiro registro de preço é criado automaticamente em `price_history`
7. quando quiser, o usuário chama o endpoint de **refresh**
8. a API raspa o preço novamente e adiciona um novo registro ao histórico
9. o usuário consulta histórico e estatísticas a qualquer momento

---

## 🧰 Tecnologias utilizadas

- [Flask](https://flask.palletsprojects.com/) - microframework web em Python
- [Flask-SQLAlchemy](https://flask-sqlalchemy.palletsprojects.com/) - ORM para banco de dados
- [SQLAlchemy](https://www.sqlalchemy.org/) - camada de persistência
- [Flask-JWT-Extended](https://flask-jwt-extended.readthedocs.io/) - autenticação com JWT
- [Flask-Migrate](https://flask-migrate.readthedocs.io/) - integração de migrations no Flask
- [Alembic](https://alembic.sqlalchemy.org/) - versionamento de schema do banco
- [Playwright](https://playwright.dev/python/) - scraping dos preços
- [Pytest](https://docs.pytest.org/) - testes automatizados
- [Gunicorn](https://gunicorn.org/) - servidor WSGI para produção
- [python-dotenv](https://pypi.org/project/python-dotenv/) - carregamento de variáveis de ambiente
- [psycopg2-binary](https://www.psycopg.org/) - driver PostgreSQL
- [GitHub Actions](https://github.com/features/actions) - execução de CI

---

## 🛒 Marketplaces suportados

Atualmente, o fluxo automático de scraping funciona para links destes domínios:

- `amazon.com.br`
- `mercadolivre.com.br`

Se a URL não pertencer a um desses domínios, a API retorna erro de validação.

---

## 🔐 Regras importantes da API

- cada usuário enxerga apenas os próprios dados
- o cadastro de produto exige uma URL válida
- o preço inicial é coletado automaticamente no cadastro
- o endpoint de refresh adiciona um novo preço ao histórico
- o mesmo usuário não pode cadastrar a **mesma URL** duas vezes
- as estatísticas podem ser filtradas com o parâmetro `fields`

---

## 🚀 Funcionalidades

### Autenticação
- cadastro de usuário
- login com geração de token JWT
- proteção de rotas autenticadas
- atualização automática de `last_access` em requisições autenticadas

### Produtos
- criação de produtos com scraping automático
- listagem de produtos do usuário autenticado
- busca de produto por ID
- edição do nome do produto
- remoção de produto
- bloqueio de URL duplicada por usuário

### Histórico de preços
- criação automática do primeiro preço no cadastro do produto
- listagem do histórico em ordem decrescente de coleta
- refresh de preço com novo scraping do link já salvo

### Estatísticas
- preço atual
- média
- menor preço
- maior preço
- total de registros
- percentual de variação
- identificação de melhor preço
- média dos últimos 30 dias
- tendência de preço (`up`, `down`, `stable`)
- filtro de campos via query param `fields`

---

## 📡 Endpoints principais

### Auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

### Products
- `GET /api/v1/products`
- `GET /api/v1/products/<id>`
- `POST /api/v1/products`
- `PUT /api/v1/products/<id>`
- `DELETE /api/v1/products/<id>`

### Prices
- `GET /api/v1/products/<id>/prices`
- `GET /api/v1/products/<id>/prices/stats`
- `POST /api/v1/products/<id>/prices/refresh`

---

## 🐳 Como rodar com Docker

### 1. Clone o repositório

```bash
git clone https://github.com/VictorAugustoDella/Price-tracker-API
cd Price-tracker-API
```

### 2. Crie o arquivo `.env`

Use o arquivo de exemplo como base:

```bash
cp .env.example .env
```

### 3. Suba os containers

```bash
docker compose up --build
```

### 4. Acesse a API

```bash
http://localhost:5000
```

### Observação

O container da aplicação executa as migrations automaticamente antes de subir o servidor.

---

## 💻 Como rodar localmente sem Docker

### 1. Clone o repositório

```bash
git clone https://github.com/VictorAugustoDella/Price-tracker-API.git
cd Price-tracker-API
```

### 2. Crie e ative a virtualenv

#### Linux / macOS

```bash
python -m venv .venv
source .venv/bin/activate
```

#### Windows (PowerShell)

```bash
python -m venv .venv
.venv\Scripts\Activate.ps1
```

### 3. Instale as dependências

```bash
pip install -r requirements.txt
pip install -r dev-requirements.txt
```

### 4. Instale o navegador do Playwright

```bash
python -m playwright install chromium
```

### 5. Crie o arquivo `.env`

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Se quiser rodar localmente com SQLite, ajuste o `.env` para algo assim:

```env
DATABASE_URL=sqlite:///local.db
SECRET_KEY=sua_secret_key
JWT_SECRET_KEY=sua_jwt_secret_key
```

### 6. Rode as migrations

```bash
flask --app run.py db upgrade
```

### 7. Inicie a aplicação

```bash
python run.py
```

### 8. Acesse a API

```bash
http://localhost:5000
```

---

## 🔑 Variáveis de ambiente

### Exemplo usado com Docker / PostgreSQL

```env
SECRET_KEY=change-me
JWT_SECRET_KEY=change-me-too
DATABASE_URL=postgresql+psycopg2://project:project@db:5432/project
POSTGRES_USER=project
POSTGRES_PASSWORD=change-me
POSTGRES_DB=project
```

### Exemplo local com SQLite

```env
DATABASE_URL=sqlite:///local.db
SECRET_KEY=sua_secret_key
JWT_SECRET_KEY=sua_jwt_secret_key
```

---

## 🧪 Exemplo de fluxo de uso

### 1. Criar conta

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "Victor Augusto",
  "email": "victor@email.com",
  "password": "123456Aa"
}
```

### Exemplo de resposta

```json
{
  "id": 1,
  "name": "Victor Augusto",
  "email": "victor@email.com",
  "created_at": "2026-03-19T18:00:00.000000",
  "last_access": null
}
```

### 2. Fazer login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "victor@email.com",
  "password": "123456Aa"
}
```

### Exemplo de resposta

```json
{
  "access_token": "seu_token_jwt"
}
```

### 3. Cadastrar um produto

> No cadastro, a API raspa automaticamente o preço atual e o nome do produto com base na URL.

```http
POST /api/v1/products
Authorization: Bearer <seu_token>
Content-Type: application/json

{
  "product": "Monitor Gamer",
  "url": "https://www.amazon.com.br/exemplo-produto"
}
```

### Exemplo de resposta

```json
{
  "id": 1,
  "product": "Monitor Gamer",
  "scraped_name": "Monitor Gamer 27 Polegadas Full HD",
  "site": "amazon",
  "url": "https://www.amazon.com.br/exemplo-produto",
  "added_at": "2026-03-19T18:05:00.000000",
  "last_change": "2026-03-19T18:05:00.000000"
}
```

### 4. Consultar o histórico de preços

```http
GET /api/v1/products/1/prices
Authorization: Bearer <seu_token>
```

### Exemplo de resposta

```json
[
  {
    "id": 1,
    "product_id": 1,
    "price": 1899.9,
    "collected_at": "2026-03-19T18:05:00.000000"
  }
]
```

### 5. Atualizar o preço do produto

> Esse endpoint faz um novo scraping da URL já salva e cria um novo registro no histórico.

```http
POST /api/v1/products/1/prices/refresh
Authorization: Bearer <seu_token>
```

### Exemplo de resposta

```json
{
  "id": 2,
  "product_id": 1,
  "price": 1799.9,
  "collected_at": "2026-03-20T10:15:00.000000"
}
```

### 6. Consultar estatísticas

```http
GET /api/v1/products/1/prices/stats?fields=current,lowest,price_trend
Authorization: Bearer <seu_token>
```

### Exemplo de resposta

```json
{
  "current": 1799.9,
  "lowest": 1799.9,
  "price_trend": "down"
}
```

---

## 📊 Campos disponíveis em `stats`

Você pode pedir todos os campos ou só os que quiser em `fields`.

Campos aceitos:

- `current`
- `average`
- `lowest`
- `highest`
- `total`
- `variation_percent`
- `is_best_price`
- `last_30_days_average`
- `price_trend`

### Exemplo

```http
GET /api/v1/products/1/prices/stats?fields=current,average,lowest
```

---

## ❌ Exemplos de erros comuns

### URL inválida

```json
{
  "error": "Invalid url"
}
```

### Link de marketplace não suportado

```json
{
  "error": "link must be a amazon or mercadolivre link"
}
```

### Produto não encontrado

```json
{
  "error": "product not found"
}
```

### URL já cadastrada pelo mesmo usuário

```json
{
  "error": "you already registered this product link"
}
```

---

## 🧪 Rodando os testes

Os testes automatizados cobrem os principais fluxos da aplicação, incluindo:

- cadastro e login
- autenticação obrigatória nas rotas protegidas
- criação, listagem, busca, edição e remoção de produtos
- histórico de preços
- estatísticas e filtro por `fields`
- isolamento de dados entre usuários

### Executar testes

```bash
pytest
```

### Executar com mais detalhes

```bash
pytest -v
```

### Observação

O projeto também possui **CI com GitHub Actions**, executando os testes em pushes para a branch `main` e manualmente via `workflow_dispatch`.

---

## 🗂️ Estrutura do projeto

```bash
├── .github
│   └── workflows
│       └── ci.yml
├── app
│   ├── models
│   │   ├── price_history_model.py
│   │   ├── product_model.py
│   │   └── user_model.py
│   ├── routes
│   │   ├── auth
│   │   │   ├── __init__.py
│   │   │   └── auth_routes.py
│   │   ├── price
│   │   │   ├── __init__.py
│   │   │   └── price_routes.py
│   │   └── product
│   │       ├── __init__.py
│   │       └── product_routes.py
│   ├── services
│   │   ├── scrapers
│   │   │   ├── amazon_playwright.py
│   │   │   ├── mercado_livre_playwright.py
│   │   │   └── scraper_resolver.py
│   │   ├── price_service.py
│   │   ├── price_stats.py
│   │   ├── product_service.py
│   │   └── user_service.py
│   ├── utils
│   │   └── field_validators.py
│   ├── validators
│   │   ├── auth_validators.py
│   │   ├── price_validators.py
│   │   └── product_validators.py
│   ├── __init__.py
│   ├── db.py
│   └── exceptions.py
├── migrations
│   ├── versions
│   │   └── *.py
│   ├── README
│   ├── alembic.ini
│   ├── env.py
│   └── script.py.mako
├── tests
│   ├── conftest.py
│   ├── test_auth.py
│   ├── test_price.py
│   └── test_product.py
├── .dockerignore
├── .env.example
├── .gitattributes
├── .gitignore
├── Dockerfile
├── LICENSE
├── README.md
├── dev-requirements.txt
├── docker-compose.yml
├── pytest.ini
├── requirements.txt
└── run.py
```

---

## 🧱 Organização por camadas

- **routes/** → define os endpoints da API
- **services/** → concentra as regras de negócio
- **validators/** → valida entradas e regras de formato
- **models/** → representa as entidades persistidas no banco
- **utils/** → funções auxiliares reutilizáveis
- **migrations/** → versiona mudanças no banco
- **tests/** → valida os principais comportamentos da aplicação

---

## 🧠 Decisões de implementação

Algumas decisões deixam o projeto mais próximo de um cenário real de back-end:

- uso de **JWT** para autenticação
- separação clara entre **rotas**, **serviços**, **validações** e **modelos**
- uso de **migrations** para evoluir o schema do banco
- scraping isolado em uma camada própria de **services/scrapers**
- escolha do scraper com base no **hostname da URL**
- criação automática do primeiro preço ao cadastrar um produto
- endpoint específico para **refresh** de preço
- proteção contra **URL duplicada por usuário**
- suporte a execução local e com **Docker**
- **CI com GitHub Actions**
- **testes automatizados** para manter estabilidade

---

## 🔮 Melhorias futuras

Algumas evoluções que ainda podem ser adicionadas:

- documentação interativa com Swagger ou Postman
- paginação na listagem de produtos
- mocks mais robustos para scraping nos testes
- filtros por período no histórico
- agendamento automático de refresh de preço
- alertas de queda de preço
- deploy em ambiente cloud
- logs e monitoramento mais detalhados

---

## 🎯 Objetivo do projeto

Este projeto foi desenvolvido como parte da minha evolução prática em back-end com Python.

Mais do que apenas criar rotas, a ideia foi treinar conceitos importantes de aplicações reais, como:

- autenticação
- separação de responsabilidades
- persistência de dados
- histórico de alterações
- scraping controlado
- versionamento de banco
- testes automatizados
- execução com Docker
- pipeline básica de CI

Ele representa bem a forma como venho estudando: transformando conceitos em projetos funcionais, organizados e cada vez mais próximos de um ambiente profissional.

---

## 📄 Licença

Este projeto está sob a [licença MIT](./LICENSE).