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


  // Lista de tarefas com armazenamento local
  const TODO_KEY = "hello-world-todos-v1";
  let todos = [];
  try { const saved = JSON.parse(localStorage.getItem(TODO_KEY) || "[]"); if (Array.isArray(saved)) todos = saved.filter(t => t && typeof t.text === "string"); } catch {}
  function saveTodos() { try { localStorage.setItem(TODO_KEY, JSON.stringify(todos)); } catch { setText("#todo-feedback", "Não foi possível salvar as tarefas neste navegador."); } }
  function renderTodos() {
    const list = $("#todo-list"); if (!list) return;
    list.replaceChildren();
    const done = todos.filter(t => t.done).length;
    setText("#todo-count", todos.length + " tarefa(s) · " + done + " concluída(s)");
    if (!todos.length) { const empty = document.createElement("li"); empty.className = "todo-empty"; empty.textContent = "Adicione sua primeira tarefa acima."; list.appendChild(empty); return; }
    todos.forEach(todo => {
      const item = document.createElement("li"); item.className = "todo-item" + (todo.done ? " is-done" : "");
      const checkbox = document.createElement("input"); checkbox.type = "checkbox"; checkbox.checked = !!todo.done; checkbox.setAttribute("aria-label", "Marcar tarefa como concluída");
      checkbox.addEventListener("change", () => { todo.done = checkbox.checked; saveTodos(); renderTodos(); });
      const label = document.createElement("span"); label.textContent = todo.text;
      const remove = document.createElement("button"); remove.type = "button"; remove.className = "todo-delete"; remove.textContent = "×"; remove.setAttribute("aria-label", "Excluir tarefa");
      remove.addEventListener("click", () => { todos = todos.filter(t => t.id !== todo.id); saveTodos(); renderTodos(); });
      item.append(checkbox, label, remove); list.appendChild(item);
    });
  }
  on("#todo-form", "submit", event => {
    event.preventDefault();
    const input = $("#todo-input"); const value = input?.value.trim();
    if (!value) { setText("#todo-feedback", "Digite uma tarefa antes de adicionar."); input?.focus(); return; }
    todos.unshift({ id: Date.now().toString(36) + Math.random().toString(36).slice(2,7), text: value, done: false });
    saveTodos(); renderTodos(); input.value = ""; setText("#todo-feedback", "Tarefa adicionada!"); input.focus();
  });
  on("#todo-clear-done", "click", () => { todos = todos.filter(t => !t.done); saveTodos(); renderTodos(); setText("#todo-feedback", "Tarefas concluídas removidas."); });
  renderTodos();

  // Pomodoro: alterna foco e pausas sem depender de contagem por intervalos acumulados
  let pomoDuration = 25 * 60, pomoRemaining = pomoDuration, pomoRunning = false, pomoEndAt = 0;
  const pomoStartButton = $("#pomodoro-start");
  function renderPomodoro() {
    const remaining = pomoRunning ? Math.max(0, Math.ceil((pomoEndAt - Date.now()) / 1000)) : pomoRemaining;
    const minutes = Math.floor(remaining / 60), seconds = remaining % 60;
    setText("#pomodoro-display", String(minutes).padStart(2,"0") + ":" + String(seconds).padStart(2,"0"));
    const progress = $("#pomodoro-progress");
    if (progress) progress.style.width = Math.max(0, Math.min(100, remaining / pomoDuration * 100)) + "%";
    if (pomoRunning && remaining <= 0) {
      pomoRunning = false; pomoRemaining = 0; setText("#pomodoro-start", "Começar de novo");
      setText("#pomodoro-status", "Tempo concluído! Faça uma pausa e cuide de você.");
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") new Notification("Pomodoro concluído", { body: "Seu bloco de tempo terminou." });
    }
  }
  $$("[data-pomo-minutes]").forEach(button => button.addEventListener("click", () => {
    pomoRunning = false; pomoDuration = Number(button.dataset.pomoMinutes) * 60; pomoRemaining = pomoDuration;
    $$("[data-pomo-minutes]").forEach(b => b.classList.toggle("is-active", b === button));
    setText("#pomodoro-start", "Começar foco"); setText("#pomodoro-status", "Novo bloco pronto."); renderPomodoro();
  }));
  on("#pomodoro-start", "click", () => {
    if (pomoRunning) { pomoRemaining = Math.max(0, Math.ceil((pomoEndAt - Date.now()) / 1000)); pomoRunning = false; setText("#pomodoro-start", "Continuar"); setText("#pomodoro-status", "Temporizador pausado."); }
    else { if (pomoRemaining <= 0) pomoRemaining = pomoDuration; pomoEndAt = Date.now() + pomoRemaining * 1000; pomoRunning = true; setText("#pomodoro-start", "Pausar"); setText("#pomodoro-status", "Foco em andamento. Você consegue!"); }
    renderPomodoro();
  });
  on("#pomodoro-reset", "click", () => { pomoRunning = false; pomoRemaining = pomoDuration; setText("#pomodoro-start", "Começar foco"); setText("#pomodoro-status", "Temporizador reiniciado."); renderPomodoro(); });
  window.setInterval(renderPomodoro, 250);

  // Calculadora básica, sem executar código arbitrário
  let calcCurrent = "0", calcStored = null, calcOperator = null, calcNewEntry = true;
  function renderCalculator() { setText("#calc-display", calcCurrent.length > 14 ? Number(calcCurrent).toPrecision(8) : calcCurrent); }
  function calculate(a, b, operator) {
    if (operator === "+") return a + b;
    if (operator === "-") return a - b;
    if (operator === "*") return a * b;
    if (operator === "/") return b === 0 ? NaN : a / b;
    return b;
  }
  $$("[data-calc]").forEach(button => button.addEventListener("click", () => {
    const action = button.dataset.calc, value = button.dataset.value;
    if (action === "clear") { calcCurrent = "0"; calcStored = null; calcOperator = null; calcNewEntry = true; setText("#calc-feedback", ""); }
    else if (action === "digit") { if (calcNewEntry || calcCurrent === "0" || calcCurrent === "Erro") calcCurrent = value; else if (calcCurrent.replace("-","").length < 14) calcCurrent += value; calcNewEntry = false; }
    else if (action === "decimal") { if (calcNewEntry || calcCurrent === "Erro") { calcCurrent = "0."; calcNewEntry = false; } else if (!calcCurrent.includes(".")) calcCurrent += "."; }
    else if (action === "sign") { if (calcCurrent !== "0" && calcCurrent !== "Erro") calcCurrent = String(Number(calcCurrent) * -1); }
    else if (action === "percent") { if (calcCurrent !== "Erro") calcCurrent = String(Number(calcCurrent) / 100); }
    else if (action === "operator") {
      if (calcCurrent === "Erro") return;
      const current = Number(calcCurrent);
      if (calcStored !== null && calcOperator && !calcNewEntry) { const result = calculate(calcStored, current, calcOperator); calcCurrent = Number.isFinite(result) ? String(Number(result.toPrecision(12))) : "Erro"; calcStored = calcCurrent === "Erro" ? null : Number(calcCurrent); }
      else calcStored = current;
      calcOperator = value; calcNewEntry = true;
    } else if (action === "equals") {
      if (calcStored !== null && calcOperator && calcCurrent !== "Erro") {
        const result = calculate(calcStored, Number(calcCurrent), calcOperator);
        calcCurrent = Number.isFinite(result) ? String(Number(result.toPrecision(12))) : "Erro";
        calcStored = null; calcOperator = null; calcNewEntry = true;
        setText("#calc-feedback", calcCurrent === "Erro" ? "Não é possível dividir por zero." : "Resultado calculado.");
      }
    }
    renderCalculator();
  }));
  renderCalculator();

  // Gerador de senha: usa a fonte criptográfica do navegador quando disponível
  const passwordLength = $("#password-length");
  function updatePasswordLength() { setText("#password-length-label", passwordLength?.value || "16"); }
  on("#password-length", "input", updatePasswordLength);
  on("#password-generate", "click", () => {
    let pool = "";
    if ($("#password-upper")?.checked) pool += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if ($("#password-lower")?.checked) pool += "abcdefghijklmnopqrstuvwxyz";
    if ($("#password-numbers")?.checked) pool += "0123456789";
    if ($("#password-symbols")?.checked) pool += "!@#$%&*+-=?_";
    if (!pool) { setText("#password-feedback", "Selecione pelo menos um tipo de caractere."); return; }
    const length = Number(passwordLength?.value || 16);
    let password = "";
    try {
      const bytes = new Uint32Array(length);
      if (window.crypto?.getRandomValues) window.crypto.getRandomValues(bytes);
      else for (let i = 0; i < length; i++) bytes[i] = Math.floor(Math.random() * 4294967296);
      for (let i = 0; i < length; i++) password += pool[bytes[i] % pool.length];
    } catch {
      for (let i = 0; i < length; i++) password += pool[Math.floor(Math.random() * pool.length)];
    }
    const out = $("#password-output"); if (out) out.value = password;
    setText("#password-feedback", "Senha gerada localmente. Guarde-a em um gerenciador de senhas.");
  });
  on("#password-copy", "click", () => copyText($("#password-output")?.value || "", "#password-feedback", "Senha copiada!"));
  updatePasswordLength();
  
  setText("#current-year", String(new Date().getFullYear()));
  renderHistory();
  setText("#app-status", "JavaScript carregado");
})();