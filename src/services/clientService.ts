import api from "./api";
import type {
  Cliente,
  CreateClienteRequest,
  UpdateClienteRequest,
} from "../types/client.types";

export const clienteService = {
  getAll: async (data: any): Promise<Cliente[]> => {
    try {
      const response = await api.post<any>("clients/listado", data); // Usar 'any' para flexibilidad en la respuesta
      // Aseguramos que siempre retornamos un arreglo, ya sea directamente de response.data o de response.data.data
      return Array.isArray(response.data) ? response.data : response.data?.data || [];
    } catch (error: any) {
      console.error(
        "API Error (GetAll):",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  getById: async (id: string): Promise<Cliente> => {
    try {
      const response = await api.get<Cliente>(`clients/obtener/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(
        "API Error (GetById):",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  create: async (data: CreateClienteRequest): Promise<Cliente[]> => {
    try {
      const formData = new FormData();
      formData.append("nombre", data.nombre);
      formData.append("apellidos", data.apellidos);
      formData.append("identificacion", data.identificacion);
      formData.append("celular", data.celular);
      formData.append("otroTelefono", data.otroTelefono);
      formData.append("direccion", data.direccion);
      formData.append("fNacimiento", data.fNacimiento);
      formData.append("fAfiliacion", data.fAfiliacion);
      formData.append("sexo", data.sexo);
      formData.append("resennaPersonal", data.resennaPersonal);
      formData.append("interesFK", data.interesFK);
      formData.append("usuarioId", data.usuarioId);

      if (data.imagen instanceof File) {
        formData.append("imagen", data.imagen);
      } else if (data.imagen) {
        formData.append("imagen", data.imagen);
      }
      console.log(formData);

      const response = await api.post<Cliente[]>("clients/crear", formData);
      return response.data;
    } catch (error: any) {
      console.error(
        "API Error (Create):",
        error.response?.data?.message || error.message,
      );
      throw error;
    }
  },

  update: async (id: string, data: UpdateClienteRequest) => {
    try {
      const formData = new FormData();
      formData.append("nombre", data.nombre);
      formData.append("apellidos", data.apellidos);
      formData.append("identificacion", data.identificacion);
      formData.append("celular", data.celular);
      formData.append("otroTelefono", data.otroTelefono);
      formData.append("direccion", data.direccion);
      formData.append("fNacimiento", data.fNacimiento);
      formData.append("fAfiliacion", data.fAfiliacion);
      formData.append("sexo", data.sexo);
      formData.append("resennaPersonal", data.resennaPersonal);
      formData.append("interesFK", data.interesFK);
      formData.append("usuarioId", data.usuarioId);

      if (data.imagen instanceof File) {
        formData.append("imagen", data.imagen);
      } else if (data.imagen) {
        formData.append("imagen", data.imagen);
      }

      const response = await api.put<Cliente>(
        `clients/actualizar/${id}`,
        formData,
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "API Error (Update):",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`clients/eliminar/${id}`);
    } catch (error: any) {
      console.error(
        "API Error (Delete):",
        error.response?.data || error.message,
      );
      throw error;
    }
  },
};
