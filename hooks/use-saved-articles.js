"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "gogo:saved-articles";
const CHANGE_EVENT = "gogo:saved-articles-change";
const EMPTY = "[]";

function subscribe(callback) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function getSnapshot() {
  try { return localStorage.getItem(STORAGE_KEY) ?? EMPTY; }
  catch { return EMPTY; }
}

function parseIds(value) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? [...new Set(parsed.filter((id) => Number.isSafeInteger(id) && id > 0))] : [];
  } catch { return []; }
}

export function useSavedArticles() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
  const savedIds = parseIds(snapshot);

  function toggleSaved(id) {
    const current = parseIds(getSnapshot());
    const wasSaved = current.includes(id);
    const next = wasSaved ? current.filter((savedId) => savedId !== id) : [...current, id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(CHANGE_EVENT));
    return !wasSaved;
  }

  return { savedIds, toggleSaved };
}
