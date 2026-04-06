"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="p-2 w-10 h-10" />;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative p-2 rounded-xl border border-border bg-background/50 backdrop-blur-md hover:bg-accent/50 transition-all group overflow-hidden shadow-sm"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: 20, opacity: 0, rotate: -45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -20, opacity: 0, rotate: 45 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="relative z-10"
        >
          {isDark ? (
            <Sun className="h-4 w-4 text-amber-400 group-hover:scale-110 transition-transform" />
          ) : (
            <Moon className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
