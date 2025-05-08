
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateTestData, saveTestData } from "../../utils/testData";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useToast } from "../../components/ui/use-toast";
import { ArrowLeft, Database, Play } from "lucide-react";
import { Progress } from "../../components/ui/progress";

const TestDataGenerator: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [numberOfDays, setNumberOfDays] = useState("10");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedDays, setGeneratedDays] = useState<number>(0);
  
  const handleGenerateData = () => {
    const days = parseInt(numberOfDays);
    
    if (isNaN(days) || days <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor ingresa un número válido de días",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    setProgress(0);
    setGeneratedDays(0);
    
    // Generar datos en bloques para no bloquear la UI
    const batchSize = 5;
    const totalBatches = Math.ceil(days / batchSize);
    let currentBatch = 0;
    
    const generateBatch = () => {
      const remainingDays = days - (currentBatch * batchSize);
      const batchDays = Math.min(batchSize, remainingDays);
      
      const testDays = generateTestData(batchDays);
      saveTestData(testDays);
      
      currentBatch++;
      setGeneratedDays(prev => prev + batchDays);
      const newProgress = Math.round((currentBatch / totalBatches) * 100);
      setProgress(newProgress);
      
      if (currentBatch < totalBatches) {
        // Programar el siguiente lote
        setTimeout(generateBatch, 100);
      } else {
        // Finalizar la generación
        setIsGenerating(false);
        toast({
          title: "Datos generados correctamente",
          description: `Se han generado ${days} días con servicios aleatorios`,
          variant: "default"
        });
      }
    };
    
    // Iniciar la generación
    generateBatch();
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
        <h1 className="text-xl font-bold">Generador de Datos de Prueba</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Generar Datos Aleatorios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="numberOfDays">Número de días a generar</Label>
            <Input
              id="numberOfDays"
              type="number"
              value={numberOfDays}
              onChange={(e) => setNumberOfDays(e.target.value)}
              placeholder="10"
              disabled={isGenerating}
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            Cada día tendrá entre 5 y 15 servicios y entre 1 y 5 gastos con datos aleatorios.
          </div>
          
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Generando datos...</span>
                <span>{generatedDays} / {numberOfDays} días</span>
              </div>
              <Progress value={progress} />
            </div>
          )}
          
          <Button
            onClick={handleGenerateData}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <span>Generando...</span>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                <span>Generar Datos de Prueba</span>
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      
      <div className="text-sm text-muted-foreground text-center">
        <p>Esta herramienta generará datos de prueba para que puedas evaluar la aplicación.</p>
        <p>Todos los datos son aleatorios y se guardarán en el almacenamiento local de tu navegador.</p>
      </div>
    </div>
  );
};

export default TestDataGenerator;
