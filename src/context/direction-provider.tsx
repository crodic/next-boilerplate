"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Direction } from "radix-ui";
import { setCookie, removeCookie } from "@/lib/cookies";

const RdxDirProvider = Direction.Provider;

export type DirType = "ltr" | "rtl";

const DEFAULT_DIRECTION: DirType = "ltr";
const DIRECTION_COOKIE_NAME = "dir";
const DIRECTION_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

type DirectionContextType = {
  defaultDir: DirType;
  dir: DirType;
  setDir: (dir: DirType) => void;
  resetDir: () => void;
};

const DirectionContext = createContext<DirectionContextType | null>(null);

type DirectionProviderProps = {
  children: React.ReactNode;
  initialDir?: DirType;
};

export function DirectionProvider({
  children,
  initialDir,
}: DirectionProviderProps) {
  const [dir, _setDir] = useState<DirType>(initialDir ?? DEFAULT_DIRECTION);

  useEffect(() => {
    document.documentElement.setAttribute("dir", dir);
  }, [dir]);

  const setDir = (newDir: DirType) => {
    _setDir(newDir);
    setCookie(DIRECTION_COOKIE_NAME, newDir, DIRECTION_COOKIE_MAX_AGE);
  };

  const resetDir = () => {
    _setDir(DEFAULT_DIRECTION);
    removeCookie(DIRECTION_COOKIE_NAME);
  };

  return (
    <DirectionContext
      value={{ defaultDir: DEFAULT_DIRECTION, dir, setDir, resetDir }}
    >
      <RdxDirProvider dir={dir}>{children}</RdxDirProvider>
    </DirectionContext>
  );
}

export function useDirection() {
  const context = useContext(DirectionContext);
  if (!context) {
    throw new Error("useDirection must be used within a DirectionProvider");
  }
  return context;
}
