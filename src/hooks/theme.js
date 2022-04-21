import React, { createContext, useCallback, useState, useContext } from 'react';
import PropTypes from 'prop-types';

const ThemeContext = createContext({});

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const updateDarkMode = useCallback(async (dark) => {
    setDarkMode(dark);
    localStorage.setItem('@products:darkMode', dark);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        updateDarkMode,
        darkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export function useTheme() {
  const context = useContext(ThemeContext);

  return context;
}
