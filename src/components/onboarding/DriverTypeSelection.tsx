
import React from "react";
import { Card } from "../../components/ui/card";
import { Car, Building } from "lucide-react";

interface DriverTypeSelectionProps {
  onSelect: (type: "taxi" | "platform") => void;
}

const DriverTypeSelection: React.FC<DriverTypeSelectionProps> = ({ onSelect }) => {
  return (
    <div className="space-y-6">
      <p className="text-center text-muted-foreground mb-8">
        Selecciona el tipo de conductor para personalizar la experiencia
      </p>
      
      <div className="grid gap-6">
        <Card 
          onClick={() => onSelect("taxi")}
          className="p-6 cursor-pointer hover:border-amber-400 transition-all duration-200 transform hover:-translate-y-1"
        >
          <div className="flex items-center">
            <div className="rounded-full bg-amber-100 p-3">
              <Car className="h-8 w-8 text-amber-500" />
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-xl">Taxista</h3>
              <p className="text-sm text-muted-foreground">
                Conductor de taxi tradicional con tarifa regulada
              </p>
            </div>
          </div>
        </Card>
        
        <Card 
          onClick={() => onSelect("platform")}
          className="p-6 cursor-pointer hover:border-blue-500 transition-all duration-200 transform hover:-translate-y-1"
        >
          <div className="flex items-center">
            <div className="rounded-full bg-slate-100 p-3">
              <Building className="h-8 w-8 text-slate-700" />
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-xl">Plataforma</h3>
              <p className="text-sm text-muted-foreground">
                Conductor de aplicaciones como Uber, DiDi, InDrive, etc.
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      <p className="text-center text-xs text-muted-foreground mt-8">
        Podrás cambiar esta configuración más adelante en los ajustes
      </p>
    </div>
  );
};

export default DriverTypeSelection;
