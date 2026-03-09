<h1 align="center">💼 Price Tracker API</h1>
<p align="center">
  <img src="https://img.shields.io/badge/Python-3.13-blue?style=flat-square&logo=python" />
  <img src="https://img.shields.io/badge/Flask-3.1.3-lightgrey?style=flat-square&logo=flask" />
  <img src="https://img.shields.io/badge/FlaskSQLAlchemy-3.1.1-ff6347?style=flat-square" />
  <img src="https://img.shields.io/badge/Pytest-Testes-6c5ce7?style=flat-square" />
</p>

<p align="center">
  A proposta da API é simples e útil: cada usuário pode cadastrar produtos, registrar novos preços ao longo do tempo e consultar métricas que ajudam a entender a evolução desses preços. </p>

Na prática, o projeto resolve quatro problemas centrais:

- autenticar usuários com segurança <br>
- isolar os dados por usuário<br>
- armazenar histórico de preço de cada produto<br>
- transformar histórico bruto em informação útil por meio de estatísticas

## 🧰 Tecnologias Utilizadas

- [Flask](https://flask.palletsprojects.com/) — microframework web em Python
- [Flask-SQLAlchemy](https://flask-sqlalchemy.palletsprojects.com/) — ORM para banco de dados
- [Flask-JWT-Extended](https://flask-jwt-extended.readthedocs.io/) — autenticação com JWT
- [Werkzeug](https://werkzeug.palletsprojects.com/) — utilitários para segurança
- [Pytest](https://docs.pytest.org/) — testes automatizados
- [Alembic](https://alembic.sqlalchemy.org/en/latest/tutorial.html) - migração de banco de dados para Python
- [Flask_Migrate](https://flask-migrate.readthedocs.io/en/latest/) - extensão para aplicações Flask que gerencia migrações de banco de dados SQLAlchemy usando a ferramenta Alembic
- [python-dotenv](https://pypi.org/project/python-dotenv/) - carrega variáveis de ambiente de um arquivo .env para sua aplicação
- [Gunicorn](https://gunicorn.org/) - servidor web WSGI Python projetado para rodar aplicações web em produção
- [psycopg2-binary](https://www.psycopg.org/docs/install.html)- adaptador de banco de dados PostgreSQL para Python

---

## Como rodar o projeto com Docker 🐳
### 1. Clone o repositório
```bash 
git clone <URL_DO_REPOSITORIO>
cd Price-tracker-API
```

### 2. Crie o arquivo .env

Use o arquivo de exemplo como base:

```bash  
cp .env.example .env
```

### 3. Suba os containers
```bash
docker compose up --build
```

#### A API ficará disponível em:
```bash
http://localhost:5000
```
#### Observação 
O container da aplicação executa as migrations automaticamente antes de subir o servidor.

---

## Como rodar localmente sem Docker
Se você quiser rodar a API sem Docker, siga estes passos:

### 1. Clone o repositório
```bash
git clone <URL_DO_REPOSITORIO>
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

### 4. Crie o arquivo .env
Use o arquivo de exemplo como base:
```bash
cp .env.example .env
```
Depois, ajuste a variável DATABASE_URL para apontar para o seu sqlite local.
Exemplo:
```bash
DATABASE_URL=sqlite:///local.db
SECRET_KEY=sua_secret_key
JWT_SECRET_KEY=sua_jwt_secret_key
```

### 5. Rode as migrations
```bash
flask --app run.py db upgrade
```

### 6. Inicie a aplicação
```bash
python run.py
```
#### A API ficará disponível em:
```bash
http://localhost:5000
```

## Funcionalidades da API

A API foi pensada para ser simples de entender, mas sólida na prática.  
Ela permite que cada usuário gerencie seus próprios produtos e acompanhe a variação de preços ao longo do tempo.

### Autenticação 🔐
- cadastro de usuário
- login com geração de token JWT
- acesso protegido a rotas autenticadas
- isolamento total dos dados por usuário

### Produtos 🛒
- criação de produtos
- listagem de todos os produtos do usuário autenticado
- busca de produto por id
- atualização de produto
- remoção de produto

### Histórico de preços 🏷️
- registro de novos preços para um produto
- armazenamento do histórico de preço ao longo do tempo
- organização dos registros por produto e por usuário

### Estatísticas 📊📈
- cálculo do preço atual
- média de preços
- menor e maior preço registrado
- percentual de variação
- identificação de melhor preço
- média dos últimos 30 dias
- tendência de preço com base no histórico

---

## Estrutura do projeto

```bash
├── 📁 app
│   ├── 📁 models
│   │   ├── 🐍 price_history_model.py
│   │   ├── 🐍 product_model.py
│   │   └── 🐍 user_model.py
│   ├── 📁 routes
│   │   ├── 📁 auth
│   │   │   ├── 🐍 __init__.py
│   │   │   ├── 🐍 auth_routes.py
│   │   │   └── 🐍 auth_validators.py
│   │   ├── 📁 price
│   │   │   ├── 🐍 __init__.py
│   │   │   ├── 🐍 price_routes.py
│   │   │   └── 🐍 price_validators.py
│   │   └── 📁 product
│   │       ├── 🐍 __init__.py
│   │       ├── 🐍 product_routes.py
│   │       └── 🐍 product_validators.py
│   ├── 📁 services
│   │   ├── 🐍 price_service.py
│   │   ├── 🐍 price_stats.py
│   │   ├── 🐍 product_service.py
│   │   └── 🐍 user_service.py
│   ├── 📁 utils
│   │   └── 🐍 validators.py
│   ├── 🐍 __init__.py
│   ├── 🐍 db.py
│   └── 🐍 exceptions.py
├── 📁 migrations
│   ├── 📁 versions
│   │   └── 🐍 d4556cfd4d31_initial.py
│   ├── 📄 README
│   ├── ⚙️ alembic.ini
│   ├── 🐍 env.py
│   └── 📄 script.py.mako
├── 📁 tests
│   ├── 🐍 conftest.py
│   ├── 🐍 test_auth.py
│   └── 🐍 test_product.py
├── ⚙️ .dockerignore
├── ⚙️ .env.example
├── ⚙️ .gitattributes
├── ⚙️ .gitignore
├── 🐳 Dockerfile
├── 📄 LICENSE
├── 📝 README.md
├── 📄 dev-requirements.txt
├── ⚙️ docker-compose.yml
├── ⚙️ pytest.ini
├── 📄 requirements.txt
└── 🐍 run.py
```

A estrutura foi organizada para separar responsabilidades de forma clara:

- **routes/** → define os endpoints da aplicação  
- **services/** → concentra as regras de negócio  
- **models/** → representa as entidades do banco de dados  
- **tests/** → cobre os comportamentos esperados da API  
- **migrations/** → versiona as alterações do banco de dados  

---

## Endpoints principais

Os endpoints de products e prices usam `/api/v1`, enquanto auth usa `/api/v1/auth`.

### Auth 🔐

- `POST /api/v1/auth/register` → cria um novo usuário  
- `POST /api/v1/auth/login` → autentica o usuário e retorna o token  

### Products 🛒

- `POST /api/v1/products` → cria um novo produto  
- `GET /api/v1/products` → lista os produtos do usuário  
- `GET /api/v1/products/<id>` → retorna um produto específico  
- `PUT /api/v1/products/<id>` → atualiza um produto  
- `DELETE /api/v1/products/<id>` → remove um produto  

### Prices 🏷️/ Stats 📊📈

- `POST /api/v1/products/<id>/prices` → registra um novo preço para o produto
- `GET /api/v1/products/<id>/prices` → lista o histórico de preços do produto
- `GET /api/v1/products/<id>/prices/stats` → retorna estatísticas do histórico de preços  

Também é possível filtrar os campos retornados na rota de estatísticas com o parâmetro `fields`.

Exemplo: <br>
- `GET /api/v1/products/1/prices/stats?fields=current,lowest,price_trend`

---

## Exemplo de fluxo de uso

### 1. Criar conta

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "Victor Augusto",
  "email": "victor@email.com",
  "password": "123456Aa!"
}
```

### 2. Fazer login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "victor@email.com",
  "password": "123456Aa!"
}
```

### 3. Criar um produto

```http
POST /api/v1/products
Authorization: Bearer <seu_token>
Content-Type: application/json

{
  "product": "Teclado Mecânico",
  "price": 299.90
}
```

### 4. Registrar um novo preço

```http
POST /api/v1/products/1/prices
Authorization: Bearer <seu_token>
Content-Type: application/json

{
  "price": 279.90
}
```

### 5. Consultar estatísticas

```http
GET /api/v1/products/1/prices/stats
Authorization: Bearer <seu_token>
```

Exemplo de resposta:

```json
{
  "current": 279.9,
  "average": 289.9,
  "lowest": 279.9,
  "highest": 299.9,
  "variation_percent": -6.67,
  "is_best_price": true,
  "last_30_days_average": 289.9,
  "price_trend": "down"
}
```

---

## Rodando os testes

Os testes automatizados foram criados para validar os principais fluxos da aplicação, incluindo autenticação e operações com produtos.

### Executando os testes

```bash
pytest
```

Se quiser ver mais detalhes da execução:

```bash
pytest -v
```

---

## Variáveis de ambiente

O projeto utiliza variáveis de ambiente para configurações sensíveis e específicas de execução.

Exemplo de `.env`:

```env
DATABASE_URL=sqlite:///local.db
SECRET_KEY=sua_secret_key
JWT_SECRET_KEY=sua_jwt_secret_key
```

No ambiente com Docker, o banco utilizado é o PostgreSQL configurado no `docker-compose.yml`.

---

## Decisões de implementação

Algumas decisões foram tomadas para deixar o projeto mais próximo de um cenário real de back-end:

- uso de **JWT** para autenticação  
- separação entre **rotas**, **regras de negócio** e **modelos**  
- uso de **migrations** para versionamento do banco  
- suporte a execução local e com **Docker**  
- presença de **testes automatizados** para garantir estabilidade  
- organização voltada para legibilidade e manutenção  

---

## Melhorias futuras

Embora o projeto já esteja funcional e bem estruturado, ainda existem melhorias que podem ser adicionadas no futuro, como:

- documentação interativa com Swagger ou Postman  
- pipeline de CI com GitHub Actions  
- paginação na listagem de produtos  
- filtros por período no histórico de preços  
- deploy em ambiente cloud  
- monitoramento e logs mais detalhados  

---

## Objetivo do projeto

Este projeto foi desenvolvido como parte da minha evolução prática em back-end com Python.  
Mais do que apenas construir rotas, a ideia foi treinar conceitos importantes para aplicações reais, como autenticação, separação de responsabilidades, persistência de dados, histórico de alterações e testes.

Ele representa bem a forma como venho estudando: tentando transformar conceitos em projetos funcionais, organizados e cada vez mais próximos de um ambiente profissional.

---

## Licença

Este projeto está sob a [licença MIT](https://github.com/VictorAugustoDella/Price-tracker-API?tab=MIT-1-ov-file).
