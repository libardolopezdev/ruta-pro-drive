
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import DriverTypeSelection from "./DriverTypeSelection";
import PlatformSelection from "./PlatformSelection";
import { DEFAULT_PLATFORMS, DEFAULT_EXPENSE_CATEGORIES } from "../../utils/storage";
import { Button } from "../../components/ui/button";
import { ArrowRight, Check } from "lucide-react";

const OnboardingFlow: React.FC = () => {
  const [step, setStep] = useState(1);
  const { userConfig, updateUserConfig, setDriverType, setHasCompletedSetup } = useAppContext();
  const navigate = useNavigate();
  const [selectedPlatforms, setSelectedPlatforms] = useState(DEFAULT_PLATFORMS);
  const [vehicleColor, setVehicleColor] = useState(userConfig.driverType === "taxi" ? "yellow" : "gray");
  
  const handleDriverTypeSelect = (type: "taxi" | "platform") => {
    setDriverType(type);
    setVehicleColor(type === "taxi" ? "yellow" : "gray");
    setStep(2);
  };

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.map(p => p.id === platformId ? { ...p, selected: !p.selected } : p)
    );
  };

  const handleFinishOnboarding = () => {
    updateUserConfig({
      platforms: selectedPlatforms,
      vehicleColor,
      expenseCategories: DEFAULT_EXPENSE_CATEGORIES,
    });
    
    setHasCompletedSetup(true);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-8">
          <div className={`h-2 w-1/2 rounded-l-full ${step >= 1 ? "bg-primary" : "bg-muted"}`}></div>
          <div className={`h-2 w-1/2 rounded-r-full ${step >= 2 ? "bg-primary" : "bg-muted"}`}></div>
        </div>
        
        {/* Step title */}
        <h1 className="text-2xl font-bold text-center mb-8">
          {step === 1 ? "Bienvenido a RutaPro" : "Selecciona tus plataformas"}
        </h1>
        
        {/* Step content */}
        {step === 1 && (
          <DriverTypeSelection onSelect={handleDriverTypeSelect} />
        )}
        
        {step === 2 && (
          <>
            <PlatformSelection 
              platforms={selectedPlatforms}
              onToggle={handlePlatformToggle}
            />
            
            <div className="mt-10">
              <h3 className="text-lg font-medium mb-4">Color del vehículo:</h3>
              <div className="flex space-x-4 mb-6">
                <button 
                  onClick={() => setVehicleColor("yellow")}
                  className={`w-16 h-16 rounded-full bg-amber-400 flex items-center justify-center ${vehicleColor === "yellow" ? "ring-4 ring-primary" : ""}`}
                >
                  {vehicleColor === "yellow" && <Check className="text-yellow-800" />}
                </button>
                
                <button 
                  onClick={() => setVehicleColor("gray")}
                  className={`w-16 h-16 rounded-full bg-gray-500 flex items-center justify-center ${vehicleColor === "gray" ? "ring-4 ring-primary" : ""}`}
                >
                  {vehicleColor === "gray" && <Check className="text-white" />}
                </button>
                
                <button 
                  onClick={() => setVehicleColor("white")}
                  className={`w-16 h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center ${vehicleColor === "white" ? "ring-4 ring-primary" : ""}`}
                >
                  {vehicleColor === "white" && <Check className="text-gray-800" />}
                </button>
                
                <button 
                  onClick={() => setVehicleColor("black")}
                  className={`w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center ${vehicleColor === "black" ? "ring-4 ring-primary" : ""}`}
                >
                  {vehicleColor === "black" && <Check className="text-white" />}
                </button>
              </div>
            </div>
            
            <Button 
              onClick={handleFinishOnboarding}
              className="w-full mt-6"
            >
              Comenzar a usar RutaPro <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;
