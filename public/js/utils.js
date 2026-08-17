/**
 * Utilitários gerais da aplicação
 */

const Utils = (() => {
  /**
   * Realiza requisição fetch com tratamento de erro
   */
  async function fetchApi(url, options = {}) {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Erro: ${response.status}`);
      }

      return { ok: true, data };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  /**
   * Formata data para formato legível
   */
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Mostra notificação
   */
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  /**
   * Valida email
   */
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  /**
   * Sanitiza entrada HTML
   */
  function sanitize(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  return {
    fetchApi,
    formatDate,
    showNotification,
    isValidEmail,
    sanitize
  };
})();
