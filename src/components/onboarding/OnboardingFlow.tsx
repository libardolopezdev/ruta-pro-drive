
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import DriverTypeSelection from "./DriverTypeSelection";
import PlatformSelection from "./PlatformSelection";
import { 
  DEFAULT_PLATFORMS, DEFAULT_EXPENSE_CATEGORIES, AVAILABLE_CURRENCIES 
} from "../../utils/storage";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Check, CircleDollarSign, CircleUser, Taxi, Car } from "lucide-react";
import { CurrencyConfig } from "@/types";

const OnboardingFlow: React.FC = () => {
  const [step, setStep] = useState(1);
  const { 
    userConfig, 
    updateUserConfig, 
    setDriverType, 
    setCurrency,
    setHasCompletedSetup,
    setUserAuth 
  } = useAppContext();
  const navigate = useNavigate();
  const [selectedPlatforms, setSelectedPlatforms] = useState(DEFAULT_PLATFORMS);
  const [vehicleColor, setVehicleColor] = useState(userConfig.driverType === "taxi" ? "yellow" : "gray");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyConfig>(AVAILABLE_CURRENCIES[0]);
  
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
  
  const handleCurrencyChange = (value: string) => {
    const currency = AVAILABLE_CURRENCIES.find(c => c.code === value) || AVAILABLE_CURRENCIES[0];
    setSelectedCurrency(currency);
  };

  const handleFinishOnboarding = () => {
    // Save user information if provided
    if (email && name) {
      setUserAuth(email, name);
    }
    
    // Save currency and other settings
    setCurrency(selectedCurrency);
    
    // Save all other settings
    updateUserConfig({
      platforms: selectedPlatforms,
      vehicleColor,
      expenseCategories: DEFAULT_EXPENSE_CATEGORIES,
    });
    
    setHasCompletedSetup(true);
    navigate("/");
  };
  
  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };
  
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-8">
          <div className={`h-2 w-1/3 rounded-l-full ${step >= 1 ? "bg-primary" : "bg-muted"}`}></div>
          <div className={`h-2 w-1/3 ${step >= 2 ? "bg-primary" : "bg-muted"}`}></div>
          <div className={`h-2 w-1/3 rounded-r-full ${step >= 3 ? "bg-primary" : "bg-muted"}`}></div>
        </div>
        
        {/* Step title */}
        <h1 className="text-2xl font-bold text-center mb-8">
          {step === 1 && "Bienvenido a RutaPro"}
          {step === 2 && "Selecciona tus plataformas"}
          {step === 3 && "Configuración final"}
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
            
            <div className="mt-6 flex justify-between">
              <Button 
                variant="outline"
                onClick={prevStep}
              >
                Atrás
              </Button>
              
              <Button 
                onClick={nextStep}
              >
                Continuar <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        )}
        
        {step === 3 && (
          <>
            <div className="space-y-6">
              <div>
                <Label className="text-lg font-medium mb-2 block">Información personal (opcional)</Label>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="nombre@ejemplo.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input 
                      id="name" 
                      placeholder="Tu nombre" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-lg font-medium mb-2 block">Moneda</Label>
                <div className="space-y-2">
                  <Label htmlFor="currency">Selecciona tu moneda</Label>
                  <Select 
                    value={selectedCurrency.code}
                    onValueChange={handleCurrencyChange}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Seleccionar moneda" />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_CURRENCIES.map(currency => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.symbol} {currency.name} ({currency.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <Button 
                variant="outline"
                onClick={prevStep}
              >
                Atrás
              </Button>
              
              <Button 
                onClick={handleFinishOnboarding}
              >
                Comenzar a usar RutaPro <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;
