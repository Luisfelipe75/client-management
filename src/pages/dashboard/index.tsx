import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { clienteService } from "../../services/clientService";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Stack, 
  Button, 
  alpha, 
  useTheme 
} from "@mui/material";
import { 
  Add as AddIcon,
  People as PeopleIcon,
  Engineering as EngineeringIcon, 
  Speed as SpeedIcon, 
  ShieldOutlined as ShieldIcon, 
  AutoGraph as GraphIcon,
  ArrowForward as ArrowIcon,
  RocketLaunch as RocketIcon
} from "@mui/icons-material";
import { keyframes } from "@mui/system";

// Animaciones personalizadas
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [metrics, setMetrics] = useState({ clients: 0, tasks: 24, health: 98 });

  // Efecto para simular la actualización de métricas o cargar datos reales
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user?.userid) return;
      try {
        // Obtenemos los clientes para actualizar el contador real
        const clientsData = await clienteService.getAll({ usuarioId: user.userid });
        // Validación robusta para asegurar que tratamos con un arreglo
        const clientsArray = Array.isArray(clientsData) ? clientsData : (clientsData as any)?.data || [];
        setMetrics(prev => ({
          ...prev,
          clients: clientsArray.length
        }));
      } catch (error) {
        console.error("Error al cargar métricas para el dashboard:", error);
      }
    };
    loadDashboardData();
  }, [user?.userid]);

  const promoCards = [
    {
      title: "Optimización de Datos",
      desc: "Mantenimiento preventivo de bases de datos para garantizar velocidad de respuesta.",
      icon: <SpeedIcon fontSize="large" />,
      color: theme.palette.primary.main
    }, 
    {
      title: "Seguridad Blindada",
      desc: "Auditorías semanales de acceso y encriptación de información sensible de clientes.",
      icon: <ShieldIcon fontSize="large" />,
      color: theme.palette.success.main 
    },
    {
      title: "Escalabilidad Pro",
      desc: "Preparamos su estructura para el crecimiento masivo sin pérdida de rendimiento.",
      icon: <GraphIcon fontSize="large" />,
      color: theme.palette.warning.main 
    }
  ];

  return (
    <Box sx={{ 
      width: "100%", 
      display: "flex", 
      flexDirection: "column", 
      gap: { xs: 2, md: 4 }, // Reducimos el espacio entre secciones en móvil
      px: { xs: 2, sm: 3, md: 0 }, // Padding lateral para contener los márgenes de los Grids
      background: theme.palette.mode === 'light' ? `radial-gradient(circle at top right, ${alpha(theme.palette.primary.main, 0.05)}, transparent 400px)` : 'none',
      borderRadius: 4
    }}>
      {/* Header de Bienvenida */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 2
      }}>
        <Stack sx={{ spacing: 0 }}>
          <Typography variant="h4" sx={{
            fontWeight: 800, 
            letterSpacing: '-0.02em',
            fontSize: { xs: '1.5rem', sm: '2.125rem' }, // Reducimos un poco más en móviles muy pequeños
            wordBreak: 'break-word' // Evita que nombres largos corten el flujo
          }}>
            Hola, {user?.username} 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Este es el estado actual de su ecosistema de clientes.
          </Typography>
        </Stack>
        <Stack 
          direction={{ xs: "column", sm: "row" }} 
          spacing={1.5} 
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          <Button 
            variant="outlined" 
            startIcon={<AddIcon />}
            sx={{ borderRadius: 2, px: 3, py: 1, fontWeight: 700, 
              textTransform: 'none', width: { xs: '100%', sm: 'auto' } }}
            onClick={() => navigate("/cliente/nuevo")}
          >
            Nuevo Cliente
          </Button>
          <Button 
            variant="contained" 
            startIcon={<EngineeringIcon />}
            sx={{ borderRadius: 2, px: 3, py: 1, boxShadow: 'none', textTransform: 'none', width: { xs: '100%', sm: 'auto' } }}
            onClick={() => navigate("/cliente/solicitud-soporte")}
          >
            Solicitar Soporte
          </Button>
        </Stack>
      </Box>

      {/* Cuadros de Métricas Animados */}
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {[
          { label: "Clientes Totales", val: metrics.clients, icon: <PeopleIcon />, color: theme.palette.info.main },
          { label: "Salud del Sistema", val: `${metrics.health}%`, icon: <RocketIcon />, color: "#3b82f6" },
          { label: "Tareas de Limpieza", val: metrics.tasks, icon: <EngineeringIcon />, color: "#8b5cf6" },
        ].map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.label}>
            <Paper
              variant="outlined"
              onClick={() => item.label === "Clientes Totales" && navigate("/clientes")}
              sx={{
                p: { xs: 2, sm: 3 }, // Padding interno más pequeño en móvil
                borderRadius: 4,
                textAlign: 'center',
                animation: `${pulse} 4s infinite ease-in-out`,
                borderColor: alpha(item.color, 0.3),
                bgcolor: alpha(item.color, 0.02),
                cursor: item.label === "Clientes Totales" ? 'pointer' : 'default',
                '&:hover': {
                  bgcolor: item.label === "Clientes Totales" ? alpha(item.color, 0.05) : alpha(item.color, 0.02),
                  borderColor: item.label === "Clientes Totales" ? item.color : alpha(item.color, 0.3),
                }
              }}
            >
              <Box sx={{ color: item.color, mb: 1 }}>{item.icon}</Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>{item.val}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                {item.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Propaganda: Tarjetas de Mantenimiento */}
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          Mantenimiento de Elite para sus Clientes
        </Typography>
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {promoCards.map((card, i) => (
          <Grid size={{ xs: 12, md: 4 }} key={card.title}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, sm: 4 }, // Reducimos padding interno
                  height: '100%',
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s ease',
                  animation: `${float} ${3 + i}s infinite ease-in-out`,
                  '&:hover': {
                    borderColor: card.color,
                    transform: 'scale(1.02)',
                    boxShadow: `0 10px 30px ${alpha(card.color, 0.1)}`,
                    bgcolor: alpha(card.color, 0.01)
                  }
                }}
              >
                <Box 
                  sx={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: 2, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    bgcolor: alpha(card.color, 0.1),
                    color: card.color,
                    mb: 3
                  }}
                >
                  {card.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                  {card.desc}
                </Typography>
                <Button 
                  endIcon={<ArrowIcon />} 
                  sx={{ color: card.color, fontWeight: 700, p: 0, '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
                >
                  Saber más
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Cuadro Animado Final (Banner) */}
      <Box
        sx={{
          p: 4,
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden',
          width: "100%",
          background: `linear-gradient(-45deg, #1d4ed8, #93c5fd, #1e40af, #60a5fa)`,
          backgroundSize: '400% 400%',
          animation: `${gradientMove} 10s ease infinite`,
          color: 'white',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 3
        }}
      >
        <Stack sx={{ spacing: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            ¿Su base de datos se siente pesada?
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Realice una limpieza profunda de registros obsoletos y mejore la carga de su aplicación en un 40%.
          </Typography>
        </Stack>
        <Button 
          variant="contained" 
          sx={{ 
            bgcolor: 'white', 
            color: 'primary.main', 
            fontWeight: 800,
            px: 4,
            '&:hover': { bgcolor: alpha('#ffffff', 0.9) }
         }}
         onClick={() => navigate("/cliente/optimizar")}
        >
          OPTIMIZAR AHORA
        </Button>
      </Box>
    </Box>
  );
};
export default DashboardPage;
