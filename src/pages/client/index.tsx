﻿import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Grid,
  CircularProgress,
  alpha,
  useTheme,
  Avatar,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from "@mui/material";

import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  
} from "@mui/icons-material";
import { keyframes } from "@mui/system";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { clienteService } from "../../services/clientService";
import { useAuth } from "../../context/AuthContext";
import { toast } from 'sonner';

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

interface Cliente {
  id?: string;
  _id?: string;
  identificacion: string;
  nombre: string;
  apellidos: string;
  sexo: "M" | "F" | string;
  imagen?: string;
}

const ClientePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);

  // Estado para el menú de acciones
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  useEffect(() => {
    const loadData = async () => {
      if (!user?.userid) return;
      setLoading(true);
      try {
        const response = await clienteService.getAll({ usuarioId: user.userid });
        setClientes(response);
      } catch (error) {
        console.error("Error al cargar clientes:", error);
         toast.error('Error al cargar clientes');
      } finally {
        setLoading(false);
      }
    }; 
        loadData();
    }, [user?.userid]);

  useEffect(() => {
    const loadData = async () => {
    // Solo cargamos datos si el usuario está plenamente identificado
    if (!user || !user.userid) return;
    }
    loadData();
  }, [user]);

 
  const handleEdit = () => {
    if (selectedId) navigate(`/cliente/editar/${selectedId}`);
    handleCloseMenu();
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    if (window.confirm("¿Está seguro de que desea eliminar este cliente?")) {
      try {
        await clienteService.delete(selectedId);
        toast.success('Cliente eliminado correctamente');
        //loadData();
      } catch (error) {
        console.error("Error al eliminar:", error);
        toast.error('Error al eliminar el cliente');
      }
    }
    handleCloseMenu();
  };

  const clientesFiltrados = useMemo(
    () =>
      clientes.filter(
        (c) =>
          c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
          c.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
          c.identificacion.toLowerCase().includes(busqueda.toLowerCase()),
      ),
    [clientes, busqueda],
  );

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        animation: `${fadeInUp} 0.6s ease-out forwards`,
        px: { xs: 2, md: 0 }, // Espaciado lateral preventivo en móviles
      }}
    >
      <Stack 
        direction={{ xs: "column", md: "row" }} 
        sx={{ mb: 1, width: "100%", alignItems: { xs: "flex-start", md: "center" }, gap: { xs: 1, md: 0 } }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "1.75rem", md: "2.125rem" },
            letterSpacing: "-0.03em",
            color: "text.primary",
          }}
        >
          Gestión de Clientes
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Typography
          variant="body2"
          sx={{
            textAlign: { xs: "left", md: "right" },
            fontWeight: 500,
            color: "text.secondary",
            opacity: 0.7,
            display: { xs: "none", md: "block" },
          }}
        >
          Visualice y administre la información estratégica de su cartera
        </Typography>
      </Stack>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        
        spacing={2}
        sx={{ mb: 2, width: "100%", alignItems: { xs: "stretch", sm: "center" } }}
      >
        <TextField
          placeholder="Buscar cliente por nombre o identificación..."
          variant="outlined"
          size="small"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          sx={{
            width: { xs: "100%", sm: 420 },
            "& .MuiOutlinedInput-root": {
              borderRadius: "14px",
              bgcolor: alpha(theme.palette.background.paper, 0.5),
              "&:hover": { bgcolor: "background.paper" },
              "&.Mui-focused": { bgcolor: "background.paper" },
            },
          }}
          slotProps={{ 
            input: {
            startAdornment: 
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.disabled", fontSize: "1.1rem" }} />
              </InputAdornment>
            },
          
          }}
        />

        <Box sx={{ flexGrow: 1 }} />

        <Stack 
          direction={{ xs: "column", sm: "row" }} 
          spacing={1.5} 
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/dashboard")}
              sx={{ borderRadius: 2, px: 3, py: 1, fontWeight: 700, 
              textTransform: 'none', width: { xs: '100%', sm: 'auto' } }}
            // sx={{
            //   borderRadius: "12px",
            //   px: 2,
            //   fontWeight: 600,
            //   textTransform: "none",
            //   borderColor: alpha(theme.palette.divider, 0.5),
            //   color: "text.primary",
            //   bgcolor: "background.paper",
            //   "&:hover": {
            //     bgcolor: alpha(theme.palette.action.hover, 0.04),
            //     borderColor: theme.palette.divider,
            //   },
            // }}
          >
            Regresar
          </Button>
          <Button
            variant="contained"
            disableElevation
            startIcon={<AddIcon />}
            onClick={() => navigate("/cliente/nuevo")}
              sx={{ borderRadius: 2, px: 3, py: 1, fontWeight: 700, 
              textTransform: 'none', width: { xs: '100%', sm: 'auto' } }}
          >
            Nuevo Cliente
          </Button>
        </Stack>
      </Stack>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "16px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
          border: "1px solid",
          borderColor: alpha(theme.palette.divider, 0.1),
          overflowX: "auto",
          width: "100%",
          display: { xs: 'none', sm: 'block' }, // Hide on xs, show on sm and up
        }}
      >
        <Table sx={{ minWidth: 650 }}> {/* Increased minWidth for better table display on smaller desktops/tablets */}
          <TableHead sx={{ bgcolor: alpha(theme.palette.action.hover, 0.5) }}>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                  fontSize: "0.85rem",
                }}
              >
                IDENTIFICACIÓN
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                  fontSize: "0.85rem",
                }}
              >
                NOMBRE COMPLETO
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                  fontSize: "0.85rem",
                  // display: { xs: "none", sm: "table-cell" }, // This was already there, but now the whole table is hidden on xs
                }}
              >
                GÉNERO
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                  fontSize: "0.85rem",
                }}
                align="right"
              >
                ACCIONES
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : (
              clientesFiltrados.map((row) => (
                <TableRow
                  key={row.id || row._id || row.identificacion}
                  sx={{
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.02),
                      transition: "background-color 0.2s ease",
                    },
                  }}
                >
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, color: "text.secondary" }}
                    >
                      {row.identificacion}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2} sx={{alignItems:"center"}}>
                      <Avatar
                        src={row.imagen}
                        sx={{
                          width: 36,
                          height: 36,
                          fontSize: "0.875rem",
                          bgcolor: row.imagen ? 'transparent' : alpha(theme.palette.primary.main, 0.1),
                          color: "primary.main",
                          fontWeight: 700,
                        }}
                      >
                        {row.nombre.charAt(0)}
                      </Avatar>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "text.primary" }}
                      >
                        {`${row.nombre} ${row.apellidos}`}
                      </Typography>
                    </Stack>
                  </TableCell>
                <TableCell> {/* Removed conditional display here as the whole table is hidden on xs */}
                    <Chip
                      label={row.sexo === "M" ? "Masculino" : "Femenino"}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        borderRadius: "8px",
                        bgcolor:
                          row.sexo === "M"
                            ? alpha(theme.palette.info.main, 0.1)
                            : alpha(theme.palette.error.main, 0.1),
                        color:
                          row.sexo === "M"
                            ? theme.palette.info.dark
                            : theme.palette.error.dark,
                        border: `1px solid ${
                          row.sexo === "M"
                            ? alpha(theme.palette.info.main, 0.2)
                            : alpha(theme.palette.error.main, 0.2)
                        }`,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(e) => handleOpenMenu(e, row.id || row._id || row.identificacion)}
                      sx={{ color: "text.secondary" }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Card View (for xs only) */}
      <Grid container spacing={2} sx={{ display: { xs: 'flex', sm: 'none' } }}> {/* Show on xs, hide on sm and up */}
        {loading ? (
          <Grid size={{ xs: 12 }} sx={{ textAlign: 'center', py: 3 }}>
            <CircularProgress size={24} />
          </Grid>
        ) : (
          clientesFiltrados.map((row) => (
            <Grid size={{ xs: 12 }} key={row.id || row._id || row.identificacion}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: "16px",
                  borderColor: alpha(theme.palette.divider, 0.1),
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                    transition: "background-color 0.2s ease",
                  },
                }}
              >
                <Stack direction="row" sx={{alignItems:"center", justifyContent:"space-between"}} >
                  <Stack direction="row" spacing={1.5} sx={{alignItems:"center"}}>
                    <Avatar
                      src={row.imagen}
                      sx={{
                        width: 40,
                        height: 40,
                        fontSize: "1rem",
                        bgcolor: row.imagen ? 'transparent' : alpha(theme.palette.primary.main, 0.1),
                        color: "primary.main",
                        fontWeight: 700,
                      }}
                    >
                      {row.nombre.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "text.primary" }}>
                        {`${row.nombre} ${row.apellidos}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ID: {row.identificacion}
                      </Typography>
                    </Box>
                  </Stack>
                  <IconButton
                    size="small"
                    onClick={(e) => handleOpenMenu(e, row.id || row._id || row.identificacion)}
                    sx={{ color: "text.secondary" }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Stack>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Chip
                    label={row.sexo === "M" ? "Masculino" : "Femenino"}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      borderRadius: "8px",
                      bgcolor:
                        row.sexo === "M"
                          ? alpha(theme.palette.info.main, 0.1)
                          : alpha(theme.palette.error.main, 0.1),
                      color:
                        row.sexo === "M"
                          ? theme.palette.info.dark
                          : theme.palette.error.dark,
                      border: `1px solid ${
                        row.sexo === "M"
                          ? alpha(theme.palette.info.main, 0.2)
                          : alpha(theme.palette.error.main, 0.2)
                      }`,
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
          ))
        )}
      </Grid>

      {/* Menú de Acciones Ejecutivo */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "12px",
              minWidth: 150,
              boxShadow: "0px 10px 25px rgba(0,0,0,0.1)",
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            },
          },
        }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Editar"
            // slotProps={{ primaryTypographyProps: { variant: "body2", fontWeight: 500 } }}
          />
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText
            primary="Eliminar"
            // primaryTypographyProps={{ variant: "body2", fontWeight: 500 }}
          />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ClientePage;
