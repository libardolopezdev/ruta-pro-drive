
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { saveDay, generateId } from "../../utils/storage";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { ArrowLeft, Plus, Camera, Check, Receipt } from "lucide-react";
import { useToast } from "../../components/ui/use-toast";
import { Expense } from "../../types";

const ExpenseEntry: React.FC = () => {
  const { activeDay, setActiveDay, userConfig } = useAppContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get expense categories
  const { expenseCategories } = userConfig;
  
  // Current time formatted as HH:MM
  const now = new Date();
  const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  const [timestamp, setTimestamp] = useState(formattedTime);
  const [category, setCategory] = useState(expenseCategories[0]?.id || "");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [receiptImage, setReceiptImage] = useState<string | undefined>(undefined);
  
  const handleSaveExpense = () => {
    if (!activeDay) {
      toast({
        title: "No hay jornada activa",
        description: "Debes iniciar una jornada primero",
        variant: "destructive"
      });
      navigate("/day-start");
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Monto inválido",
        description: "Por favor ingresa un monto válido",
        variant: "destructive"
      });
      return;
    }
    
    if (!category) {
      toast({
        title: "Categoría requerida",
        description: "Por favor selecciona una categoría",
        variant: "destructive"
      });
      return;
    }
    
    const newExpense: Expense = {
      id: generateId(),
      dayId: activeDay.start.id,
      timestamp,
      category,
      amount: parseFloat(amount),
      ...(description ? { description } : {}),
      ...(receiptImage ? { receiptImage } : {})
    };
    
    const updatedDay = {
      ...activeDay,
      expenses: [...activeDay.expenses, newExpense]
    };
    
    saveDay(updatedDay);
    setActiveDay(updatedDay);
    
    toast({
      title: "¡Gasto registrado!",
      description: `Has registrado un nuevo gasto de $${amount}`
    });
    
    navigate("/");
  };
  
  const handleImageCapture = () => {
    toast({
      title: "Funcionalidad en desarrollo",
      description: "La captura de imágenes estará disponible pronto"
    });
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
        <h1 className="text-xl font-bold">Nuevo Gasto</h1>
      </div>
      
      <Card className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="timestamp">Hora del gasto</Label>
          <Input
            id="timestamp"
            type="time"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
          />
        </div>
        
        <div className="space-y-3">
          <Label>Categoría</Label>
          <div className="grid grid-cols-2 gap-3">
            {expenseCategories.map((cat) => (
              <Button
                key={cat.id}
                type="button"
                variant="outline"
                className={`flex items-center justify-start h-16 ${category === cat.id ? 'ring-2 ring-primary' : ''}`}
                style={{ 
                  borderColor: category === cat.id ? cat.color : undefined,
                  backgroundColor: category === cat.id ? `${cat.color}15` : undefined
                }}
                onClick={() => setCategory(cat.id)}
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
                  style={{ backgroundColor: cat.color }}
                >
                  {category === cat.id ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : (
                    <span className="font-bold text-white text-xs">{cat.name.charAt(0)}</span>
                  )}
                </div>
                <span>{cat.name}</span>
              </Button>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amount">Monto del gasto *</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Ej. 20000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Descripción (opcional)</Label>
          <Textarea
            id="description"
            placeholder="Escribe una descripción del gasto..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>
        
        <div className="space-y-3">
          <Label>Comprobante (opcional)</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleImageCapture}
            >
              <Camera className="mr-2 h-4 w-4" />
              Tomar foto
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleImageCapture}
            >
              <Receipt className="mr-2 h-4 w-4" />
              Galería
            </Button>
          </div>
        </div>
      </Card>
      
      <Button 
        onClick={handleSaveExpense}
        className="w-full"
      >
        <Plus className="mr-2 h-5 w-5" />
        Guardar Gasto
      </Button>
    </div>
  );
};

export default ExpenseEntry;
