import axios from 'axios';
import { AuditData } from '../types/audit';

// In production / Docker, requests route via relative URL or VITE_API_URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 45000 // 45 sec timeout for crawling
});

export async function runAuditApi(url: string): Promise<AuditData> {
  const response = await api.post('/audit', { url });
  return response.data;
}

export async function getAuditApi(auditId: string): Promise<AuditData> {
  const response = await api.get(`/audit/${auditId}`);
  return response.data;
}

export async function getRecentAuditsApi(): Promise<AuditData[]> {
  const response = await api.get('/audit');
  return response.data.audits || [];
}
