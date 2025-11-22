import axios from "axios";

const API_BASE = "https://685013d7e7c42cfd17974a33.mockapi.io";

export async function fetchTaxes() {
  const res = await axios.get(`${API_BASE}/taxes`);
  return res.data;
}

export async function fetchCountries() {
  const res = await axios.get(`${API_BASE}/countries`);
  return res.data;
}

export async function updateCustomer(id, updatedCustomer) {
  const res = await axios.put(`${API_BASE}/taxes/${id}`, updatedCustomer);
  return res.data;
}
