import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  MenuItem,
  Avatar,
  IconButton,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
import {
  PhotoCamera as PhotoCameraIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { keyframes } from "@mui/system";
import { useAuth } from "../../context/AuthContext"; // Importar useAuth
import { toast } from "sonner";
import { clienteService } from "../../services/clientService";
import { interesService } from "../../services/interesService"; // Importar interesService
import type { Interes } from "../../types/interes.types"; // Importar el tipo Interes
import type { CreateClienteRequest } from "../../types/client.types";

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ClientCreatePage = () => {
  const { user } = useAuth(); // Obtener el usuario para el token
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [loadingIntereses, setLoadingIntereses] = useState(true); // Estado para la carga de intereses
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [intereses, setIntereses] = useState<Interes[]>([]); // Estado para almacenar los intereses

  const [formData, setFormData] = useState<CreateClienteRequest>({
    nombre: "",
    apellidos: "",
    identificacion: "",
    celular: "", 
    otroTelefono: "",
    direccion: "",
    fNacimiento: "",
    fAfiliacion: new Date().toISOString().split("T")[0],
    sexo: "",
    resennaPersonal: "", 
    interesFK: "", 
    imagen: "",
    usuarioId: user?.userid || "", 
  });

  // Efecto para cargar los intereses desde el backend
  useEffect(() => {
    const fetchIntereses = async () => {
      if (!user?.userid) return;
      setLoadingIntereses(true);
      try {
        const fetchedIntereses = await interesService.getAll(user.userid);
        // Aseguramos que intereses siempre sea un arreglo para evitar el crash del .map()
        const interesesArray = Array.isArray(fetchedIntereses) ? fetchedIntereses : (fetchedIntereses as any)?.data || [];
        setIntereses(interesesArray);
      } catch (error) {
        console.error("Error al cargar intereses:", error);
        toast.error("No se pudieron cargar los intereses");
      } finally {
        setLoadingIntereses(false);
      }
    };
    fetchIntereses();
  }, [user?.userid]); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData((prev) => ({ ...prev, imagen: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await clienteService.create(formData);
      toast.success("Cliente creado exitosamente");
      navigate("/dashboard");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error al crear el cliente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4, animation: `${fadeInUp} 0.6s ease-out` }}>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton 
          onClick={() => navigate(-1)} 
          sx={{ 
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            zIndex: 10, // Asegura que sea clickable en móviles
            position: 'relative'
          }}
        >
          <ArrowBackIcon color="primary" />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
          Nuevo Cliente
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Sección de Imagen */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper variant="outlined" sx={{ p: 3, textAlign: "center", borderRadius: 4, height: "100%" }}>
              <Stack sx={{ alignItems: "center", spacing: 2 }}>
                <Avatar
                  src={imagePreview || ""}
                  sx={{ width: 120, height: 120, mb: 2, bgcolor: alpha(theme.palette.primary.main, 0.1) }}
                >
                  {!imagePreview && <PersonAddIcon sx={{ fontSize: 60, color: "primary.main" }} />}
                </Avatar>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<PhotoCameraIcon />}
                  sx={{ borderRadius: 2, textTransform: "none" }}
                >
                  Subir Foto
                  <input hidden accept="image/*" type="file" onChange={handleImageChange} />
                </Button>
                <Typography variant="caption" color="text.secondary">
                  JPG, PNG o WEBP. Máximo 2MB.
                </Typography>
              </Stack>
            </Paper>
          </Grid>

          {/* Información Personal */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper variant="outlined" sx={{ p: 4, borderRadius: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Información Básica</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Nombre" name="nombre" required value={formData.nombre} onChange={handleChange} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Apellidos" name="apellidos" required value={formData.apellidos} onChange={handleChange} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Identificación" name="identificacion" required value={formData.identificacion} onChange={handleChange} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    select
                    label="Sexo"
                    name="sexo"
                    required
                    value={formData.sexo}
                    onChange={handleChange}
                  >
                    <MenuItem value="M">Masculino</MenuItem>
                    <MenuItem value="F">Femenino</MenuItem>
                    <MenuItem value="O">Otro</MenuItem>
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Fecha de Nacimiento"
                    name="fNacimiento"
                    required
                    // InputLabelProps={{ shrink: true }}
                    value={formData.fNacimiento}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Fecha de Afiliación"
                    name="fAfiliacion"
                    required
                    // InputLabelProps={{ shrink: true }}
                    value={formData.fAfiliacion}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Contacto e Intereses */}
          <Grid size={{ xs: 12 }}>
            <Paper variant="outlined" sx={{ p: 4, borderRadius: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Contacto y Preferencias</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField fullWidth label="Celular" name="celular" required value={formData.celular} onChange={handleChange} />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField fullWidth label="Otro Teléfono" name="otroTelefono" value={formData.otroTelefono} onChange={handleChange} />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    select
                    label="Interés Principal"
                    name="interesFK" // Cambiado a interesFK
                    required
                    value={formData.interesFK}
                    onChange={handleChange}
                    disabled={loadingIntereses} // Deshabilitar mientras se cargan
                  >
                    {loadingIntereses ? (
                      <MenuItem disabled>Cargando intereses...</MenuItem>
                    ) : (
                      intereses.map((opt) => (
                        <MenuItem key={opt.id} value={opt.id}>{opt.nombre}</MenuItem>
                      ))
                    )}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Dirección" name="direccion" required value={formData.direccion} onChange={handleChange} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Reseña Personal" // Mantener label como "Reseña Personal"
                    name="resennaPersonal" // Cambiado a resennaPersonal
                    required
                    value={formData.resennaPersonal} // Corregido el nombre de la propiedad
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 3 }}>
          <Button variant="outlined" onClick={() => navigate(-1)} disabled={loading} sx={{ borderRadius: 2, px: 4 }}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={<SaveIcon />}
            sx={{ borderRadius: 2, px: 4, boxShadow: "none" }}
          >
            {loading ? "Guardando..." : "Crear Cliente"}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default ClientCreatePage;