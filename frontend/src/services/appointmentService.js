import axios from "axios";

const API = "http://localhost:8080/api/appointments";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const createAppointment = (data) => {
  return axios.post(API, data, getAuthHeaders());
};