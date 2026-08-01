"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { setCookie, removeCookie } from "@/lib/cookies";

export type ColorKey =
  | "neutral"
  | "blue"
  | "red"
  | "violet"
  | "yellow"
  | "green"
  | "orange"
  | "cyan"
  | "indigo"
  | "slate"
  | "teal"
  | "pink";

const DEFAULT_COLOR: ColorKey = "neutral";
const COLOR_COOKIE_NAME = "theme-color";
const COLOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

type ThemeColorContextType = {
  colorKey: ColorKey;
  setColorKey: (color: ColorKey) => void;
  resetColor: () => void;
};

const ThemeColorContext = createContext<ThemeColorContextType | null>(null);

type ThemeColorProviderProps = {
  children: React.ReactNode;
  initialColorKey?: ColorKey;
};

export function ThemeColorProvider({
  children,
  initialColorKey,
}: ThemeColorProviderProps) {
  const [colorKey, _setColorKey] = useState<ColorKey>(
    initialColorKey ?? DEFAULT_COLOR
  );

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (colorKey === "neutral") {
      htmlElement.removeAttribute("data-theme");
    } else {
      htmlElement.setAttribute("data-theme", colorKey);
    }
  }, [colorKey]);

  const setColorKey = (color: ColorKey) => {
    _setColorKey(color);
    setCookie(COLOR_COOKIE_NAME, color, COLOR_COOKIE_MAX_AGE);
  };

  const resetColor = () => {
    _setColorKey(DEFAULT_COLOR);
    removeCookie(COLOR_COOKIE_NAME);
  };

  return (
    <ThemeColorContext.Provider value={{ colorKey, setColorKey, resetColor }}>
      {children}
    </ThemeColorContext.Provider>
  );
}

export function useThemeColor() {
  const context = useContext(ThemeColorContext);
  if (!context) {
    throw new Error("useThemeColor must be used within a ThemeColorProvider");
  }
  return context;
}
