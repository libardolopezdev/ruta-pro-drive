
import React from "react";
import { useAppContext } from "../../context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Moon, Sun, UserCog, Palette, Info } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const Settings: React.FC = () => {
  const { userConfig, updateUserConfig } = useAppContext();
  
  // Toggle between taxi and platform theme
  const toggleTheme = () => {
    const newTheme = userConfig.theme === "taxi" ? "platform" : "taxi";
    updateUserConfig({ theme });
    
    // Apply theme change
    document.body.classList.remove("taxi-theme", "platform-theme");
    document.body.classList.add(`${newTheme}-theme`);
    
    toast({
      title: "Tema actualizado",
      description: `Se ha cambiado al tema ${newTheme === "taxi" ? "Taxi" : "Plataforma"}`,
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Ajustes</h1>
      
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
                {userConfig.theme === "taxi" ? "Taxi (Amarillo)" : "Plataforma (Oscuro)"}
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
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <UserCog className="h-5 w-5" /> Cuenta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Modo offline</Label>
              <div className="text-sm text-muted-foreground">
                Almacena tus datos localmente
              </div>
            </div>
            <Switch 
              checked={true} 
              disabled 
            />
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
