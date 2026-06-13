import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { useThemeSettings } from "./theme/Theme";
import { RouterProvider } from "react-router";
import router from "./router/Router";
// import Spinner from "./views/spinner/Spinner";

function App() {
  const theme = useThemeSettings();
  // const customizer = useSelector((state: any) => state.customizer)
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App