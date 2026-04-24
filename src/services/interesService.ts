import api from './api';
import type { Interes } from '../types/interes.types';

export const interesService = {
    getAll: async (): Promise<Interes[]> => {
        const response = await api.get<Interes[]>('api/intereses/listado');
        return response.data;
    },

};
