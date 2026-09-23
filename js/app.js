/* =========================================================
   RETROBOX V2.0 - APP
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initMenu();
  renderHomeConsoles();
  renderEmulators();
  initGamesPage();
});

function initMenu() {
  const button = document.getElementById("menuBtn");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  if (!button || !sidebar) return;

  function toggleMenu() {
    sidebar.classList.toggle("open");
    if (overlay) overlay.classList.toggle("show");
  }

  button.addEventListener("click", toggleMenu);
  if (overlay) overlay.addEventListener("click", toggleMenu);

  sidebar.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("open");
      if (overlay) overlay.classList.remove("show");
    });
  });
}

function consoleCard(consoleData) {
  return `
    <a class="console-card ${consoleData.className}"
       href="jogos.html?console=${encodeURIComponent(consoleData.id)}">
      <div class="console-icon">${consoleData.icon}</div>
      <div>
        <span class="eyebrow">EMULADOR</span>
        <h3>${consoleData.name}</h3>
        <small>Ver jogos →</small>
      </div>
    </a>
  `;
}

function renderHomeConsoles() {
  const target = document.getElementById("consoleGrid");
  if (!target) return;

  target.innerHTML = Object.values(CONSOLES)
    .slice(0, 4)
    .map(consoleCard)
    .join("");

  const featured = document.getElementById("featuredGames");
  if (featured) {
    featured.innerHTML = getAllGames()
      .slice(0, 8)
      .map(gameCard)
      .join("");
  }
}

function renderEmulators() {
  const target = document.getElementById("emulatorGrid");
  if (!target) return;

  target.innerHTML = Object.values(CONSOLES)
    .map(consoleCard)
    .join("");
}

function gameCard(game) {
  return `
    <article class="game-card" data-game-id="${escapeHTML(game.id)}"
             onclick="abrirGame('${escapeJS(game.id)}')">
      <div class="game-cover ${game.consoleInfo.className}">
        <span>${game.consoleInfo.icon}</span>
        <small>${escapeHTML(game.consoleInfo.name)}</small>
      </div>

      <div class="game-info">
        <h3>${escapeHTML(game.name)}</h3>
        <span>${escapeHTML(game.consoleInfo.name)}</span>
      </div>
    </article>
  `;
}

function initGamesPage() {
  const grid = document.getElementById("gamesGrid");
  if (!grid) return;

  const search = document.getElementById("searchInput");
  const filter = document.getElementById("consoleFilter");
  const empty = document.getElementById("emptyState");

  if (filter) {
    Object.values(CONSOLES).forEach(consoleData => {
      filter.insertAdjacentHTML(
        "beforeend",
        `<option value="${consoleData.id}">${escapeHTML(consoleData.name)}</option>`
      );
    });
  }

  const params = new URLSearchParams(window.location.search);
  const selectedConsole = params.get("console");

  if (selectedConsole && CONSOLES[selectedConsole] && filter) {
    filter.value = selectedConsole;
  }

  function render() {
    const query = (search?.value || "").toLowerCase().trim();
    const selected = filter?.value || "all";

    const results = getAllGames().filter(game => {
      const matchesName = !query ||
        game.name.toLowerCase().includes(query);

      const matchesConsole =
        selected === "all" || game.console === selected;

      return matchesName && matchesConsole;
    });

    grid.innerHTML = results.map(gameCard).join("");

    if (empty) empty.hidden = results.length !== 0;
  }

  search?.addEventListener("input", render);
  filter?.addEventListener("change", render);

  render();
}

function abrirGame(id) {
  const game = getAllGames().find(item => item.id === id);

  if (!game) {
    alert("Jogo não encontrado.");
    return;
  }

  sessionStorage.setItem("retroboxCurrentGame", id);

  let recent = [];
  try {
    recent = JSON.parse(localStorage.getItem("retroboxRecentes") || "[]");
  } catch (_) {
    recent = [];
  }

  recent = [id, ...recent.filter(item => item !== id)].slice(0, 30);
  localStorage.setItem("retroboxRecentes", JSON.stringify(recent));

  // Cada jogo possui sua própria página, organizada dentro da pasta do console.
  const consoleFolders = {
    nes: "Nintendo",
    snes: "Super Nintendo",
    n64: "Nintendo 64",
    gb: "Game Boy",
    gbc: "Game Boy Color",
    gba: "Game Boy Advance",
    megadrive: "Mega Drive",
    atari: "Atari"
  };

  const folder = consoleFolders[game.console] || "Outros";
  const filename = `${game.name} - SMUNNA COLECTIONS.html`
    .replace(/[<>:"/\\|?*]/g, "")
    .trim()
    .replace(/\.+$/, "");

  window.location.href = encodeURI(`${folder}/${filename}`);
}
function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeJS(value) {
  return String(value).replaceAll("\\", "\\\\").replaceAll("'", "\\'");
}
