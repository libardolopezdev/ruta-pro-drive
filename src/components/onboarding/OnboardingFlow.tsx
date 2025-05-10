
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
import { Separator } from "../../components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Check, CircleDollarSign, CircleUser, CarTaxiFront as Taxi, Car } from "lucide-react";
import { CurrencyConfig } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

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
  const [password, setPassword] = useState("");
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
      toast({
        title: "Cuenta creada",
        description: "Tu cuenta ha sido creada exitosamente",
        variant: "default"
      });
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
    navigate("/day-start");
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

  const handleGoogleAuth = () => {
    // This would normally connect to Google Auth
    toast({
      title: "Google Auth",
      description: "La autenticación con Google estará disponible próximamente",
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-8">
          <div className={`h-2 w-1/3 rounded-l-full ${step >= 1 ? "bg-primary" : "bg-muted"}`}></div>
          <div className={`h-2 w-1/3 ${step >= 2 ? "bg-primary" : "bg-muted"}`}></div>
          <div className={`h-2 w-1/3 rounded-r-full ${step >= 3 ? "bg-primary" : "bg-muted"}`}></div>
        </div>
        
        {/* Step title */}
        <h1 className="text-2xl font-bold text-center mb-8 text-foreground">
          {step === 1 && "Bienvenido a RutaPro"}
          {step === 2 && "Selecciona tus plataformas"}
          {step === 3 && "Configuración de cuenta"}
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
              <h3 className="text-lg font-medium mb-4 text-foreground">Color del vehículo:</h3>
              <div className="flex space-x-4 mb-6 justify-center">
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
                className="bg-primary hover:bg-primary/90"
              >
                Continuar <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        )}
        
        {step === 3 && (
          <>
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Crear cuenta</CardTitle>
                <CardDescription>Registra tus datos para poder utilizar la aplicación</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input 
                    id="password"
                    type="password"
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      O continúa con
                    </span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleGoogleAuth}
                >
                  <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </Button>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CircleDollarSign className="h-5 w-5" /> Configuración de moneda
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  <p className="text-sm text-muted-foreground mt-1">
                    La moneda se utilizará para mostrar todos los valores monetarios en la aplicación
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6 flex justify-between">
              <Button 
                variant="outline"
                onClick={prevStep}
              >
                Atrás
              </Button>
              
              <Button 
                onClick={handleFinishOnboarding}
                className="bg-primary hover:bg-primary/90"
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
