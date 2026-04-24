import type { Interes } from './interes.types';

export type GeneroType = 'M' | 'F';

export const Generos = {
    Masculino: 'M' as GeneroType,
    Femenino: 'F' as GeneroType
};

export interface Cliente {
  id: string; // UUID generado automáticamente
  nombre: string; // tamaño máximo 50
  apellidos: string; // tamaño máximo 100
  identificacion: string; // tamaño máximo 20
  telefonoCelular: string; // tamaño máximo 20
  otroTelefono: string; // tamaño máximo 20
  direccion: string; // tamaño máximo 200
  fNacimiento: string; // formato ISO 8601 (YYYY-MM-DD)
  fAfiliacion: string; // formato ISO 8601 (YYYY-MM-DD)
  sexo: GeneroType; // tamaño máximo 1
  resenaPersonal: string; // tamaño máximo 200
  imagen: string; // base64 de la imagen
  interesId: string; // UUID del interés
  interes?: Interes; // Detalles del interés asociado
}

export interface CreateClienteRequest {
  nombre: string; // tamaño máximo 50
  apellidos: string; // tamaño máximo 100
  identificacion: string; // tamaño máximo 20
  telefonoCelular: string; // tamaño máximo 20
  otroTelefono: string; // tamaño máximo 20
  direccion: string; // tamaño máximo 200
  fNacimiento: string; // formato ISO 8601 (YYYY-MM-DD)
  fAfiliacion: string; // formato ISO 8601 (YYYY-MM-DD)
  sexo: GeneroType; // tamaño máximo 1
  resenaPersonal: string; // tamaño máximo 200
  imagen: File | string; // archivo de la imagen
  interesFK: string; // UUID del interés
  usuarioId: string; // UUID del usuario asociado
}

export interface UpdateClienteRequest {
  id: string; // UUID del cliente a actualizar
  nombre: string; // tamaño máximo 50
  apellidos: string; // tamaño máximo 100
  identificacion: string; // tamaño máximo 20
  telefonoCelular: string; // tamaño máximo 20
  otroTelefono: string; // tamaño máximo 20
  direccion: string; // tamaño máximo 200
  fNacimiento: string; // formato ISO 8601 (YYYY-MM-DD)
  fAfiliacion: string; // formato ISO 8601 (YYYY-MM-DD)
  sexo: GeneroType; // tamaño máximo 1
  resenaPersonal: string; // tamaño máximo 200
  imagen: File | string; // archivo de la imagen
  interesFK: string; // UUID del interés
  usuarioId: string; // UUID del usuario asociado
}
