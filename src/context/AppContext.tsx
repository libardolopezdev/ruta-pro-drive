
import React, { createContext, useContext, useEffect, useState } from "react";
import { getUserConfig, saveUserConfig, getActiveDay, hasCompletedOnboarding } from "../utils/storage";
import { UserConfig, Day, DriverType } from "../types";

interface AppContextType {
  userConfig: UserConfig;
  updateUserConfig: (config: Partial<UserConfig>) => void;
  setDriverType: (type: DriverType) => void;
  activeDay: Day | null;
  setActiveDay: (day: Day | null) => void;
  hasCompletedSetup: boolean;
  setHasCompletedSetup: (value: boolean) => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userConfig, setUserConfig] = useState<UserConfig>(getUserConfig());
  const [activeDay, setActiveDay] = useState<Day | null>(null);
  const [hasCompletedSetup, setHasCompletedSetup] = useState<boolean>(hasCompletedOnboarding());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load active day and user config on startup
    const loadActiveDay = async () => {
      try {
        const day = getActiveDay();
        setActiveDay(day);
      } catch (error) {
        console.error("Error loading active day:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadActiveDay();
  }, []);

  const updateUserConfig = (configUpdate: Partial<UserConfig>) => {
    const updatedConfig = { ...userConfig, ...configUpdate };
    setUserConfig(updatedConfig);
    saveUserConfig(updatedConfig);
  };

  const setDriverType = (type: DriverType) => {
    const theme = type === "taxi" ? "taxi" : "platform";
    updateUserConfig({ driverType: type, theme });
    
    // Update the document body with the theme class
    document.body.classList.remove("taxi-theme", "platform-theme");
    document.body.classList.add(`${theme}-theme`);
  };

  // Apply theme on initial load
  useEffect(() => {
    document.body.classList.add(`${userConfig.theme}-theme`);
  }, [userConfig.theme]);

  const value = {
    userConfig,
    updateUserConfig,
    setDriverType,
    activeDay,
    setActiveDay,
    hasCompletedSetup,
    setHasCompletedSetup,
    isLoading
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
