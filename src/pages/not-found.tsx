import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ErrorOutlineIcon sx={{ fontSize: 90, color: "primary.main" }} />
          <Typography
            variant="h1"
            sx={{
              fontWeight: 700,
              color: "primary.main",
              fontSize: { xs: "4rem", md: "6rem" },
              lineHeight: 1,
            }}
          >
            404
          </Typography>
        </Box>

        <Typography
          variant="h5"
          sx={{
            mt: 1.5,
            fontWeight: 700,
            color: "text.secondary",
          }}
        >
          Oops... Page Not Found!
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/dashboard")}
          sx={{ mt: 3, px: 3 }}
        >
          Volver al inicio
        </Button>
      </Box>
    </Box>
  );
};

export default NotFound;