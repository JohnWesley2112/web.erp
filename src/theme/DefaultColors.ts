const baselightTheme = {
  direction: "ltr",
  palette: {
    primary: {
      main: "#5D87FF",
      light: "#ECF2FF",
      dark: "#4570EA",
    },
    secondary: {
      main: "#49BEFF",
      light: "#E8F7FF",
      dark: "#23afdb",
    },
    success: {
      main: "#13DEB9",
      light: "#E6FFFA",
      dark: "#02b3a9",
      contrastText: "#ffffff",
    },
    info: {
      main: "#539BFF",
      light: "#EBF3FE",
      dark: "#1682d4",
      contrastText: "#ffffff",
    },
    error: {
      main: "#FA896B",
      light: "#FDEDE8",
      dark: "#f3704d",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#FFAE1F",
      light: "#FEF5E5",
      dark: "#ae8e59",
      contrastText: "#ffffff",
    },
    purple: {
      A50: "#EBF3FE",
      A100: "#6610f2",
      A200: "#557fb9",
    },
    grey: {
      100: "#F2F6FA",
      200: "#EAEFF4",
      300: "#DFE5EF",
      400: "#7C8FAC",
      500: "#5A6A85",
      600: "#2A3547",
    },
    text: {
      primary: "#2A3547",
      secondary: "#2A3547",
    },
    action: {
      disabledBackground: "rgba(73,82,88,0.12)",
      hoverOpacity: 0.02,
      hover: "#f6f9fc",
    },
    divider: "#e5eaef",
    background: {
      default: "#ffffff",
    },
  },
};

// const baseDarkTheme = {
//   direction: "ltr",
//   palette: {
//     primary: {
//       main: "#5D87FF",
//       light: "#ECF2FF",
//       dark: "#4570EA",
//     },
//     secondary: {
//       main: "#777e89",
//       light: "#1C455D",
//       dark: "#173f98",
//     },
//     success: {
//       main: "#13DEB9",
//       light: "#1B3C48",
//       dark: "#02b3a9",
//       contrastText: "#ffffff",
//     },
//     info: {
//       main: "#539BFF",
//       light: "#223662",
//       dark: "#1682d4",
//       contrastText: "#ffffff",
//     },
//     error: {
//       main: "#FA896B",
//       light: "#4B313D",
//       dark: "#f3704d",
//       contrastText: "#ffffff",
//     },
//     warning: {
//       main: "#FFAE1F",
//       light: "#4D3A2A",
//       dark: "#ae8e59",
//       contrastText: "#ffffff",
//     },
//     purple: {
//       A50: "#EBF3FE",
//       A100: "#6610f2",
//       A200: "#557fb9",
//     },
//     grey: {
//       100: "#333F55",
//       200: "#465670",
//       300: "#7C8FAC",
//       400: "#DFE5EF",
//       500: "#EAEFF4",
//       600: "#F2F6FA",
//       A700: "#465670",
//     },
//     text: {
//       primary: "#EAEFF4",
//       secondary: "#7C8FAC",
//     },
//     action: {
//       disabledBackground: "rgba(73,82,88,0.12)",
//       hoverOpacity: 0.02,
//       hover: "#333F55",
//     },
//     divider: "#333F55",
//     background: {
//       default: "#171c23",
//       dark: "#171c23",
//       paper: "#171c23",
//     },
//   },
// };

const baseDarkTheme = {
  direction: "ltr",
  palette: {
    primary: {
      main: "#5D87FF", // Vibrant brand blue for primary buttons and text
      light: "#1C2A4E", // FIX: Swapped from white-blue to deep dark blue for item selection/hover fills
      dark: "#4570EA",
    },
    secondary: {
      main: "#49BEFF", // FIX: Restored the vibrant cyan from light theme so your "New" badges pop perfectly
      light: "#16374A", // FIX: Dark-mode container blue for secondary badges/alerts
      dark: "#23afdb",
    },
    success: {
      main: "#13DEB9",
      light: "#1B3C48",
      dark: "#02b3a9",
      contrastText: "#ffffff",
    },
    info: {
      main: "#539BFF",
      light: "#223662",
      dark: "#1682d4",
      contrastText: "#ffffff",
    },
    error: {
      main: "#FA896B",
      light: "#4B313D",
      dark: "#f3704d",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#FFAE1F",
      light: "#4D3A2A",
      dark: "#ae8e59",
      contrastText: "#ffffff",
    },
    purple: {
      A50: "#EBF3FE",
      A100: "#6610f2",
      A200: "#557fb9",
    },
    grey: {
      100: "#333F55",
      200: "#465670",
      300: "#7C8FAC",
      400: "#DFE5EF",
      500: "#EAEFF4",
      600: "#F2F6FA",
      A700: "#465670",
    },
    text: {
      primary: "#EAEFF4", // High contrast crisp text
      secondary: "#7C8FAC", // Muted grey for subheaders and labels
    },
    action: {
      disabledBackground: "rgba(73,82,88,0.12)",
      hoverOpacity: 0.02,
      hover: "#333F55",
    },
    divider: "#333F55",
    background: {
      // FIX: Shifted to a deeply refined, slate-toned dark palette.
      // This allows both the primary blue text and the deep purple logo tail ("tra") to stand out crisply.
      default: "#0F131A", // Main dashboard canvas area
      dark: "#141923", // Left Sidebar / Navbar canvas (retains logo contrast)
      paper: "#1A202C", // Elevated elements (cards, headers, dialog modules)
    },
  },
};

export { baseDarkTheme, baselightTheme };
