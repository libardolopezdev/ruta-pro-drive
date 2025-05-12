
import React, { useState, useEffect } from "react";
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
import { formatCurrency, formatNumber } from "@/utils/format";

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
  const [finalCash, setFinalCash] = useState<number | null>(null);
  
  // Calculate initial cash + received cash - expenses
  useEffect(() => {
    if (activeDay) {
      const initialCash = activeDay.start.initialCash || 0;
      const cashIncome = activeDay.incomes
        .filter(income => income.paymentMethod === 'cash')
        .reduce((sum, income) => sum + income.amount, 0);
      const expenses = activeDay.expenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      const calculatedFinalCash = initialCash + cashIncome - expenses;
      setFinalCash(calculatedFinalCash);
    }
  }, [activeDay]);
  
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
        finalCash: finalCash || 0,
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
    <div className="space-y-6 pb-24">
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
            Kilometraje inicial: {formatNumber(activeDay.start.initialMileage)}
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="finalCash">Efectivo final</Label>
          <div className="relative">
            <Input
              id="finalCash"
              type="number"
              className="pl-8"
              placeholder="0"
              value={finalCash === null ? "" : finalCash}
              onChange={(e) => setFinalCash(e.target.value ? Number(e.target.value) : 0)}
            />
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">
              {activeDay.userConfig?.currency?.symbol || "$"}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Calculado: {formatCurrency(finalCash || 0)} (Efectivo inicial + recibido - gastos)
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
