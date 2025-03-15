import axios from 'axios';
import { getBaseUrl, getWablasConfig, setWablasConfig, type WablasServer } from '../config/wablas';

export const api = axios.create();

// Update baseURL when config changes
api.interceptors.request.use((config) => {
  config.baseURL = getBaseUrl();
  const { apiKey } = getWablasConfig();
  if (apiKey) {
    config.headers.Authorization = `Bearer ${apiKey}`;
  }
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export interface SendMessagePayload {
  phone: string;
  message: string;
  isGroup?: boolean;
}

export interface DeviceInfo {
  status: string;
  qrCode: string;
  phone: string;
}

export interface QRCodeResponse {
  status: boolean;
  data: {
    qr: string;
    token: string;
  };
}

export interface QRStatusResponse {
  status: 'pending' | 'connected' | 'error';
  message?: string;
}

export const wablasApi = {
  configure: (server: WablasServer, apiKey: string) => {
    setWablasConfig({ server, apiKey });
  },

  sendMessage: async (data: SendMessagePayload) => {
    try {
      const response = await api.post('/send-message', data);
      return response.data;
    } catch (error) {
      console.error('Send Message Error:', error);
      throw error;
    }
  },

  getDeviceInfo: async () => {
    try {
      const response = await api.get<DeviceInfo>('/device/info');
      return response.data;
    } catch (error) {
      console.error('Get Device Info Error:', error);
      throw error;
    }
  },

  getQRCode: async () => {
    try {
      const response = await api.get<QRCodeResponse>('/device/scan');
      if (!response.data?.data?.qr || !response.data?.data?.token) {
        throw new Error('Invalid QR code response format');
      }
      return response.data;
    } catch (error) {
      console.error('Get QR Code Error:', error);
      throw error;
    }
  },

  checkQRStatus: async (token: string) => {
    try {
      const response = await api.get<QRStatusResponse>(`/device/scan/status/${token}`);
      return response.data;
    } catch (error) {
      console.error('Check QR Status Error:', error);
      throw error;
    }
  },
};