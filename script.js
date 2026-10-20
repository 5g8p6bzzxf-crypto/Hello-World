(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const on = (selector, event, handler) => {
    const element = $(selector);
    if (element) element.addEventListener(event, handler);
    return element;
  };
  const setText = (selector, value) => { const element = $(selector); if (element) element.textContent = value; };
  const copyText = async (value, feedback, successMessage) => {
    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(value);
      setText(feedback, successMessage || "Copiado!");
    } catch {
      setText(feedback, "A cópia automática não está disponível. Selecione o texto e copie manualmente.");
    }
  };
  const downloadFile = (name, value, type) => {
    const blob = new Blob([value], { type: type || "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // Saudações
  const form = $("#greeting-form");
  const nameInput = $("#name-input");
  const output = $("#greeting-output");
  const styleSelect = $("#greeting-style");
  let currentGreeting = "Olá, mundo!";
  const HISTORY_KEY = "hello-world-greeting-history-v1";
  const THEME_KEY = "hello-world-theme-v1";
  const randomNames = ["Pessoa incrível", "Futuro dev", "Criador de ideias", "Explorador digital", "Lenda do código"];
  let history = [];
  try {
    const saved = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    if (Array.isArray(saved)) history = saved.filter(item => item && typeof item.message === "string").slice(0, 12);
  } catch {}

  function renderGreeting(message, subtitle) {
    currentGreeting = message;
    if (output) {
      output.textContent = message;
      if (subtitle) {
        const note = document.createElement("span");
        note.className = "subtle-result";
        note.textContent = subtitle;
        output.appendChild(note);
      }
    }
    setText("#copy-feedback", "");
    const result = $("#greeting-result");
    if (result) {
      result.classList.remove("result-pop");
      void result.offsetWidth;
      result.classList.add("result-pop");
    }
  }
  function buildGreeting() {
    const name = (nameInput?.value || "").trim() || "mundo";
    const style = styleSelect?.value || "friendly";
    const messages = {
      friendly: "Olá, " + name + "!",
      excited: "E aí, " + name + "! Bora criar algo incrível? 🚀",
      formal: "Seja muito bem-vindo(a), " + name + ".",
      developer: 'console.log("Olá, ' + name + '!"); 💻'
    };
    return messages[style] || messages.friendly;
  }
  function saveHistory() {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); } catch {}
  }
  function renderHistory() {
    const list = $("#history-list");
    if (!list) return;
    list.replaceChildren();
    if (!history.length) {
      const empty = document.createElement("li");
      empty.className = "history-empty";
      empty.textContent = "Suas saudações aparecerão aqui depois que você criar uma.";
      list.appendChild(empty);
      return;
    }
    history.forEach(item => {
      const row = document.createElement("li");
      row.className = "history-item";
      const message = document.createElement("span");
      message.className = "history-message";
      message.textContent = item.message;
      const date = document.createElement("time");
      date.className = "history-date";
      const parsed = new Date(item.createdAt);
      date.textContent = Number.isNaN(parsed.getTime()) ? "" : parsed.toLocaleString("pt-BR");
      const use = document.createElement("button");
      use.type = "button";
      use.className = "history-use";
      use.textContent = "Usar";
      use.addEventListener("click", () => renderGreeting(item.message, "Saudação recuperada do histórico."));
      row.append(message, date, use);
      list.appendChild(row);
    });
  }
  function createGreeting() {
    const message = buildGreeting();
    renderGreeting(message, "Criada agora mesmo. Quer testar outro estilo?");
    history = [{ message, createdAt: new Date().toISOString() }, ...history.filter(item => item.message !== message)].slice(0, 12);
    saveHistory();
    renderHistory();
  }
  if (form) form.addEventListener("submit", event => { event.preventDefault(); createGreeting(); });
  on("#name-input", "input", () => setText("#char-count", (nameInput.value.length) + "/60"));
  on("#random-button", "click", () => {
    if (nameInput) nameInput.value = randomNames[Math.floor(Math.random() * randomNames.length)];
    setText("#char-count", (nameInput?.value.length || 0) + "/60");
    createGreeting();
  });
  on("#clear-button", "click", () => {
    if (nameInput) nameInput.value = "";
    if (styleSelect) styleSelect.value = "friendly";
    setText("#char-count", "0/60");
    renderGreeting("Olá, mundo!", "Seu próximo passo começa agora.");
  });
  on("#copy-button", "click", () => copyText(currentGreeting, "#copy-feedback", "Saudação copiada!"));
  on("#clear-history", "click", () => {
    history = [];
    saveHistory();
    renderHistory();
    setText("#copy-feedback", "Histórico apagado deste navegador.");
  });
  on("#export-history", "click", () => {
    downloadFile("hello-world-historico.json", JSON.stringify(history, null, 2), "application/json;charset=utf-8");
    setText("#copy-feedback", "Exportação do histórico iniciada.");
  });

  // Tema
  const themeToggle = $("#theme-toggle");
  function applyTheme(light) {
    document.body.classList.toggle("light-theme", light);
    if (themeToggle) {
      themeToggle.innerHTML = light ? '☾ <span>Tema escuro</span>' : '☼ <span>Tema claro</span>';
      themeToggle.setAttribute("aria-label", light ? "Ativar tema escuro" : "Ativar tema claro");
    }
  }
  try { applyTheme(localStorage.getItem(THEME_KEY) === "light"); } catch {}
  if (themeToggle) themeToggle.addEventListener("click", () => {
    const light = !document.body.classList.contains("light-theme");
    applyTheme(light);
    try { localStorage.setItem(THEME_KEY, light ? "light" : "dark"); } catch {}
  });

  // Menu mobile
  const menuToggle = $("#menu-toggle");
  const mobileNav = $("#mobile-nav");
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!expanded));
      mobileNav.hidden = expanded;
    });
    $$("#mobile-nav a").forEach(link => link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      mobileNav.hidden = true;
    }));
  }

  // Conversor de texto
  const textInput = $("#text-tool-input");
  const updateTextCount = () => setText("#text-tool-count", (textInput?.value.length || 0) + " caracteres");
  on("#text-tool-input", "input", () => { updateTextCount(); setText("#text-tool-feedback", ""); });
  $$("[data-text-mode]").forEach(button => button.addEventListener("click", () => {
    const value = textInput?.value || "";
    const mode = button.dataset.textMode;
    let result = value;
    if (mode === "upper") result = value.toLocaleUpperCase("pt-BR");
    if (mode === "lower") result = value.toLocaleLowerCase("pt-BR");
    if (mode === "title") result = value.toLocaleLowerCase("pt-BR").replace(/(^|\s)\S/g, part => part.toLocaleUpperCase("pt-BR"));
    if (mode === "sentence") result = value.toLocaleLowerCase("pt-BR").replace(/(^\s*|[.!?]\s+)([a-zá-ú])/gi, (_, prefix, letter) => prefix + letter.toLocaleUpperCase("pt-BR"));
    if (textInput) textInput.value = result;
    updateTextCount();
    setText("#text-tool-feedback", "Texto transformado.");
  }));
  on("#copy-text-result", "click", () => copyText(textInput?.value || "", "#text-tool-feedback", "Texto copiado!"));
  updateTextCount();

  // Cor HEX
  const colorPicker = $("#color-picker");
  const hexInput = $("#hex-value");
  function setColor(value) {
    const normalized = (value || "").trim().startsWith("#") ? value.trim() : "#" + (value || "").trim();
    if (!/^#[0-9a-fA-F]{6}$/.test(normalized)) {
      setText("#color-feedback", "Digite um HEX válido, como #A78BFA.");
      return false;
    }
    const color = normalized.toUpperCase();
    if (colorPicker) colorPicker.value = color;
    if (hexInput) hexInput.value = color;
    const stage = $("#color-stage");
    if (stage) stage.style.backgroundColor = color;
    setText("#color-feedback", "Cor validada: " + color);
    return true;
  }
  if (colorPicker) colorPicker.addEventListener("input", () => setColor(colorPicker.value));
  if (hexInput) hexInput.addEventListener("input", () => {
    if (/^#?[0-9a-fA-F]{6}$/.test(hexInput.value.trim())) setColor(hexInput.value);
  });
  on("#copy-hex", "click", () => { if (setColor(hexInput?.value || "")) copyText(hexInput.value, "#color-feedback", "HEX copiado!"); });
  if (hexInput) setColor(hexInput.value);

  // Bloco de notas
  const notesInput = $("#notes-input");
  const NOTES_KEY = "hello-world-notes-v1";
  try { if (notesInput) notesInput.value = localStorage.getItem(NOTES_KEY) || ""; } catch {}
  function updateNotesCount() { setText("#notes-count", (notesInput?.value.length || 0) + " caracteres"); }
  updateNotesCount();
  if (notesInput) notesInput.addEventListener("input", () => {
    updateNotesCount();
    try { localStorage.setItem(NOTES_KEY, notesInput.value); setText("#notes-status", "Salvo neste navegador ✓"); }
    catch { setText("#notes-status", "Não foi possível salvar localmente"); }
  });
  on("#clear-notes", "click", () => {
    if (notesInput) notesInput.value = "";
    try { localStorage.removeItem(NOTES_KEY); setText("#notes-status", "Notas apagadas"); } catch {}
    updateNotesCount();
  });
  on("#download-notes", "click", () => downloadFile("minhas-notas.txt", notesInput?.value || ""));

  // Relógio e cronômetro
  function updateClock() {
    const now = new Date();
    setText("#clock-display", now.toLocaleTimeString("pt-BR", { hour12: false }));
    setText("#clock-date", now.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }));
  }
  updateClock();
  window.setInterval(updateClock, 1000);
  let running = false, startedAt = 0, elapsed = 0;
  function renderStopwatch() {
    const total = elapsed + (running ? performance.now() - startedAt : 0);
    const tenths = Math.floor(total / 100);
    setText("#stopwatch-display", String(Math.floor(tenths / 600)).padStart(2, "0") + ":" + String(Math.floor((tenths % 600) / 10)).padStart(2, "0") + "." + (tenths % 10));
  }
  window.setInterval(renderStopwatch, 100);
  on("#stopwatch-start", "click", () => {
    if (running) {
      elapsed += performance.now() - startedAt;
      running = false;
      setText("#stopwatch-start", "Continuar");
      setText("#stopwatch-status", "Cronômetro pausado");
    } else {
      startedAt = performance.now();
      running = true;
      setText("#stopwatch-start", "Pausar");
      setText("#stopwatch-status", "Cronômetro em execução");
    }
    renderStopwatch();
  });
  on("#stopwatch-reset", "click", () => {
    running = false; startedAt = 0; elapsed = 0;
    setText("#stopwatch-start", "Iniciar");
    setText("#stopwatch-status", "Cronômetro zerado");
    renderStopwatch();
  });

  // Exemplos de código
  const snippets = {
    javascript: 'console.log("Hello, World!");',
    python: 'print("Hello, World!")',
    html: '<!doctype html>\n<html lang="pt-BR">\n  <body>Hello, World!</body>\n</html>',
    bash: 'printf "Hello, World!\\n"'
  };
  const snippetLanguage = $("#snippet-language");
  function updateSnippet() { setText("#snippet-code", snippets[snippetLanguage?.value] || snippets.javascript); setText("#snippet-feedback", ""); }
  if (snippetLanguage) snippetLanguage.addEventListener("change", updateSnippet);
  on("#copy-snippet", "click", () => copyText($("#snippet-code")?.textContent || "", "#snippet-feedback", "Código copiado!"));
  updateSnippet();

  setText("#current-year", String(new Date().getFullYear()));
  renderHistory();
  setText("#app-status", "JavaScript carregado");
})();