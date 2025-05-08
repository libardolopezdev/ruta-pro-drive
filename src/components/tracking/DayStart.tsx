
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { generateId, saveDay } from "../../utils/storage";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { ArrowLeft, PlayCircle } from "lucide-react";
import { useToast } from "../../components/ui/use-toast";
import { Day } from "../../types";

const DayStart: React.FC = () => {
  const { setActiveDay } = useAppContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Current time formatted as HH:MM
  const now = new Date();
  const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const formattedDate = now.toISOString().split('T')[0];
  
  const [startTime, setStartTime] = useState(formattedTime);
  const [initialMileage, setInitialMileage] = useState("");
  const [initialCash, setInitialCash] = useState("");
  const [notes, setNotes] = useState("");
  
  const handleStartDay = () => {
    if (!initialMileage) {
      toast({
        title: "Kilometraje requerido",
        description: "Por favor ingresa el kilometraje inicial",
        variant: "destructive"
      });
      return;
    }
    
    const dayId = generateId();
    
    const newDay: Day = {
      start: {
        id: dayId,
        date: formattedDate,
        startTime: startTime,
        initialMileage: parseFloat(initialMileage),
        initialCash: initialCash ? parseFloat(initialCash) : 0,
        notes: notes,
        isActive: true
      },
      incomes: [],
      expenses: [],
      pauses: []
    };
    
    saveDay(newDay);
    setActiveDay(newDay);
    
    toast({
      title: "¡Jornada iniciada!",
      description: "Tu jornada ha comenzado correctamente"
    });
    
    navigate("/");
  };
  
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
        <h1 className="text-xl font-bold">Iniciar Jornada</h1>
      </div>
      
      <Card className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="startTime">Hora de inicio</Label>
          <Input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="initialMileage">Kilometraje inicial *</Label>
          <Input
            id="initialMileage"
            type="number"
            placeholder="Ej. 45280"
            value={initialMileage}
            onChange={(e) => setInitialMileage(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="initialCash">Efectivo inicial (opcional)</Label>
          <Input
            id="initialCash"
            type="number"
            placeholder="Ej. 20000"
            value={initialCash}
            onChange={(e) => setInitialCash(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Notas (opcional)</Label>
          <Textarea
            id="notes"
            placeholder="Escribe alguna nota sobre tu día..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>
      </Card>
      
      <Button 
        onClick={handleStartDay}
        className="w-full"
      >
        <PlayCircle className="mr-2 h-5 w-5" />
        Iniciar Jornada
      </Button>
    </div>
  );
};

export default DayStart;
