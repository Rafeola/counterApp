/**
 * storage.js
 * Salvataggio e lettura dello stato del counter nel localStorage del browser.
 * In questo modo il valore resta disponibile anche dopo aver ricaricato la pagina.
 */

const storageKey = "counterAppState";

/**
 * Salva lo stato del counter.
 * @param {{ value: number, step: number }} state
 */
function saveState(state) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch (error) {
    // Il localStorage può non essere disponibile (es. navigazione privata):
    // l'app continua a funzionare, semplicemente senza salvataggio.
    console.warn("Impossibile salvare lo stato del counter:", error);
  }
}

/**
 * Legge lo stato salvato in precedenza.
 * @returns {{ value: number, step: number } | null} lo stato salvato oppure null
 */
function loadState() {
  try {
    const savedState = localStorage.getItem(storageKey);
    return savedState ? JSON.parse(savedState) : null;
  } catch (error) {
    console.warn("Impossibile leggere lo stato del counter:", error);
    return null;
  }
}
