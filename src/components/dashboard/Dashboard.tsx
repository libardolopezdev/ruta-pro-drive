import React from "react";
import { useAppContext } from "../../context/AppContext";
import { generateId, saveDay } from "../../utils/storage";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { Play, PlusCircle, Clock, BanknoteIcon, Car } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PauseButton from "../tracking/PauseButton";

const Dashboard: React.FC = () => {
  const { userConfig, activeDay } = useAppContext();
  const navigate = useNavigate();

  const startNewDay = () => {
    navigate("/day-start");
  };

  const formattedDate = () => {
    const date = new Date();
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{formattedDate()}</h1>
        <p className="text-muted-foreground">
          {activeDay ? "Jornada activa" : "No hay jornada activa"}
        </p>
      </div>
      
      {!activeDay ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              <div className="bg-primary/10 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Play className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-medium mb-2">Comienza tu jornada</h2>
                <p className="text-muted-foreground text-sm">
                  Registra el inicio de tu jornada para comenzar a trackear tus servicios
                </p>
              </div>
              <Button onClick={startNewDay} className="w-full">
                Iniciar jornada
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Jornada Actual</span>
                <PauseButton />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 my-2">
                <div className="text-center">
                  <div className="flex items-center justify-center h-8 mb-1">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">Tiempo</p>
                  <p className="font-medium">{calculateTimeElapsed(activeDay.start.startTime)}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center h-8 mb-1">
                    <BanknoteIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-xs text-muted-foreground">Ingresos</p>
                  <p className="font-medium">${calculateTotalIncome(activeDay.incomes)}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center h-8 mb-1">
                    <Car className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">Servicios</p>
                  <p className="font-medium">{activeDay.incomes.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="flex-col py-6"
              onClick={() => navigate("/income")}
            >
              <PlusCircle className="h-6 w-6 mb-2 text-green-600" />
              <span>Nuevo ingreso</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-col py-6"
              onClick={() => navigate("/expenses")}
            >
              <PlusCircle className="h-6 w-6 mb-2 text-red-600" />
              <span>Nuevo egreso</span>
            </Button>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Resumen del día</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeDay.incomes.length > 0 ? (
                  <>
                    <h3 className="text-sm font-medium">Últimos servicios</h3>
                    <div className="space-y-3">
                      {activeDay.incomes.slice(0, 3).map((income, index) => (
                        <div key={income.id} className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className={`platform-badge platform-badge-${income.platform}`}>
                              {income.platform.charAt(0).toUpperCase() + income.platform.slice(1)}
                            </div>
                            <span className="ml-2 text-sm text-muted-foreground">
                              {formatTime(income.timestamp)}
                            </span>
                          </div>
                          <span className="font-medium">${income.amount}</span>
                        </div>
                      ))}
                      
                      {activeDay.incomes.length > 3 && (
                        <div className="text-center text-sm mt-2">
                          <Button variant="link" onClick={() => navigate("/income")}>
                            Ver todos ({activeDay.incomes.length})
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="font-bold">${calculateTotalIncome(activeDay.incomes)}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-4">No has registrado servicios hoy</p>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate("/income")}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Registrar servicio
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Gastos del día</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeDay.expenses.length > 0 ? (
                  <>
                    <div className="space-y-3">
                      {activeDay.expenses.slice(0, 3).map((expense) => (
                        <div key={expense.id} className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="bg-muted h-8 w-8 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium">
                                {expense.category.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-2">
                              <div className="text-sm font-medium">{getCategoryName(expense.category)}</div>
                              <div className="text-xs text-muted-foreground">{formatTime(expense.timestamp)}</div>
                            </div>
                          </div>
                          <span className="font-medium text-red-600">-${expense.amount}</span>
                        </div>
                      ))}
                      
                      {activeDay.expenses.length > 3 && (
                        <div className="text-center text-sm mt-2">
                          <Button variant="link" onClick={() => navigate("/expenses")}>
                            Ver todos ({activeDay.expenses.length})
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between">
                      <span className="font-medium">Total gastos</span>
                      <span className="font-bold text-red-600">-${calculateTotalExpenses(activeDay.expenses)}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-4">No has registrado gastos hoy</p>
                    <Button 
                      variant="outline"
                      onClick={() => navigate("/expenses")}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Registrar gasto
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-8">
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => navigate("/day-end")}
            >
              Finalizar jornada
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

// Helper functions
const calculateTimeElapsed = (startTime: string) => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0);
  
  const now = new Date();
  const diff = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60));
  
  const elapsedHours = Math.floor(diff / 60);
  const elapsedMinutes = diff % 60;
  
  return `${elapsedHours}h ${elapsedMinutes}m`;
};

const calculateTotalIncome = (incomes: Array<{amount: number}>) => {
  return incomes.reduce((sum, income) => sum + income.amount, 0);
};

const calculateTotalExpenses = (expenses: Array<{amount: number}>) => {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
};

const formatTime = (timestamp: string) => {
  const [hours, minutes] = timestamp.split(':');
  return `${hours}:${minutes}`;
};

const getCategoryName = (categoryId: string) => {
  const categories: Record<string, string> = {
    fuel: "Tanqueo",
    food: "Alimentación",
    wash: "Lavado",
    maintenance: "Mantenimiento",
    other: "Otro"
  };
  
  return categories[categoryId] || categoryId;
};

export default Dashboard;
