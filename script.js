(() => {
  "use strict";

  const form = document.querySelector("#greeting-form");
  const nameInput = document.querySelector("#name-input");
  const greetingOutput = document.querySelector("#greeting-output");
  const copyButton = document.querySelector("#copy-button");
  const copyFeedback = document.querySelector("#copy-feedback");
  const menuToggle = document.querySelector("#menu-toggle");
  const mobileNav = document.querySelector("#mobile-nav");
  const currentYear = document.querySelector("#current-year");
  const themeToggle = document.querySelector("#theme-toggle");
  const styleSelect = document.querySelector("#greeting-style");
  const randomButton = document.querySelector("#random-button");
  const clearButton = document.querySelector("#clear-button");
  const charCount = document.querySelector("#char-count");
  const historyList = document.querySelector("#history-list");
  const clearHistoryButton = document.querySelector("#clear-history");
  const exportHistoryButton = document.querySelector("#export-history");

  const HISTORY_KEY = "hello-world-greeting-history-v1";
  const THEME_KEY = "hello-world-theme-v1";
  const randomNames = ["Pessoa incrível", "Futuro dev", "Criador de ideias", "Explorador digital", "Lenda do código"];
  let currentGreeting = "Olá, mundo!";
  let history = loadHistory();

  function buildGreeting(name, style) {
    const cleanName = name.trim() || "mundo";
    const messages = {
      friendly: `Olá, ${cleanName}!`,
      excited: `E aí, ${cleanName}! Bora criar algo incrível? 🚀`,
      formal: `Seja muito bem-vindo(a), ${cleanName}.`,
      developer: `console.log("Olá, ${cleanName}!"); 💻`
    };
    return messages[style] || messages.friendly;
  }

  function loadHistory() {
    try {
      const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
      return Array.isArray(parsed) ? parsed.filter(item => item && typeof item.message === "string").slice(0, 12) : [];
    } catch {
      return [];
    }
  }

  function saveHistory() {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch {
      copyFeedback.textContent = "O navegador não permitiu salvar o histórico local.";
    }
  }

  function renderHistory() {
    historyList.replaceChildren();
    if (!history.length) {
      const empty = document.createElement("li");
      empty.className = "history-empty";
      empty.textContent = "Suas saudações aparecerão aqui depois que você criar uma.";
      historyList.append(empty);
      return;
    }
    history.forEach((item, index) => {
      const row = document.createElement("li");
      row.className = "history-item";
      const message = document.createElement("span");
      message.className = "history-message";
      message.textContent = item.message;
      const date = document.createElement("time");
      date.className = "history-date";
      date.dateTime = item.createdAt;
      date.textContent = new Date(item.createdAt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
      const useButton = document.createElement("button");
      useButton.type = "button";
      useButton.className = "history-use";
      useButton.textContent = "Usar";
      useButton.setAttribute("aria-label", `Usar saudação: ${item.message}`);
      useButton.addEventListener("click", () => {
        currentGreeting = item.message;
        greetingOutput.replaceChildren(document.createTextNode(currentGreeting));
        copyFeedback.textContent = "Saudação recuperada do histórico.";
        document.querySelector("#greeting-result").scrollIntoView({ behavior: "smooth", block: "center" });
      });
      row.append(message, date, useButton);
      row.dataset.index = String(index);
      historyList.append(row);
    });
  }

  function renderGreeting(message, subtitle) {
    currentGreeting = message;
    greetingOutput.replaceChildren(document.createTextNode(message));
    if (subtitle) {
      const note = document.createElement("span");
      note.className = "subtle-result";
      note.textContent = subtitle;
      greetingOutput.append(note);
    }
    copyFeedback.textContent = "";
    const result = document.querySelector("#greeting-result");
    result.classList.remove("result-pop");
    void result.offsetWidth;
    result.classList.add("result-pop");
  }

  function createGreeting() {
    const message = buildGreeting(nameInput.value, styleSelect.value);
    renderGreeting(message, "Criada agora mesmo. Quer testar outro estilo?");
    history = [{ message, createdAt: new Date().toISOString() }, ...history.filter(item => item.message !== message)].slice(0, 12);
    saveHistory();
    renderHistory();
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    createGreeting();
  });

  nameInput.addEventListener("input", () => {
    charCount.textContent = `${nameInput.value.length}/60`;
    copyFeedback.textContent = "";
  });

  randomButton.addEventListener("click", () => {
    nameInput.value = randomNames[Math.floor(Math.random() * randomNames.length)];
    charCount.textContent = `${nameInput.value.length}/60`;
    createGreeting();
  });

  clearButton.addEventListener("click", () => {
    nameInput.value = "";
    charCount.textContent = "0/60";
    styleSelect.value = "friendly";
    renderGreeting("Olá, mundo!", "Seu próximo passo começa agora.");
    nameInput.focus();
  });

  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(currentGreeting);
      copyFeedback.textContent = "Saudação copiada para a área de transferência!";
    } catch {
      copyFeedback.textContent = "Não foi possível copiar automaticamente. Selecione e copie a saudação.";
    }
  });

  themeToggle.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light-theme");
    try { localStorage.setItem(THEME_KEY, isLight ? "light" : "dark"); } catch {}
    themeToggle.innerHTML = isLight ? "☾ <span>Tema escuro</span>" : "☼ <span>Tema claro</span>";
    themeToggle.setAttribute("aria-label", isLight ? "Ativar tema escuro" : "Ativar tema claro");
  });

  try {
    if (localStorage.getItem(THEME_KEY) === "light") {
      document.body.classList.add("light-theme");
      themeToggle.innerHTML = "☾ <span>Tema escuro</span>";
    }
  } catch {}

  clearHistoryButton.addEventListener("click", () => {
    history = [];
    saveHistory();
    renderHistory();
    copyFeedback.textContent = "Histórico apagado deste navegador.";
  });

  exportHistoryButton.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "hello-world-historico.json";
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    copyFeedback.textContent = "Exportação do histórico iniciada.";
  });

  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    menuToggle.setAttribute("aria-label", expanded ? "Abrir menu" : "Fechar menu");
    mobileNav.hidden = expanded;
  });

  mobileNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menu");
      mobileNav.hidden = true;
    });
  });

  currentYear.textContent = String(new Date().getFullYear());
  renderHistory();
})();