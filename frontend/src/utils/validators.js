// src/utils/validators.js

export const isNonEmpty = (value) =>
  Boolean(value && value.trim());

export const isEmailValid = (email) =>
  /^\S+@\S+\.\S+$/.test(email);

export const isPhoneValid = (phone) =>
  /^\d{10}$/.test(phone);

export const isValidDateRange = (start, end) => {
  if (!start || !end) return true;
  return end >= start;
};