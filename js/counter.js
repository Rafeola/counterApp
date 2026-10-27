/**
 * counter.js
 * Logica del counter: contiene SOLO lo stato e le funzioni che lo modificano.
 * Questo file non accede mai al DOM: della visualizzazione si occupa ui.js.
 */

const allowedSteps = [1, 5, 10];

const counterState = {
  value: 0,
  step: 1,
};

/**
 * Inizializza il counter, eventualmente con uno stato salvato.
 * Se lo stato salvato non è valido, si parte da 0 con passo 1.
 * @param {{ value: number, step: number } | null} savedState
 */
function initCounter(savedState) {
  if (!savedState) {
    return;
  }

  if (Number.isInteger(savedState.value)) {
    counterState.value = savedState.value;
  }

  if (allowedSteps.includes(savedState.step)) {
    counterState.step = savedState.step;
  }
}

/** @returns {number} il valore attuale del counter */
function getValue() {
  return counterState.value;
}

/** @returns {number} il passo attuale (di quanto cambia il valore a ogni clic) */
function getStep() {
  return counterState.step;
}

/** @returns {{ value: number, step: number }} una copia dello stato attuale */
function getState() {
  return { ...counterState };
}

/**
 * Aumenta il valore del counter del passo attuale.
 * @returns {number} il nuovo valore
 */
function increment() {
  counterState.value += counterState.step;
  return counterState.value;
}

/**
 * Diminuisce il valore del counter del passo attuale.
 * @returns {number} il nuovo valore
 */
function decrement() {
  counterState.value -= counterState.step;
  return counterState.value;
}

/**
 * Riporta il valore del counter a 0.
 * @returns {number} il nuovo valore (0)
 */
function resetCounter() {
  counterState.value = 0;
  return counterState.value;
}

/**
 * Cambia il passo del counter, accettando solo i valori consentiti.
 * @param {number | string} newStep
 * @returns {number} il passo attuale dopo la modifica
 */
function setStep(newStep) {
  const parsedStep = Number(newStep);

  if (allowedSteps.includes(parsedStep)) {
    counterState.step = parsedStep;
  }

  return counterState.step;
}
