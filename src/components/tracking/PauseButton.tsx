
import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { saveDay } from "../../utils/storage";
import { Button } from "../../components/ui/button";
import { useToast } from "../../components/ui/use-toast";
import { Pause, Play } from "lucide-react";

const PauseButton: React.FC = () => {
  const { activeDay, setActiveDay } = useAppContext();
  const { toast } = useToast();
  const [isPaused, setIsPaused] = useState(
    activeDay?.pauses?.some(pause => !pause.end) || false
  );
  
  if (!activeDay) {
    return null;
  }
  
  const handlePauseToggle = () => {
    if (!activeDay) return;
    
    let updatedPauses = [...(activeDay.pauses || [])];
    const now = new Date();
    const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    if (isPaused) {
      // Resume from pause
      updatedPauses = updatedPauses.map(pause => 
        pause.end ? pause : { ...pause, end: formattedTime }
      );
      toast({
        title: "Jornada reanudada",
        description: "Pausa finalizada. Jornada reanudada."
      });
    } else {
      // Start pause
      updatedPauses.push({ start: formattedTime });
      toast({
        title: "Jornada pausada",
        description: "Tu jornada ha sido pausada."
      });
    }
    
    const updatedDay = {
      ...activeDay,
      pauses: updatedPauses
    };
    
    saveDay(updatedDay);
    setActiveDay(updatedDay);
    setIsPaused(!isPaused);
  };
  
  return (
    <Button
      variant={isPaused ? "destructive" : "outline"}
      className="text-sm flex items-center"
      onClick={handlePauseToggle}
    >
      {isPaused ? (
        <>
          <Play className="h-4 w-4 mr-1" />
          Reanudar
        </>
      ) : (
        <>
          <Pause className="h-4 w-4 mr-1" />
          Pausar
        </>
      )}
    </Button>
  );
};

export default PauseButton;
