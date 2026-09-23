/* =========================================================
   RETROBOX V2.0 - GAME PLAYER
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const frame = document.getElementById("gameFrame");
  const loading = document.getElementById("playerLoading");
  const title = document.getElementById("playerGameName");
  const consoleTitle = document.getElementById("playerConsole");
  const reloadButton = document.getElementById("reloadGame");
  const closeButton = document.getElementById("closeGame");

  if (!frame) return;

  const params = new URLSearchParams(window.location.search);
  const queryId = params.get("game");
  const pageId = window.RETROBOX_GAME_ID || null;
  const storedId = sessionStorage.getItem("retroboxCurrentGame");
  const gameId = pageId || queryId || storedId;

  const game = getAllGames().find(item => item.id === gameId);

  if (!game) {
    title.textContent = "JOGO NÃO ENCONTRADO";
    consoleTitle.textContent = "";
    loading.innerHTML = `
      <strong>Jogo não encontrado</strong>
      <small>Volte para a biblioteca e escolha outro jogo.</small>
    `;
    return;
  }

  document.title = game.name;
  title.textContent = game.name;
  consoleTitle.textContent = game.consoleInfo.name;

  sessionStorage.setItem("retroboxCurrentGame", game.id);

  function loadGame() {
    loading.classList.remove("hidden");
    frame.src = game.url;
  }

  frame.addEventListener("load", () => {
    loading.classList.add("hidden");
  });

  reloadButton?.addEventListener("click", loadGame);

  function closeGamePage() {
    // Fecha a página/janela do jogo.
    // O navegador só permite window.close() automaticamente quando a janela
    // foi aberta por script. Não redirecionamos mais para a biblioteca.
    window.close();

    // Fallback para páginas locais abertas diretamente: não volta ao index.
    // Se o navegador bloquear o fechamento, a página permanece aberta porque
    // o JavaScript não pode forçar o fechamento de uma aba criada pelo usuário.
  }

  closeButton?.addEventListener("click", closeGamePage);

  // ESC também fecha a página do jogo.
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeGamePage();
    }
  });

  loadGame();
});
