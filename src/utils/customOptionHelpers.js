export const normalizeCustomOptionInput = (value = "") =>
  value.toString().trim().replace(/\s+/g, " ");

export const getCustomOptionLabel = (value) =>
  `Use "${normalizeCustomOptionInput(value)}"`;

export const confirmCustomOption = (typeLabel, rawValue) => {
  const value = normalizeCustomOptionInput(rawValue);
  if (!value) return false;

  if (typeof window === "undefined" || typeof window.confirm !== "function") {
    return true;
  }

  return window.confirm(
    `"${value}" is not in the ${typeLabel} list yet.\n\nPress OK to use it as a new ${typeLabel}, or Cancel to check the spelling first.`,
  );
};
