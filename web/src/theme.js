import { createTheme } from "@mui/material/styles";
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/700.css";
const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "rgb(0, 3, 0)",
      paper: "rgb(0, 3, 0)",
    },
    primary: {
      main: "#1B5E20",
    },
    secondary: {
      main: "#6D4C41",
    },
    text: {
      primary: "#fff",
      secondary: "#fff",
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    button: {
      textTransform: "none",
    },
    h1: {
      fontFamily: "Poppins",
      fontWeight: 600,
      fontSize: 40,
    },
  },
});

export default theme;
