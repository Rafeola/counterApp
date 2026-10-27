/**
 * app.js
 * Punto di ingresso dell'applicazione: collega la logica (counter.js),
 * l'interfaccia (ui.js) e il salvataggio (storage.js) gestendo gli eventi.
 */

/**
 * Mostra il nuovo valore e salva lo stato.
 * @param {object} ui
 * @param {number} newValue
 */
function updateCounter(ui, newValue) {
  renderValue(ui.valueDisplay, newValue);
  saveState(getState());
}

/**
 * Gestisce il cambio di passo.
 * @param {object} ui
 * @param {string} selectedStep
 */
function updateStep(ui, selectedStep) {
  const newStep = setStep(selectedStep);
  renderStep(ui, newStep);
  saveState(getState());
}

/**
 * Scorciatoie da tastiera: ↑ o + aumenta, ↓ o − diminuisce, R azzera.
 * @param {KeyboardEvent} event
 * @param {object} ui
 */
function handleKeydown(event, ui) {
  // Ignora le combinazioni con Ctrl/Cmd/Alt (es. Ctrl + per lo zoom)
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return;
  }

  switch (event.key) {
    case "ArrowUp":
    case "+":
      event.preventDefault();
      flashButton(ui.incrementButton);
      updateCounter(ui, increment());
      break;
    case "ArrowDown":
    case "-":
      event.preventDefault();
      flashButton(ui.decrementButton);
      updateCounter(ui, decrement());
      break;
    case "r":
    case "R":
      flashButton(ui.resetButton);
      updateCounter(ui, resetCounter());
      break;
    default:
      break;
  }
}

/**
 * Collega tutti gli eventi ai rispettivi pulsanti.
 * @param {object} ui
 */
function bindEvents(ui) {
  ui.incrementButton.addEventListener("click", () => updateCounter(ui, increment()));
  ui.decrementButton.addEventListener("click", () => updateCounter(ui, decrement()));
  ui.resetButton.addEventListener("click", () => updateCounter(ui, resetCounter()));

  ui.stepButtons.forEach((stepButton) => {
    stepButton.addEventListener("click", () => updateStep(ui, stepButton.dataset.step));
  });

  document.addEventListener("keydown", (event) => handleKeydown(event, ui));
}

/** Avvia l'applicazione. */
function initApp() {
  const rootElement = document.getElementById("app");
  const ui = buildCounterUi(rootElement, allowedSteps);

  initCounter(loadState());
  renderValue(ui.valueDisplay, getValue(), { animate: false });
  renderStep(ui, getStep());
  bindEvents(ui);
}

initApp();
