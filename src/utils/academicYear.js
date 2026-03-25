export const formatAcademicYear = (value) => {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const rawValue = String(value).trim();

  if (/^20\d{2}-20\d{2}$/.test(rawValue)) {
    return rawValue;
  }

  const digits = rawValue.replace(/\D/g, "");

  if (digits.length === 8 && digits.startsWith("20")) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 8)}`;
  }

  if (digits.length === 6) {
    return `20${digits.slice(0, 2)}-${digits.slice(2, 6)}`;
  }

  if (digits.length === 4) {
    return `20${digits.slice(0, 2)}-20${digits.slice(2, 4)}`;
  }

  return rawValue;
};

export const toStoredAcademicYear = (value) => {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const rawValue = String(value).trim();

  if (/^20\d{2}-20\d{2}$/.test(rawValue)) {
    const [startYear, endYear] = rawValue.split("-");
    return `${startYear.slice(2)}${endYear.slice(2)}`;
  }

  const digits = rawValue.replace(/\D/g, "");

  if (digits.length === 8 && digits.startsWith("20")) {
    return `${digits.slice(2, 4)}${digits.slice(6, 8)}`;
  }

  if (digits.length === 6) {
    return `${digits.slice(0, 2)}${digits.slice(4, 6)}`;
  }

  if (digits.length === 4) {
    return digits;
  }

  return rawValue;
};
