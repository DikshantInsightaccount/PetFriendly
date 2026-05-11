// src/utils/date.js

/**
 * Convert HH:mm → HH:mm:ss
 * Required for Spring Boot LocalTime
 */
export const normalizeTime = (time) =>
  time && time.length === 5 ? `${time}:00` : time;

/**
 * Extract YYYY-MM-DD safely
 */
export const toISODate = (value) =>
  value ? String(value).slice(0, 10) : "";

/**
 * Format backend LocalDateTime → readable string
 */
export const formatDateTime = (value) => {
  if (!value) return "-";

  const str = String(value);
  const normalized = str.includes("T") ? str : str.replace(" ", "T");
  const date = new Date(normalized);

  return isNaN(date.getTime()) ? str : date.toLocaleString();
};