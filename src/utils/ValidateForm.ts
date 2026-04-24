import * as yup from 'yup';

const passwordSchema = yup
  .string()
  .trim()
  .required('La contraseña es requerida')
  .min(10, 'La contraseña debe tener al menos 10 caracteres')
  .max(20, 'La contraseña no puede tener más de 20 caracteres');

export const LoginValidate = yup.object().shape({
  username: yup.string().trim().required('El usuario es requerido'),
  password: passwordSchema,
});

export const RegisterValidate = yup.object().shape({
  username: yup
    .string()
    .trim()
    .required('El nombre de usuario es requerido')
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(30, 'El nombre de usuario no puede tener más de 30 caracteres'),
  email: yup
    .string()
    .trim()
    .required('El correo electrónico es requerido')
    .email('Ingrese un correo electrónico válido'),
  password: passwordSchema,
});

export type LoginFormData = yup.InferType<typeof LoginValidate>;
export type RegisterFormData = yup.InferType<typeof RegisterValidate>;