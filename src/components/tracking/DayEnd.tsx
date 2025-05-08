
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { saveDay } from "../../utils/storage";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { ArrowLeft, StopCircle } from "lucide-react";
import { useToast } from "../../components/ui/use-toast";

const DayEnd: React.FC = () => {
  const { activeDay, setActiveDay } = useAppContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Current time formatted as HH:MM
  const now = new Date();
  const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  const [endTime, setEndTime] = useState(formattedTime);
  const [finalMileage, setFinalMileage] = useState("");
  const [notes, setNotes] = useState("");
  
  const handleEndDay = () => {
    if (!activeDay) {
      toast({
        title: "No hay jornada activa",
        description: "No hay una jornada activa para finalizar",
        variant: "destructive"
      });
      navigate("/");
      return;
    }
    
    if (!finalMileage) {
      toast({
        title: "Kilometraje requerido",
        description: "Por favor ingresa el kilometraje final",
        variant: "destructive"
      });
      return;
    }
    
    const finalMileageNum = parseFloat(finalMileage);
    
    if (finalMileageNum < activeDay.start.initialMileage) {
      toast({
        title: "Kilometraje inválido",
        description: "El kilometraje final debe ser mayor al inicial",
        variant: "destructive"
      });
      return;
    }
    
    const updatedDay = {
      ...activeDay,
      end: {
        endTime,
        finalMileage: finalMileageNum,
        ...(notes ? { notes } : {})
      },
      start: {
        ...activeDay.start,
        isActive: false
      }
    };
    
    saveDay(updatedDay);
    setActiveDay(null);
    
    toast({
      title: "¡Jornada finalizada!",
      description: "Tu jornada ha sido finalizada correctamente"
    });
    
    navigate("/stats");
  };
  
  if (!activeDay) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg text-muted-foreground mb-4">No hay jornada activa para finalizar</p>
        <Button onClick={() => navigate("/")}>Volver al inicio</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate("/")}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Finalizar Jornada</h1>
      </div>
      
      <Card className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="endTime">Hora de finalización</Label>
          <Input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="finalMileage">Kilometraje final *</Label>
          <Input
            id="finalMileage"
            type="number"
            placeholder="Ej. 45330"
            value={finalMileage}
            onChange={(e) => setFinalMileage(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">
            Kilometraje inicial: {activeDay.start.initialMileage}
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Notas (opcional)</Label>
          <Textarea
            id="notes"
            placeholder="Escribe alguna nota sobre tu jornada..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>
      </Card>
      
      <Button 
        onClick={handleEndDay}
        className="w-full"
      >
        <StopCircle className="mr-2 h-5 w-5" />
        Finalizar Jornada
      </Button>
    </div>
  );
};

export default DayEnd;
