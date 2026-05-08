import { visitsMock } from "./mock/visits.mock";

export const getVisits = () => {
  return Promise.resolve(visitsMock);
};

export const createVisit = (data) => {
  console.log("Creating visit (mock):", data);
  return Promise.resolve({ success: true });
};
