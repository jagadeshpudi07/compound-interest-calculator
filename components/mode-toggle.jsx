"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      className="group fixed top-4 right-4 z-50 flex w-[4.5rem] h-9 items-center rounded-full bg-slate-200 dark:bg-slate-800 p-1 transition-colors hover:bg-slate-300 dark:hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <div 
        className="absolute h-7 w-7 rounded-full bg-white dark:bg-slate-950 shadow-sm transition-transform duration-500 ease-in-out translate-x-0 dark:translate-x-[2.25rem]" 
      />
      <div className="relative z-10 flex w-full justify-between px-[0.35rem]">
        <Sun className="h-4 w-4 text-slate-800 transition-colors duration-500 dark:text-slate-500" />
        <Moon className="h-4 w-4 text-slate-400 transition-colors duration-500 dark:text-slate-200" />
      </div>
    </button>
  )
}
