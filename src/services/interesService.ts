import axios from 'axios';
import type { Interes } from '../types/interes.types';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const interesService = {
  getAll: async (token: string): Promise<Interes[]> => {
    const response = await axios.get(`${API_URL}/api/intereses/listado`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Retornamos el arreglo de datos o el objeto de respuesta si el backend cambia la estructura
    return response.data?.data || response.data || []; 
  },
};