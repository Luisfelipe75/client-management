import {
  Avatar,
  Box,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Paper,
  Typography,
  Checkbox,
  Button,
  Grid,
  Link,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link as RouterLink } from "react-router-dom";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import React, { useState } from "react";
import * as yup from "yup"; // Esta línea es IMPRESCINDIBLE para el bloque catch
import { keyframes } from "@mui/system";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { LoginValidate, type LoginFormData } from "../../utils/ValidateForm";

const fadeInUp = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const rememberedUsername = localStorage.getItem("rememberedUsername") || "";
  const [formData, setFormData] = useState<LoginFormData>({
    username: rememberedUsername,
    password: "",
  });
  const [remember, setRemember] = useState<boolean>(() => !!rememberedUsername);
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors((current) => ({
      ...current,
      [name]: undefined,
    }));
  };

  const from = location.state?.from?.pathname || "/";
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await LoginValidate.validate(formData, { abortEarly: false });
      setErrors({});
      console.log("Datos del formulario:", formData);
      await login(formData);

      if (remember) {
        localStorage.setItem("rememberedUsername", formData.username);
      } else {
        localStorage.removeItem("rememberedUsername");
      }

      navigate(from, { replace: true });
    } catch (error: unknown) {
      if (error instanceof yup.ValidationError) {
        const validationErrors: Partial<Record<keyof LoginFormData, string>> = {};
        error.inner.forEach((err) => {
          if (err.path) validationErrors[err.path as keyof LoginFormData] = err.message;
        });
        setErrors(validationErrors);
        toast.error("Corrige los campos marcados para continuar.");
      } else {
        console.error("Error en login:", error);
        toast.error("Error al iniciar sesión. Revisa tus credenciales.");
      }
    } finally {
      setLoading(false);
    }
  };

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Container maxWidth="xs" sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      animation: `${fadeInUp} 0.6s ease-out forwards`
    }}>
      <Paper elevation={0} sx={{ 
        padding: 4, 
        borderRadius: 4, 
        border: '1px solid', 
        borderColor: 'divider',
        width: '100%',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
      }}>
        <Avatar
          sx={{ mx: "auto", bgcolor: "primary.main", mb: 2, width: 56, height: 56 }}
        >
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h4" sx={{ textAlign: "center", fontWeight: 800, mb: 3, letterSpacing: '-0.02em' }}>
          Iniciar Sesión
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <FormControl fullWidth sx={{ mb: 2 }} variant="outlined" error={Boolean(errors.username)}>
            <InputLabel required>Usuario</InputLabel>
            <OutlinedInput
              id="outlined-search"
              name="username"
              label="Usuario"
              type="text"
              autoFocus
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username ? <FormHelperText>{errors.username}</FormHelperText> : null}
          </FormControl>

          <FormControl fullWidth variant="outlined" error={Boolean(errors.password)}>
            <InputLabel required htmlFor="outlined-adornment-password">
              Contraseña
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword
                        ? "hide the password"
                        : "display the password"
                    }
                    onClick={handleClickShowPassword}
                    onMouseDown={(e) => e.preventDefault()} // Simplified
                    onMouseUp={(e) => e.preventDefault()} // Simplified
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Contraseña"
              onChange={handleChange}
            />
            {errors.password ? <FormHelperText>{errors.password}</FormHelperText> : null}
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
                color="primary"
              />
            }
            label="Recuérdame"
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ 
              mt: 3, 
              py: 1.5, 
              fontWeight: 700, 
              borderRadius: 3,
              boxShadow: 'none' 
            }}
            disabled={loading}
          >
            {loading ? "Iniciando sesión..." : "INICIAR SESIÓN"}
          </Button>
        </Box>
        <Grid  sx={{ mt: 3 }}>
          <Grid>
            <Typography component="span" variant="body2" color="text.secondary">¿No tiene una cuenta? </Typography>
            <Link component={RouterLink} to="/register" underline="none" sx={{ fontWeight: 700 }}> {/* Removed variant prop */}
              Regístrese
            </Link>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default LoginPage;
