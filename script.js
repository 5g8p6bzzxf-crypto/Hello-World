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

  let currentGreeting = "Olá, mundo!";

  function buildGreeting(name) {
    const cleanName = name.trim();
    return cleanName ? `Olá, ${cleanName}!` : "Olá, mundo!";
  }

  function showGreeting(name) {
    currentGreeting = buildGreeting(name);
    greetingOutput.replaceChildren();
    greetingOutput.append(document.createTextNode(currentGreeting));

    if (!name.trim()) {
      const note = document.createElement("span");
      note.className = "subtle-result";
      note.textContent = "Seu próximo passo começa agora.";
      greetingOutput.append(note);
    } else {
      const note = document.createElement("span");
      note.className = "subtle-result";
      note.textContent = "Que bom ter você por aqui. Continue criando!";
      greetingOutput.append(note);
    }
    copyFeedback.textContent = "";
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    showGreeting(nameInput.value);
    greetingOutput.closest(".greeting-result").classList.remove("result-pop");
    // Restart the short visual feedback animation without relying on a timer.
    void greetingOutput.offsetWidth;
    greetingOutput.closest(".greeting-result").classList.add("result-pop");
  });

  nameInput.addEventListener("input", () => {
    copyFeedback.textContent = "";
  });

  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(currentGreeting);
      copyFeedback.textContent = "Saudação copiada para a área de transferência!";
    } catch {
      copyFeedback.textContent = "Não foi possível copiar automaticamente. Selecione e copie a saudação.";
    }
  });

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Abrir menu" : "Fechar menu");
    mobileNav.hidden = isExpanded;
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menu");
      mobileNav.hidden = true;
    });
  });

  currentYear.textContent = String(new Date().getFullYear());
})();
