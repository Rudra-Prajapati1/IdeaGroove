export const buildDegreeSubjectMap = (degreeSubject = []) => {
  const map = {};

  degreeSubject.forEach(({ degree_name, subject_name }) => {
    if (!degree_name || !subject_name) return;
    if (!map[degree_name]) {
      map[degree_name] = [];
    }
    if (!map[degree_name].includes(subject_name)) {
      map[degree_name].push(subject_name);
    }
  });

  Object.keys(map).forEach((degree) => {
    map[degree] = [...new Set(map[degree])].sort((a, b) =>
      String(a).localeCompare(String(b)),
    );
  });

  return map;
};

export { formatAcademicYear } from "../../utils/academicYear";

export const normalizeArrayResponse = (data, fallbackKeys = []) => {
  if (Array.isArray(data)) return data;

  for (const key of fallbackKeys) {
    if (Array.isArray(data?.[key])) return data[key];
  }

  return [];
};
