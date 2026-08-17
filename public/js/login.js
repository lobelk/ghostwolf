/**
 * Login Module - Gerencia autenticação de usuários
 */

const LoginModule = (() => {
  const form = document.getElementById('loginForm');
  const matriculaInput = document.getElementById('matricula');
  const senhaInput = document.getElementById('password');

  /**
   * Valida inputs básicos
   */
  function validateInputs(matricula, senha) {
    if (!matricula || !senha) {
      showError('Preencha matrícula e senha.');
      return false;
    }
    return true;
  }

  /**
   * Exibe mensagem de erro
   */
  function showError(message) {
    alert(message);
  }

  /**
   * Faz login via API
   */
  async function login(matricula, senha) {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matricula, senha })
      });

      const data = await response.json();

      if (!response.ok) {
        showError(data.message || 'Acesso inválido.');
        senhaInput.value = '';
        senhaInput.focus();
        return false;
      }

      // Armazena dados do usuário
      sessionStorage.setItem('ghostwolf_admin', data.isAdmin ? 'true' : 'false');
      sessionStorage.setItem('ghostwolf_user', JSON.stringify({
        matricula: data.matricula,
        nome: data.nome,
        cargo: data.cargo,
        iniciais: data.iniciais,
        isAdmin: !!data.isAdmin
      }));

      return true;
    } catch (error) {
      showError('Não foi possível conectar ao servidor. Verifique se o sistema está no ar.');
      return false;
    }
  }

  /**
   * Handler do formulário
   */
  function handleSubmit(event) {
    event.preventDefault();

    const matricula = matriculaInput.value.trim().toLowerCase();
    const senha = senhaInput.value.trim();

    if (!validateInputs(matricula, senha)) {
      return;
    }

    login(matricula, senha).then(success => {
      if (success) {
        window.location.href = 'portal.html';
      }
    });
  }

  /**
   * Inicialização
   */
  function init() {
    if (form) {
      form.addEventListener('submit', handleSubmit);
    }
  }

  return {
    init
  };
})();

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  LoginModule.init();
});
