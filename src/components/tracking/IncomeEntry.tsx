
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { saveDay, generateId } from "../../utils/storage";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Switch } from "../../components/ui/switch";
import { Separator } from "../../components/ui/separator";
import { ArrowLeft, Plus, Check } from "lucide-react";
import { useToast } from "../../components/ui/use-toast";
import { Income } from "../../types";

const IncomeEntry: React.FC = () => {
  const { activeDay, setActiveDay, userConfig } = useAppContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get selected platforms
  const selectedPlatforms = userConfig.platforms.filter(p => p.selected);
  
  // Current time formatted as HH:MM
  const now = new Date();
  const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  const [timestamp, setTimestamp] = useState(formattedTime);
  const [platform, setPlatform] = useState(selectedPlatforms.length > 0 ? selectedPlatforms[0].id : "");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "voucher" | "qr">("cash");
  const [tollIncluded, setTollIncluded] = useState(false);
  const [tollAmount, setTollAmount] = useState("");
  const [notes, setNotes] = useState("");
  
  const handleSaveIncome = () => {
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
    
    if (!platform) {
      toast({
        title: "Plataforma requerida",
        description: "Por favor selecciona una plataforma",
        variant: "destructive"
      });
      return;
    }
    
    const newIncome: Income = {
      id: generateId(),
      dayId: activeDay.start.id,
      timestamp,
      platform,
      amount: parseFloat(amount),
      paymentMethod,
      tollIncluded,
      ...(tollIncluded && tollAmount ? { tollAmount: parseFloat(tollAmount) } : {}),
      ...(notes ? { notes } : {})
    };
    
    const updatedDay = {
      ...activeDay,
      incomes: [...activeDay.incomes, newIncome]
    };
    
    saveDay(updatedDay);
    setActiveDay(updatedDay);
    
    toast({
      title: "¡Ingreso registrado!",
      description: `Has registrado un nuevo ingreso de $${amount}`
    });
    
    navigate("/");
  };
  
  const getPlatformColor = (platformId: string) => {
    const platform = userConfig.platforms.find(p => p.id === platformId);
    return platform ? platform.color : "#888";
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
        <h1 className="text-xl font-bold">Nuevo Ingreso</h1>
      </div>
      
      <Card className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="timestamp">Hora del servicio</Label>
          <Input
            id="timestamp"
            type="time"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
          />
        </div>
        
        <div className="space-y-3">
          <Label>Plataforma</Label>
          <div className="grid grid-cols-3 gap-2">
            {selectedPlatforms.map((p) => (
              <Button
                key={p.id}
                type="button"
                variant="outline"
                className={`flex flex-col items-center justify-center h-20 ${platform === p.id ? 'ring-2 ring-primary' : ''}`}
                style={{ 
                  borderColor: platform === p.id ? p.color : undefined,
                  backgroundColor: platform === p.id ? `${p.color}15` : undefined
                }}
                onClick={() => setPlatform(p.id)}
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center mb-1"
                  style={{ backgroundColor: p.color }}
                >
                  {platform === p.id ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : (
                    <span className="font-bold text-white text-xs">{p.name.charAt(0)}</span>
                  )}
                </div>
                <span className="text-xs">{p.name}</span>
              </Button>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amount">Monto del servicio *</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Ej. 12000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-3">
          <Label>Método de pago</Label>
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant={paymentMethod === "cash" ? "default" : "outline"}
              className={paymentMethod === "cash" ? "bg-green-600 hover:bg-green-700" : ""}
              onClick={() => setPaymentMethod("cash")}
            >
              Efectivo
            </Button>
            
            <Button
              type="button"
              variant={paymentMethod === "card" ? "default" : "outline"}
              className={paymentMethod === "card" ? "bg-blue-600 hover:bg-blue-700" : ""}
              onClick={() => setPaymentMethod("card")}
            >
              Tarjeta
            </Button>
            
            <Button
              type="button"
              variant={paymentMethod === "voucher" ? "default" : "outline"}
              className={paymentMethod === "voucher" ? "bg-purple-600 hover:bg-purple-700" : ""}
              onClick={() => setPaymentMethod("voucher")}
            >
              Vale
            </Button>
            
            <Button
              type="button"
              variant={paymentMethod === "qr" ? "default" : "outline"}
              className={paymentMethod === "qr" ? "bg-indigo-600 hover:bg-indigo-700" : ""}
              onClick={() => setPaymentMethod("qr")}
            >
              QR
            </Button>
          </div>
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="tollIncluded">Incluye peaje</Label>
            <p className="text-sm text-muted-foreground">
              Activa si el servicio incluyó peaje
            </p>
          </div>
          <Switch
            id="tollIncluded"
            checked={tollIncluded}
            onCheckedChange={setTollIncluded}
          />
        </div>
        
        {tollIncluded && (
          <div className="space-y-2">
            <Label htmlFor="tollAmount">Monto del peaje</Label>
            <Input
              id="tollAmount"
              type="number"
              placeholder="Ej. 5000"
              value={tollAmount}
              onChange={(e) => setTollAmount(e.target.value)}
            />
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="notes">Notas (opcional)</Label>
          <Textarea
            id="notes"
            placeholder="Escribe alguna nota sobre el servicio..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
          />
        </div>
      </Card>
      
      <Button 
        onClick={handleSaveIncome}
        className="w-full"
      >
        <Plus className="mr-2 h-5 w-5" />
        Guardar Servicio
      </Button>
    </div>
  );
};

export default IncomeEntry;
