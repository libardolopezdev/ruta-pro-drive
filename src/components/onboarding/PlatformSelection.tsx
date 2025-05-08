
import React from "react";
import { Platform } from "../../types";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";

interface PlatformSelectionProps {
  platforms: Platform[];
  onToggle: (platformId: string) => void;
}

const PlatformSelection: React.FC<PlatformSelectionProps> = ({ platforms, onToggle }) => {
  return (
    <div className="space-y-6">
      <p className="text-center text-muted-foreground mb-6">
        Selecciona las plataformas con las que trabajas
      </p>
      
      <div className="space-y-4">
        {platforms.map((platform) => (
          <div 
            key={platform.id} 
            className="flex items-center justify-between p-3 rounded-lg border"
          >
            <div className="flex items-center">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: platform.color }}
              >
                <span className="font-bold text-sm text-white">
                  {platform.name.charAt(0)}
                </span>
              </div>
              <Label htmlFor={`platform-${platform.id}`} className="ml-3 cursor-pointer">
                {platform.name}
              </Label>
            </div>
            <Switch 
              id={`platform-${platform.id}`}
              checked={platform.selected}
              onCheckedChange={() => onToggle(platform.id)}
            />
          </div>
        ))}
      </div>
      
      <p className="text-center text-xs text-muted-foreground mt-8">
        Podrás añadir más plataformas o modificar estas en los ajustes
      </p>
    </div>
  );
};

export default PlatformSelection;
