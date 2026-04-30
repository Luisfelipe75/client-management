import { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  Avatar,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  useMediaQuery,
  CssBaseline,
  Tooltip,
} from "@mui/material";
import { useTheme, ThemeProvider, createTheme, alpha } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const drawerWidth = 280;
const miniDrawerWidth = 80;

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const outerTheme = useTheme();
  const isMobile = useMediaQuery(outerTheme.breakpoints.down("md"));

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mode, setMode] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark" ? "dark" : "light";
  });

  const open = isMobile ? mobileOpen : !collapsed;

  useEffect(() => {
    document.body.classList.toggle("dark-mode", mode === "dark");
    return () => {
      document.body.classList.remove("dark-mode");
    };
  }, [mode]);

  const appTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: mode === "dark" ? "#93c5fd" : "#1d4ed8" },
          secondary: { main: mode === "dark" ? "#38bdf8" : "#0ea5e9" },
          background: {
            default: mode === "dark" ? "#0f172a" : "#f8fafc",
            paper: mode === "dark" ? "#111827" : "#ffffff",
          },
          text: {
            primary: mode === "dark" ? "#e2e8f0" : "#0f172a",
            secondary: mode === "dark" ? "#cbd5e1" : "#475569",
          },
          divider: mode === "dark" ? "rgba(148, 163, 184, 0.24)" : "rgba(15, 23, 42, 0.12)",
          action: {
            hover: mode === "dark" ? "rgba(148, 163, 184, 0.12)" : "rgba(59, 130, 246, 0.08)",
            selected: mode === "dark" ? "rgba(59, 130, 246, 0.16)" : "rgba(59, 130, 246, 0.12)",
          },
        },
        typography: {
          fontFamily: '"JetBrains Mono", "Segoe UI", sans-serif',
          fontWeightRegular: 400,
          fontWeightMedium: 500,
          fontWeightBold: 700,
          h1: { fontWeight: 800 },
          h2: { fontWeight: 700 },
          h3: { fontWeight: 700 },
          h4: { fontWeight: 800 },
          h5: { fontWeight: 700 },
          h6: { fontWeight: 700 },
          button: { textTransform: "none" },
        },
        shape: { borderRadius: 16 },
        components: {
          MuiButton: { styleOverrides: { root: { borderRadius: 18 } } },
          MuiPaper: { styleOverrides: { root: { borderRadius: 20 } } },
          MuiInputBase: { styleOverrides: { root: { borderRadius: 16 } } },
          MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 16 } } },
          MuiTableCell: { styleOverrides: { root: { borderBottom: "none" } } },
        },
      }),
    [mode]
  );

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen((prev) => !prev);
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleDarkMode = () => {
    setMode((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      return next;
    });
  };

  const isActive = (path: string) => location.pathname === path;
  const avatarLetter = user?.username?.[0]?.toUpperCase() || "U";

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Box sx={{ 
        display: "flex", 
        minHeight: "100vh", 
        width: "100%", 
        bgcolor: "background.default", 
        backgroundImage: mode === 'light'
          ? `linear-gradient(180deg, ${alpha(appTheme.palette.primary.main, 0.03)} 0%, ${appTheme.palette.background.default} 100%)`
          : 'none'
      }}>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            zIndex: (t) => t.zIndex.drawer + 1,
            bgcolor: mode === "light" ? "primary.main" : "background.paper",
            color: mode === "light" ? "common.white" : "text.primary",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between", minHeight: 72 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Tooltip title={open ? "Minimizar menú" : "Expandir menú"}>
                <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
                  <MenuIcon />
                </IconButton>
              </Tooltip>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  INNOVASOFT S.A
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              
              <Tooltip title="Cambiar tema">
                <IconButton color="inherit" onClick={toggleDarkMode}>
                  {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Cerrar sesión">
                <IconButton color="inherit" onClick={handleLogout}>
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
              {/* <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "info.main",
                  color: "common.white",
                  fontSize: 16,
                }}
              >
                {avatarLetter}
              </Avatar> */}
            </Box>
          </Toolbar>
        </AppBar>

        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={open}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            width: open ? drawerWidth : miniDrawerWidth,
            flexShrink: 0,
            whiteSpace: "nowrap",
            "& .MuiDrawer-paper": {
              width: open ? drawerWidth : miniDrawerWidth,
              boxSizing: "border-box",
              background: mode === 'light'
                ? `linear-gradient(180deg, #ffffff 0%, ${alpha(appTheme.palette.primary.main, 0.04)} 100%)`
                : `linear-gradient(180deg, ${appTheme.palette.background.paper} 0%, ${alpha('#000000', 0.2)} 100%)`,
              borderRight: 1,
              borderColor: "divider",
              overflowX: "hidden",
            },
          }}
        >
          <Toolbar
            sx={{
              justifyContent: open ? "space-between" : "center",
              px: 2,
            }}
          >
            {open ? (
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Menú
              </Typography>
            ) : null}
            {!isMobile ? (
              <IconButton onClick={handleDrawerToggle}>
                {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>
            ) : null}
          </Toolbar>

          <Divider />

          <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, justifyContent: open ? "flex-start" : "center" }}>
              <Avatar sx={{ width: 56, height: 56, bgcolor: "info.main", color: "common.white", fontSize: 24 }}>
                {avatarLetter}
              </Avatar>
              {open ? (
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {user?.username || "Usuario"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  </Typography>
                </Box>
              ) : null}
            </Box>

            {open ? <Divider /> : null}

            <List>
              <ListItemButton
                selected={isActive("/dashboard")}
                onClick={() => handleNavigate("/dashboard")}
                sx={{ justifyContent: open ? "initial" : "center", px: open ? 2 : 1.5 }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <HomeIcon fontSize="small" />
                </ListItemIcon>
                {open ? <ListItemText primary="Inicio" /> : null}
              </ListItemButton>
              <ListItemButton
                selected={isActive("/clientes")}
                onClick={() => handleNavigate("/clientes")}
                sx={{ justifyContent: open ? "initial" : "center", px: open ? 2 : 1.5 }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <PeopleIcon fontSize="small" />
                </ListItemIcon>
                {open ? <ListItemText primary="Clientes" /> : null}
              </ListItemButton>
            </List>
          </Box>
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minHeight: "100vh",
            bgcolor: "background.default",
            px: { xs: 1, md: 2 },
            py: { xs: 2, md: 3 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "stretch",
            transition: (t) => t.transitions.create(['margin', 'width'], {
              easing: t.transitions.easing.sharp,
              duration: t.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Toolbar />
            <Box
              sx={{
                width: "100%",
                maxWidth: "100%",
                minHeight: "100%",
                bgcolor: mode === 'light' ? alpha('#ffffff', 0.8) : alpha(appTheme.palette.background.paper, 0.9),
                backdropFilter: 'blur(8px)',
                borderRadius: 4,
                border: 1,
                borderColor: "divider",
                boxShadow: '0 8px 32px rgba(0,0,0,0.04)',
                p: { xs: 2, md: 3 },
                overflow: "hidden",
                flexGrow: 1,
              }}
            >
              <Outlet />
            </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;