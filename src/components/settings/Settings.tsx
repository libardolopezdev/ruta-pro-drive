
import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { AVAILABLE_CURRENCIES } from "../../utils/storage";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Moon, Sun, UserCog, Palette, 
  Info, CreditCard, Globe, CircleDollarSign, LogOut
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { CurrencyConfig } from "@/types";

const Settings: React.FC = () => {
  const { userConfig, updateUserConfig, setCurrency, isAuthenticated, setUserAuth } = useAppContext();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginName, setLoginName] = useState("");
  
  // Toggle between taxi and platform theme
  const toggleTheme = () => {
    const newTheme = userConfig.theme === "taxi" ? "platform" : "taxi";
    updateUserConfig({ theme: newTheme });
    
    // Apply theme change
    document.body.classList.remove("taxi-theme", "platform-theme");
    document.body.classList.add(`${newTheme}-theme`);
    
    toast({
      title: "Tema actualizado",
      description: `Se ha cambiado al tema ${newTheme === "taxi" ? "Taxi" : "Plataforma"}`,
    });
  };

  const handleCurrencyChange = (currencyCode: string) => {
    const selectedCurrency = AVAILABLE_CURRENCIES.find(c => c.code === currencyCode);
    if (selectedCurrency) {
      setCurrency(selectedCurrency);
      toast({
        title: "Moneda actualizada",
        description: `Se ha cambiado la moneda a ${selectedCurrency.name}`,
      });
    }
  };
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginName) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }
    
    setUserAuth(loginEmail, loginName);
    toast({
      title: "Sesión iniciada",
      description: "Has iniciado sesión correctamente",
      variant: "default"
    });
  };
  
  const handleLogout = () => {
    // Implementation would go here in a real app
    toast({
      title: "Función en desarrollo",
      description: "El cierre de sesión estará disponible próximamente",
    });
  };
  
  const handleGoogleAuth = () => {
    toast({
      title: "Google Auth",
      description: "La autenticación con Google estará disponible próximamente",
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Ajustes</h1>
      
      {!isAuthenticated && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserCog className="h-5 w-5" /> Iniciar sesión
            </CardTitle>
            <CardDescription>
              Crea una cuenta o inicia sesión para guardar tus datos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="nombre@ejemplo.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre</Label>
                <Input 
                  id="name" 
                  placeholder="Tu nombre"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input 
                  id="password" 
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
              
              <Button type="submit" className="w-full bg-primary">
                Iniciar sesión
              </Button>
            </form>
            
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
            
            <Button variant="outline" className="w-full" onClick={handleGoogleAuth}>
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
      )}
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Palette className="h-5 w-5" /> Preferencias de la aplicación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="theme-toggle">Tema</Label>
              <div className="text-sm text-muted-foreground">
                {userConfig.theme === "taxi" ? "Taxi (Amarillo)" : "Plataforma (Azul)"}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4 text-amber-500" />
              <Switch 
                id="theme-toggle" 
                checked={userConfig.theme === "platform"}
                onCheckedChange={toggleTheme}
              />
              <Moon className="h-4 w-4 text-blue-500" />
            </div>
          </div>
          
          <Separator className="my-2" />
          
          <div className="space-y-1.5">
            <Label htmlFor="currency-select">Moneda</Label>
            <Select 
              value={userConfig.currency.code} 
              onValueChange={handleCurrencyChange}
            >
              <SelectTrigger id="currency-select" className="w-full">
                <SelectValue placeholder="Selecciona moneda" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_CURRENCIES.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center">
                      <span className="mr-2">{currency.symbol}</span>
                      <span>{currency.name} ({currency.code})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground mt-1">
              La moneda se utilizará en toda la aplicación para mostrar los valores
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <UserCog className="h-5 w-5" /> Cuenta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAuthenticated ? (
            <div className="space-y-4">
              <div>
                <Label>Usuario</Label>
                <div className="text-sm font-medium">
                  {userConfig.email || "No disponible"}
                </div>
              </div>
              
              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  Cambiar contraseña
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full text-destructive border-destructive hover:bg-destructive/10"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Cerrar sesión
                </Button>
              </div>
              
              <Separator className="my-2" />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sincronizar con la nube</Label>
                  <div className="text-sm text-muted-foreground">
                    Próximamente
                  </div>
                </div>
                <Switch 
                  checked={false} 
                  disabled 
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-2">
              <div className="text-sm text-muted-foreground">
                Inicia sesión para administrar tu cuenta
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5" /> Acerca de
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <span className="font-medium">RutaPro</span> <span className="text-sm text-muted-foreground">v1.0.0</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Una aplicación para gestionar tus rutas y servicios como conductor.
            </div>
            <div className="text-sm text-muted-foreground pt-2">
              © 2024 RutaPro. Todos los derechos reservados.
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center text-sm text-muted-foreground py-4">
        Próximamente: Más opciones de configuración
      </div>
    </div>
  );
};

export default Settings;
