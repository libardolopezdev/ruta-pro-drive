
import React from "react";
import Navbar from "./Navbar";
import { useAppContext } from "../../context/AppContext";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { userConfig, isLoading } = useAppContext();
  const theme = userConfig?.theme || "platform";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Cargando RutaPro...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${theme}-theme`}>
      <Navbar />
      <main className="flex-1 container px-4 py-6 mx-auto max-w-md">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
