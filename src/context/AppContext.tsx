
import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  getUserConfig, saveUserConfig, getActiveDay, hasCompletedOnboarding, 
  saveUserAuth, getUserAuth, isUserAuthenticated 
} from "../utils/storage";
import { UserConfig, Day, DriverType, CurrencyConfig } from "../types";

interface AppContextType {
  userConfig: UserConfig;
  updateUserConfig: (config: Partial<UserConfig>) => void;
  setDriverType: (type: DriverType) => void;
  setCurrency: (currency: CurrencyConfig) => void;
  activeDay: Day | null;
  setActiveDay: (day: Day | null) => void;
  hasCompletedSetup: boolean;
  setHasCompletedSetup: (value: boolean) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUserAuth: (email: string, name: string) => void;
  userEmail: string | null;
  userName: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userConfig, setUserConfig] = useState<UserConfig>(getUserConfig());
  const [activeDay, setActiveDay] = useState<Day | null>(null);
  const [hasCompletedSetup, setHasCompletedSetup] = useState<boolean>(hasCompletedOnboarding());
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isUserAuthenticated());
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // Load active day and user config on startup
    const loadActiveDay = async () => {
      try {
        const day = getActiveDay();
        setActiveDay(day);
        
        // Load user auth data
        const authData = getUserAuth();
        if (authData) {
          setUserEmail(authData.email);
          setUserName(authData.name);
          setIsAuthenticated(true);
        }
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
    
    // Update theme if it was changed
    if (configUpdate.theme && configUpdate.theme !== userConfig.theme) {
      document.body.classList.remove("taxi-theme", "platform-theme");
      document.body.classList.add(`${configUpdate.theme}-theme`);
    }
  };

  const setDriverType = (type: DriverType) => {
    const theme = type === "taxi" ? "taxi" : "platform";
    updateUserConfig({ driverType: type, theme });
    
    // Update the document body with the theme class
    document.body.classList.remove("taxi-theme", "platform-theme");
    document.body.classList.add(`${theme}-theme`);
  };
  
  const setCurrency = (currency: CurrencyConfig) => {
    updateUserConfig({ currency });
  };
  
  const setUserAuth = (email: string, name: string) => {
    setUserEmail(email);
    setUserName(name);
    setIsAuthenticated(true);
    saveUserAuth(email, name);
  };

  // Apply theme on initial load
  useEffect(() => {
    document.body.classList.add(`${userConfig.theme}-theme`);
  }, [userConfig.theme]);

  const value = {
    userConfig,
    updateUserConfig,
    setDriverType,
    setCurrency,
    activeDay,
    setActiveDay,
    hasCompletedSetup,
    setHasCompletedSetup,
    isLoading,
    isAuthenticated,
    setUserAuth,
    userEmail,
    userName
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
