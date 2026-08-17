# GhostWolf - Portal de Acesso Seguro

Um sistema web seguro e moderno para gerenciamento de usuários e acesso compartilhado, desenvolvido com Node.js + Express.

## 🚀 Características

- ✅ Autenticação segura com JWT
- ✅ Gerenciamento completo de usuários
- ✅ Interface moderna e responsiva
- ✅ Validação robusta de dados
- ✅ Armazenamento seguro de senhas (bcrypt)
- ✅ API RESTful bem documentada
- ✅ Deploy pronto para Netlify

## 📋 Pré-requisitos

- Node.js 14+
- npm ou yarn

## 🔧 Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/ghostwolf.git
cd ghostwolf
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. **Inicie o servidor:**
```bash
npm start
```

O servidor rodará em `http://localhost:8080`

## 📚 Uso

### Credenciais Padrão
- **Matrícula:** `adm`
- **Senha:** (configure em `.env`)

### API Endpoints

#### Autenticação
- `POST /api/login` - Faz login e retorna token JWT
  ```json
  {
    "matricula": "usuario.nome",
    "senha": "senha123"
  }
  ```

#### Gerenciamento de Usuários (requer token)
- `GET /api/users` - Lista todos os usuários
- `POST /api/users` - Cria novo usuário
- `PUT /api/users/:matricula` - Atualiza usuário
- `DELETE /api/users/:matricula` - Deleta usuário

#### Saúde
- `GET /api/health` - Verifica status do servidor

## 🔐 Segurança

- Senhas são criptografadas com **bcrypt**
- Autenticação via **JWT (JSON Web Tokens)**
- Validação rigorosa de entrada
- Proteção contra CSRF
- Rate limiting ativado

## 📁 Estrutura do Projeto

```
ghostwolf/
├── server.js              # Backend Express
├── index.html            # Página principal
├── login.html            # Página de login
├── Central_TI_DPSP_v1.4_portal.html  # Portal principal
├── 404.html              # Página de erro
├── public/               # Assets estáticos
│   ├── css/
│   ├── js/
│   └── img/
├── data/                 # Dados (não enviar para git)
│   └── users.json
├── package.json          # Dependências
├── .env.example          # Configuração exemplo
└── .gitignore           # Arquivos ignorados

```

## 🚀 Deploy

### Netlify
Este projeto está configurado para deploy no Netlify:

```bash
npm run build
netlify deploy
```

### Heroku
```bash
git push heroku main
```

## 📝 Scripts Disponíveis

```bash
npm start          # Inicia o servidor de produção
npm run dev        # Inicia com nodemon (desenvolvimento)
npm run lint       # Verifica código com ESLint
npm test           # Executa testes
```

## 🐛 Reportar Bugs

Encontrou um problema? Abra uma [issue](https://github.com/seu-usuario/ghostwolf/issues)

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes

## 👨‍💻 Autor

Desenvolvido com ❤️ para segurança e usabilidade.
