import { createTheme, type Theme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { useEffect, useMemo } from "react";

import components from "./Components";
import typography from "./Typography";
import { shadows, darkshadows } from "./Shadows";
import { DarkThemeColors } from "./DarkThemeColors";
import { LightThemeColors } from "./LightThemeColors";
import * as locales from "@mui/material/locale";
import { baseDarkTheme, baselightTheme } from "./DefaultColors";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

interface ThemeConfig {
  direction?: "ltr" | "rtl";
  theme?: string;
}

interface CustomizerState {
  activeMode: "light" | "dark";
  borderRadius: number;
  isLanguage: keyof typeof locales;
  activeDir: "ltr" | "rtl";
  activeTheme: string;
}

interface RootState {
  customizer: CustomizerState;
}

/* -------------------------------------------------------------------------- */
/*                               Build Theme                                  */
/* -------------------------------------------------------------------------- */

const buildTheme = (
  config: ThemeConfig = {},
  customizer: CustomizerState,
): Theme => {
  const themeOptions = LightThemeColors.find(
    (theme) => theme.name === config.theme,
  );

  const darkthemeOptions = DarkThemeColors.find(
    (theme) => theme.name === config.theme,
  );

  const defaultTheme =
    customizer.activeMode === "dark" ? baseDarkTheme : baselightTheme;

  const defaultShadow =
    customizer.activeMode === "dark" ? darkshadows : shadows;

  const themeSelect =
    (customizer.activeMode === "dark" ? darkthemeOptions : themeOptions) ?? {};

  const baseMode = {
    palette: {
      mode: customizer.activeMode,
    },

    shape: {
      borderRadius: customizer.borderRadius,
    },

    shadows: defaultShadow,

    typography,
  };

  const theme = createTheme(
    baseMode,
    defaultTheme,
    locales[customizer.isLanguage],
    themeSelect,
    {
      direction: config.direction,
    },
  );

  theme.components = components(theme) as any;

  return theme;
};

/* -------------------------------------------------------------------------- */
/*                              Theme Settings                                */
/* -------------------------------------------------------------------------- */

const useThemeSettings = (): Theme => {
  const customizer = useSelector((state: RootState) => state.customizer);

  const theme = useMemo(
    () =>
      buildTheme(
        {
          direction: customizer.activeDir,
          theme: customizer.activeTheme,
        },
        customizer,
      ),
    [
      customizer.activeDir,
      customizer.activeTheme,
      customizer.activeMode,
      customizer.borderRadius,
      customizer.isLanguage,
    ],
  );

  useEffect(() => {
    document.dir = customizer.activeDir;
  }, [customizer.activeDir]);

  return theme;
};

export { useThemeSettings };
