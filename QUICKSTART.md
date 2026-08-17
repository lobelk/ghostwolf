# Início Rápido

## Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/ghostwolf.git
cd ghostwolf

# 2. Instale as dependências
npm install

# 3. Configure o ambiente
cp .env.example .env
# Edite .env conforme necessário
```

## Executar

### Desenvolvimento
```bash
npm run dev
# Servidor rodando em http://localhost:8080
# Com nodemon para auto-reload
```

### Produção
```bash
npm start
# Servidor rodando em http://localhost:8080
```

## Autenticação

### Credenciais Padrão
- **Matrícula:** `adm`
- **Senha:** (configurada em `.env`)

## Estrutura

```
src/          → Servidor backend
public/       → CSS, JS, Imagens
views/        → Páginas HTML
data/         → Banco de dados (JSON)
docs/         → Documentação
```

## API Endpoints

### Login
```
POST /api/login
{
  "matricula": "usuario.nome",
  "senha": "senha123"
}
```

### Usuários
```
GET  /api/users              # Lista todos
POST /api/users              # Criar novo
PUT  /api/users/:matricula   # Atualizar
DELETE /api/users/:matricula # Deletar
```

## Variáveis de Ambiente

Crie um arquivo `.env`:
```
PORT=8080
NODE_ENV=development
ADMIN_MATRICULA=adm
ADMIN_PASSWORD=adm123
ADMIN_NAME=Administrador
JWT_SECRET=sua-chave-secreta
```

## Próximos Passos

1. 📖 Leia [`docs/README.md`](docs/README.md) para documentação completa
2. 🤝 Veja [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) para contribuir
3. 🔒 Implemente testes automatizados
4. 🔐 Use bcrypt para hashing de senhas em produção
5. 📊 Adicione logging e monitoramento

---

**Documentação:** [docs/README.md](docs/README.md)  
**Suporte:** Abra uma issue no GitHub
