/**
 * ui.js
 * Interfaccia del counter: crea dinamicamente gli elementi con la manipolazione
 * del DOM e si occupa di mostrare il valore. Non contiene la logica di calcolo.
 */

/**
 * Crea un elemento HTML con classe e testo.
 * @param {string} tagName - tipo di elemento (es. "div", "button")
 * @param {string} className - classe CSS da assegnare
 * @param {string} [textContent] - testo dell'elemento
 * @returns {HTMLElement}
 */
function createDomElement(tagName, className, textContent = "") {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = textContent;
  return element;
}

/**
 * Crea un pulsante accessibile.
 * @param {string} className
 * @param {string} label - testo visibile
 * @param {string} ariaLabel - descrizione letta dagli screen reader
 * @returns {HTMLButtonElement}
 */
function createButton(className, label, ariaLabel) {
  const button = createDomElement("button", className, label);
  button.type = "button";
  button.setAttribute("aria-label", ariaLabel);
  return button;
}

/**
 * Crea il selettore del passo (1, 5, 10).
 * @param {number[]} steps
 * @returns {{ stepSelector: HTMLElement, stepButtons: HTMLButtonElement[] }}
 */
function createStepSelector(steps) {
  const stepSelector = createDomElement("div", "stepSelector");
  const stepLabel = createDomElement("span", "stepLabel", "Passo");
  const stepGroup = createDomElement("div", "stepGroup");
  stepGroup.setAttribute("role", "group");
  stepGroup.setAttribute("aria-label", "Scegli di quanto cambia il valore a ogni clic");

  const stepButtons = steps.map((step) => {
    const stepButton = createButton("stepButton", String(step), `Passo ${step}`);
    stepButton.dataset.step = String(step);
    stepGroup.appendChild(stepButton);
    return stepButton;
  });

  stepSelector.append(stepLabel, stepGroup);
  return { stepSelector, stepButtons };
}

/**
 * Costruisce l'intera interfaccia del counter dentro il contenitore indicato.
 * @param {HTMLElement} rootElement - contenitore in cui inserire il counter
 * @param {number[]} steps - passi disponibili
 * @returns {object} riferimenti agli elementi che servono ad app.js
 */
function buildCounterUi(rootElement, steps) {
  const counterCard = createDomElement("section", "counterCard");
  counterCard.setAttribute("aria-label", "Counter");

  // Intestazione
  const counterHeader = createDomElement("header", "counterHeader");
  const counterTitle = createDomElement("h1", "counterTitle", "Counter");
  const counterSubtitle = createDomElement("p", "counterSubtitle", "Aumenta o diminuisci il valore");
  counterHeader.append(counterTitle, counterSubtitle);

  // Visualizzazione del valore (aria-live: gli screen reader leggono ogni cambiamento)
  const valueDisplay = createDomElement("output", "counterValue", "0");
  valueDisplay.setAttribute("aria-live", "polite");

  // Pulsanti + e −
  const counterControls = createDomElement("div", "counterControls");
  const decrementButton = createButton("controlButton decrementButton", "−", "Diminuisci");
  const incrementButton = createButton("controlButton incrementButton", "+", "Aumenta");
  counterControls.append(decrementButton, incrementButton);

  // Opzioni extra: passo e reset
  const counterOptions = createDomElement("div", "counterOptions");
  const { stepSelector, stepButtons } = createStepSelector(steps);
  const resetButton = createButton("resetButton", "↺ Reset", "Azzera il counter");
  counterOptions.append(stepSelector, resetButton);

  // Suggerimento per le scorciatoie da tastiera
  const keyboardHint = createDomElement("p", "keyboardHint", "Tastiera: ↑ / ↓ oppure + / − · R per azzerare");

  counterCard.append(counterHeader, valueDisplay, counterControls, counterOptions, keyboardHint);
  rootElement.appendChild(counterCard);

  return { valueDisplay, decrementButton, incrementButton, resetButton, stepButtons };
}

/**
 * Riavvia l'animazione di "rimbalzo" del valore.
 * @param {HTMLElement} element
 */
function playBumpAnimation(element) {
  element.classList.remove("isBumping");
  void element.offsetWidth; // forza il browser a ricalcolare lo stile, così l'animazione riparte
  element.classList.add("isBumping");
}

/**
 * Mostra il valore del counter e lo colora in base al segno.
 * @param {HTMLElement} valueDisplay
 * @param {number} value
 * @param {{ animate?: boolean }} [options]
 */
function renderValue(valueDisplay, value, { animate = true } = {}) {
  // Per i numeri negativi si usa il segno meno tipografico (−), più leggibile del trattino
  valueDisplay.textContent = value < 0 ? `−${Math.abs(value)}` : String(value);
  valueDisplay.classList.toggle("isPositive", value > 0);
  valueDisplay.classList.toggle("isNegative", value < 0);

  if (animate) {
    playBumpAnimation(valueDisplay);
  }
}

/**
 * Evidenzia il passo selezionato e aggiorna il testo dei pulsanti + e −.
 * @param {object} ui - riferimenti restituiti da buildCounterUi
 * @param {number} step
 */
function renderStep(ui, step) {
  ui.stepButtons.forEach((stepButton) => {
    const isSelected = Number(stepButton.dataset.step) === step;
    stepButton.classList.toggle("isSelected", isSelected);
    stepButton.setAttribute("aria-pressed", String(isSelected));
  });

  ui.incrementButton.textContent = step === 1 ? "+" : `+${step}`;
  ui.decrementButton.textContent = step === 1 ? "−" : `−${step}`;
  ui.incrementButton.setAttribute("aria-label", `Aumenta di ${step}`);
  ui.decrementButton.setAttribute("aria-label", `Diminuisci di ${step}`);
}

/**
 * Dà un breve riscontro visivo sul pulsante quando si usa la tastiera.
 * @param {HTMLElement} button
 */
function flashButton(button) {
  button.classList.add("isActive");
  setTimeout(() => button.classList.remove("isActive"), 120);
}
