/**
 * Handles local storage sets and dispatches an event to update the state.
 */
export const setLocalStorage = (key: string, value: any) => {
  if (typeof value === 'object') value = JSON.stringify(value);
  localStorage.setItem(key, value);
  window.dispatchEvent(new Event(`storage_${key}`));
};
