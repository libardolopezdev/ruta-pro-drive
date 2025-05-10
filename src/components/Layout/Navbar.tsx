
import React from "react";
import { useAppContext } from "../../context/AppContext";
import { Link, useLocation } from "react-router-dom";
import { Car, CreditCard, PieChart, Settings, Plus, Home } from "lucide-react";

const Navbar: React.FC = () => {
  const { userConfig, activeDay } = useAppContext();
  const location = useLocation();
  const { theme } = userConfig;

  // Don't show navbar during onboarding
  if (location.pathname === "/onboarding") {
    return null;
  }

  return (
    <header className={`sticky top-0 z-10 shadow-sm ${theme === "taxi" ? "bg-primary" : "bg-rideshare-primary"}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Car className="w-6 h-6 mr-2" />
              <span className="font-bold text-xl text-white">RutaPro</span>
            </Link>
          </div>
          
          {activeDay && (
            <div className="bg-opacity-20 bg-white px-3 py-1 rounded-full">
              <span className="text-xs text-white font-medium">Jornada activa</span>
            </div>
          )}
        </div>
      </div>
      
      <nav className="bg-opacity-10 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className={`flex flex-col items-center py-2 px-3 ${location.pathname === "/" ? "text-white" : "text-gray-300"}`}
            >
              <Home className="w-5 h-5" />
              <span className="text-xs mt-1">Inicio</span>
            </Link>
            
            <Link 
              to="/income" 
              className={`flex flex-col items-center py-2 px-3 ${location.pathname === "/income" ? "text-white" : "text-gray-300"}`}
            >
              <Plus className="w-5 h-5" />
              <span className="text-xs mt-1">Ingresos</span>
            </Link>
            
            <Link 
              to="/expenses" 
              className={`flex flex-col items-center py-2 px-3 ${location.pathname === "/expenses" ? "text-white" : "text-gray-300"}`}
            >
              <CreditCard className="w-5 h-5" />
              <span className="text-xs mt-1">Egresos</span>
            </Link>
            
            <Link 
              to="/stats" 
              className={`flex flex-col items-center py-2 px-3 ${location.pathname === "/stats" ? "text-white" : "text-gray-300"}`}
            >
              <PieChart className="w-5 h-5" />
              <span className="text-xs mt-1">Estadísticas</span>
            </Link>
            
            <Link 
              to="/settings" 
              className={`flex flex-col items-center py-2 px-3 ${location.pathname === "/settings" ? "text-white" : "text-gray-300"}`}
            >
              <Settings className="w-5 h-5" />
              <span className="text-xs mt-1">Ajustes</span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
