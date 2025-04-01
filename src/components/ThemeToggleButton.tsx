import React from "react";
import { useTheme } from "../contexts/ThemeContext";

const ThemeToggleButton: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="p-2 bg-gray-200 rounded">
      Current Theme: {theme} (Click to toggle)
    </button>
  );
};

export default ThemeToggleButton;