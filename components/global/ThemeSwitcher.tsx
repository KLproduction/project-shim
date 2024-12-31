"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Switch } from "../ui/switch";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [enabled, setEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    setEnabled(theme === "light"); // Sync initial theme
  }, [theme]);

  const toggleTheme = (isEnabled: boolean) => {
    setEnabled(isEnabled);
    setTheme(isEnabled ? "dark" : "light");
  };

  if (!mounted) return null;

  return (
    <Switch
      checked={enabled}
      onCheckedChange={toggleTheme}
      className={`${
        enabled ? "bg-gray-800" : "bg-gray-200"
      } relative inline-flex h-6 w-11 items-center rounded-full`}
    >
      <span
        className={`${
          enabled ? "translate-x-6" : "translate-x-1"
        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
      />
    </Switch>
  );
};

export default ThemeSwitcher;
