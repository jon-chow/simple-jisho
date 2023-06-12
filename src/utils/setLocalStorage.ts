/**
 * Handles local storage sets and dispatches an event to update the state.
 * @param key The key to set in local storage.
 * @param value The value to set in local storage.
 */
function setLocalStorage(key: string, value: any): void {
  if (typeof value === 'object')
    value = JSON.stringify(value);
  localStorage.setItem(key, value);
  window.dispatchEvent(new Event(`storage_${key}`));
};

export {
  setLocalStorage
};
