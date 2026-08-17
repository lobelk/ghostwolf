/**
 * Portal Module - Gerencia o portal principal
 */

const PortalModule = (() => {
  /**
   * Verifica autenticação
   */
  function checkAuth() {
    const user = sessionStorage.getItem('ghostwolf_user');
    if (!user) {
      window.location.href = 'login.html';
      return null;
    }
    return JSON.parse(user);
  }

  /**
   * Faz logout
   */
  function logout() {
    sessionStorage.removeItem('ghostwolf_user');
    sessionStorage.removeItem('ghostwolf_admin');
    window.location.href = 'login.html';
  }

  /**
   * Atualiza informações do usuário na tela
   */
  function updateUserInfo(user) {
    // Atualiza avatar com iniciais
    const avatarElements = document.querySelectorAll('.avatar');
    avatarElements.forEach(el => {
      el.textContent = user.iniciais;
    });

    // Atualiza nome e cargo
    const nameElements = document.querySelectorAll('.sidebar-footer .name');
    nameElements.forEach(el => {
      el.textContent = user.nome;
    });

    const roleElements = document.querySelectorAll('.sidebar-footer .role');
    roleElements.forEach(el => {
      el.textContent = user.cargo;
    });
  }

  /**
   * Inicialização
   */
  function init() {
    const user = checkAuth();
    if (user) {
      updateUserInfo(user);

      // Configura botão de logout
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
      }
    }
  }

  return {
    init,
    logout,
    checkAuth,
    updateUserInfo
  };
})();

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  PortalModule.init();
});
