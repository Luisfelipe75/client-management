import React from 'react';
export const LoginPage = React.lazy(()=> import('./login'))
export const RegisterPage = React.lazy(()=> import('./register'))
export const DashboardPage = React.lazy(()=> import('./dashboard'))
export const ClientePage = React.lazy(()=> import('./client'))
export const ClientCreatePage = React.lazy(()=> import('./clientDetail'))