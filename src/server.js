const express = require('express');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV || 'development';
const rootDir = path.join(__dirname, '..');
const viewsDir = path.join(rootDir, 'views');
const publicDir = path.join(rootDir, 'public');
const dataDir = path.join(rootDir, 'data');
const usersFile = path.join(dataDir, 'users.json');

// ==================== MIDDLEWARE ====================

app.use(express.json({ limit: '1mb' }));
app.use('/public', express.static(publicDir));
app.use('/img', express.static(path.join(rootDir, 'img')));
app.use('/data', express.static(dataDir));

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  res.status(err.status || 500).json({
    message: err.message || 'Erro interno do servidor',
    ...(NODE_ENV === 'development' && { stack: err.stack })
  });
};

// ==================== UTILITIES ====================

/**
 * Valida se uma matrícula está no formato correto
 */
function isValidMatricula(matricula) {
  const str = String(matricula || '').trim();
  return str.length >= 3 && /^[a-z0-9._-]+$/i.test(str);
}

/**
 * Valida se uma senha está forte
 */
function isValidPassword(senha) {
  const str = String(senha || '').trim();
  return str.length >= 6;
}

/**
 * Valida se um nome é válido
 */
function isValidName(nome) {
  const str = String(nome || '').trim();
  return str.length >= 3 && str.length <= 100;
}

/**
 * Valida se iniciais estão corretas
 */
function isValidInitials(iniciais) {
  const str = String(iniciais || '').trim().toUpperCase();
  return /^[A-Z]{2,3}$/.test(str);
}

/**
 * Garante que o diretório de dados existe
 */
function ensureStorage() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(usersFile)) {
    const seed = {
      adm: {
        nome: process.env.ADMIN_NAME || 'Administrador',
        senha: process.env.ADMIN_PASSWORD || 'adm123',
        cargo: 'Administrador',
        iniciais: 'AD',
        isAdmin: true,
        createdAt: new Date().toISOString()
      },
      'arthur.lopes': {
        nome: 'Arthur Lopes',
        senha: '123456',
        cargo: 'Funcionário',
        iniciais: 'AL',
        isAdmin: false,
        createdAt: new Date().toISOString()
      }
    };
    fs.writeFileSync(usersFile, JSON.stringify(seed, null, 2));
  }
}

/**
 * Lê todos os usuários do arquivo
 */
function readUsers() {
  try {
    ensureStorage();
    const raw = fs.readFileSync(usersFile, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Erro ao ler usuários:', error);
    return {};
  }
}

/**
 * Salva usuários no arquivo
 */
function writeUsers(users) {
  try {
    ensureStorage();
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Erro ao salvar usuários:', error);
    throw error;
  }
}

// ==================== ROUTES ====================

/**
 * GET /api/health - Verifica se o servidor está rodando
 */
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    uptime: process.uptime()
  });
});

/**
 * POST /api/login - Autentica um usuário
 * Body: { matricula, senha }
 */
app.post('/api/login', (req, res) => {
  const { matricula, senha } = req.body || {};
  
  // Validação básica
  if (!matricula || !senha) {
    return res.status(400).json({
      message: 'Matrícula e senha são obrigatórias.'
    });
  }

  const key = String(matricula).trim().toLowerCase();
  const users = readUsers();
  const user = users[key];

  // Validação de credenciais
  if (!user || String(user.senha) !== String(senha)) {
    return res.status(401).json({
      message: 'Matrícula ou senha inválida.'
    });
  }

  // Resposta sem enviar senha
  return res.json({
    matricula: key,
    nome: user.nome,
    cargo: user.cargo,
    iniciais: user.iniciais,
    isAdmin: !!user.isAdmin
  });
});

/**
 * GET /api/users - Lista todos os usuários
 */
app.get('/api/users', (req, res) => {
  try {
    const users = readUsers();
    // Remove senhas da resposta
    const safe = {};
    Object.entries(users).forEach(([key, user]) => {
      safe[key] = {
        nome: user.nome,
        cargo: user.cargo,
        iniciais: user.iniciais,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt
      };
    });
    res.json(safe);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários.' });
  }
});

/**
 * POST /api/users - Cria um novo usuário
 * Body: { nome, matricula, senha, cargo, iniciais }
 */
app.post('/api/users', (req, res) => {
  const { nome, matricula, senha, cargo, iniciais } = req.body || {};

  // Validação de entrada
  if (!nome || !matricula || !senha || !cargo || !iniciais) {
    return res.status(400).json({
      message: 'Todos os campos são obrigatórios (nome, matrícula, senha, cargo, iniciais).'
    });
  }

  if (!isValidName(nome)) {
    return res.status(400).json({
      message: 'Nome deve ter entre 3 e 100 caracteres.'
    });
  }

  if (!isValidMatricula(matricula)) {
    return res.status(400).json({
      message: 'Matrícula inválida. Use apenas letras, números, pontos, hífens ou sublinhados.'
    });
  }

  if (!isValidPassword(senha)) {
    return res.status(400).json({
      message: 'Senha deve ter no mínimo 6 caracteres.'
    });
  }

  if (!isValidInitials(iniciais)) {
    return res.status(400).json({
      message: 'Iniciais devem conter 2 ou 3 letras.'
    });
  }

  const key = String(matricula).trim().toLowerCase();
  const users = readUsers();

  // Verifica duplicatas
  if (users[key]) {
    return res.status(409).json({
      message: 'Esta matrícula já está cadastrada.'
    });
  }

  // Cria novo usuário
  users[key] = {
    nome: nome.trim(),
    senha: String(senha).trim(),
    cargo: cargo.trim(),
    iniciais: String(iniciais).toUpperCase().trim(),
    isAdmin: false,
    createdAt: new Date().toISOString()
  };

  try {
    writeUsers(users);
    const { senha: _, ...safeUser } = users[key];
    return res.status(201).json({
      message: 'Usuário criado com sucesso.',
      user: safeUser
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao criar usuário.'
    });
  }
});

/**
 * PUT /api/users/:matricula - Atualiza um usuário
 */
app.put('/api/users/:matricula', (req, res) => {
  const key = String(req.params.matricula || '').trim().toLowerCase();
  const { nome, senha, cargo, iniciais } = req.body || {};

  if (!key) {
    return res.status(400).json({
      message: 'Matrícula é obrigatória.'
    });
  }

  const users = readUsers();

  if (!users[key]) {
    return res.status(404).json({
      message: 'Usuário não encontrado.'
    });
  }

  // Validação de campos se fornecidos
  if (nome && !isValidName(nome)) {
    return res.status(400).json({
      message: 'Nome deve ter entre 3 e 100 caracteres.'
    });
  }

  if (senha && !isValidPassword(senha)) {
    return res.status(400).json({
      message: 'Senha deve ter no mínimo 6 caracteres.'
    });
  }

  if (iniciais && !isValidInitials(iniciais)) {
    return res.status(400).json({
      message: 'Iniciais devem conter 2 ou 3 letras.'
    });
  }

  // Atualiza apenas campos fornecidos
  users[key] = {
    ...users[key],
    ...(nome && { nome: nome.trim() }),
    ...(senha && { senha: String(senha).trim() }),
    ...(cargo && { cargo: cargo.trim() }),
    ...(iniciais && { iniciais: String(iniciais).toUpperCase().trim() }),
    updatedAt: new Date().toISOString()
  };

  try {
    writeUsers(users);
    const { senha: _, ...safeUser } = users[key];
    return res.json({
      message: 'Usuário atualizado com sucesso.',
      user: safeUser
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao atualizar usuário.'
    });
  }
});

/**
 * DELETE /api/users/:matricula - Deleta um usuário
 */
app.delete('/api/users/:matricula', (req, res) => {
  const key = String(req.params.matricula || '').trim().toLowerCase();

  if (!key) {
    return res.status(400).json({
      message: 'Matrícula é obrigatória.'
    });
  }

  // Protege o administrador
  if (key === 'adm') {
    return res.status(403).json({
      message: 'O administrador principal não pode ser excluído.'
    });
  }

  const users = readUsers();

  if (!users[key]) {
    return res.status(404).json({
      message: 'Usuário não encontrado.'
    });
  }

  delete users[key];

  try {
    writeUsers(users);
    return res.json({
      message: 'Usuário excluído com sucesso.'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao excluir usuário.'
    });
  }
});

/**
 * GET / - Redireciona para login
 */
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(viewsDir, 'index.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(viewsDir, 'login.html'));
});

app.get('/portal.html', (req, res) => {
  res.sendFile(path.join(viewsDir, 'portal.html'));
});

app.get('/login', (req, res) => {
  res.redirect('/login.html');
});

/**
 * 404 - Página não encontrada
 */
app.use((req, res) => {
  res.status(404).sendFile(path.join(viewsDir, '404.html'));
});

// Aplica middleware de tratamento de erro
app.use(errorHandler);

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`\n🐺 GhostWolf iniciado`);
  console.log(`📍 Porta: ${PORT}`);
  console.log(`🔧 Modo: ${NODE_ENV}`);
  console.log(`✅ Servidor rodando em http://localhost:${PORT}\n`);
});
