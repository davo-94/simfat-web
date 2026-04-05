import axiosClient from '../api/axiosClient';
import { API_ENDPOINTS } from '../api/endpoints';
import { extractData } from '../api/responseAdapter';

export async function getAlerts(filters = {}) {
  if (filters.regionId) {
    const response = await axiosClient.get(`${API_ENDPOINTS.alerts}/region/${filters.regionId}`);
    return extractData(response.data);
  }

  const response = await axiosClient.get(API_ENDPOINTS.alerts);
  return extractData(response.data);
}

export async function createAlert(payload) {
  const response = await axiosClient.post(API_ENDPOINTS.alerts, payload);
  return extractData(response.data);
}

export async function updateAlert(id, payload) {
  const response = await axiosClient.put(`${API_ENDPOINTS.alerts}/${id}`, payload);
  return extractData(response.data);
}

export async function deleteAlert(id) {
  const response = await axiosClient.delete(`${API_ENDPOINTS.alerts}/${id}`);
  return extractData(response.data);
}
