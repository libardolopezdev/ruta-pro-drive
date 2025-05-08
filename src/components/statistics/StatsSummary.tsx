
import React from "react";
import { useAppContext } from "../../context/AppContext";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { ArrowRight, TrendingUp, TrendingDown, Clock, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StatsSummary: React.FC = () => {
  const { activeDay } = useAppContext();
  const navigate = useNavigate();
  
  if (!activeDay) {
    return (
      <div className="text-center py-10 space-y-4">
        <h2 className="text-xl font-medium">No hay datos para mostrar</h2>
        <p className="text-muted-foreground">
          Inicia una jornada para ver estadísticas
        </p>
        <button
          onClick={() => navigate("/day-start")}
          className="text-primary underline"
        >
          Iniciar jornada
        </button>
      </div>
    );
  }
  
  // Calculate statistics
  const totalIncome = activeDay.incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = activeDay.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netProfit = totalIncome - totalExpenses;
  
  // Count services by platform
  const platformCounts: Record<string, number> = {};
  
  activeDay.incomes.forEach(income => {
    platformCounts[income.platform] = (platformCounts[income.platform] || 0) + 1;
  });
  
  // Find most used platform
  let mostUsedPlatform = "";
  let highestCount = 0;
  
  Object.entries(platformCounts).forEach(([platform, count]) => {
    if (count > highestCount) {
      mostUsedPlatform = platform;
      highestCount = count;
    }
  });
  
  // Count expenses by category
  const expensesByCategory: Record<string, number> = {};
  
  activeDay.expenses.forEach(expense => {
    expensesByCategory[expense.category] = (expensesByCategory[expense.category] || 0) + expense.amount;
  });
  
  // Calculate time worked
  const calculateTimeWorked = () => {
    const [startHours, startMinutes] = activeDay.start.startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(startHours, startMinutes, 0, 0);
    
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60));
    
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    return { hours, minutes };
  };
  
  const timeWorked = calculateTimeWorked();
  
  // Format numbers
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Estadísticas</h1>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Resumen del día</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary/10 p-4 rounded-lg">
              <TrendingUp className="h-6 w-6 mb-2 text-green-500" />
              <div className="text-sm text-muted-foreground">Ingresos</div>
              <div className="text-xl font-bold">{formatCurrency(totalIncome)}</div>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg">
              <TrendingDown className="h-6 w-6 mb-2 text-red-500" />
              <div className="text-sm text-muted-foreground">Egresos</div>
              <div className="text-xl font-bold">{formatCurrency(totalExpenses)}</div>
            </div>
          </div>
          
          <div className="bg-primary/10 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-muted-foreground">Ganancia Neta</div>
                <div className="text-2xl font-bold">{formatCurrency(netProfit)}</div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Servicios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary/10 p-4 rounded-lg">
              <Activity className="h-6 w-6 mb-2 text-blue-500" />
              <div className="text-sm text-muted-foreground">Total servicios</div>
              <div className="text-xl font-bold">{activeDay.incomes.length}</div>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg">
              <Clock className="h-6 w-6 mb-2 text-amber-500" />
              <div className="text-sm text-muted-foreground">Tiempo trabajado</div>
              <div className="text-xl font-bold">{timeWorked.hours}h {timeWorked.minutes}m</div>
            </div>
          </div>
          
          {activeDay.incomes.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Plataforma más usada</h3>
              <div className={`platform-badge platform-badge-${mostUsedPlatform}`}>
                {mostUsedPlatform.charAt(0).toUpperCase() + mostUsedPlatform.slice(1)} ({platformCounts[mostUsedPlatform]})
              </div>
            </div>
          )}
          
          {activeDay.incomes.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Promedio por servicio</h3>
              <div className="font-medium">
                {formatCurrency(totalIncome / activeDay.incomes.length)}
              </div>
            </div>
          )}
          
          <Separator />
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Distribución de gastos</h3>
            {Object.entries(expensesByCategory).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(expensesByCategory).map(([category, amount]) => {
                  const categoryName = getCategoryName(category);
                  const percentage = Math.round((amount / totalExpenses) * 100);
                  
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: getCategoryColor(category) }}
                        ></div>
                        <span>{categoryName}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-muted-foreground mr-2">{formatCurrency(amount)}</span>
                        <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No hay gastos registrados</div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center text-sm text-muted-foreground py-4">
        Próximamente: Gráficos detallados y reportes
      </div>
    </div>
  );
};

// Helper functions
const getCategoryName = (categoryId: string): string => {
  const categories: Record<string, string> = {
    fuel: "Tanqueo",
    food: "Alimentación",
    wash: "Lavado",
    maintenance: "Mantenimiento",
    other: "Otro"
  };
  
  return categories[categoryId] || categoryId;
};

const getCategoryColor = (categoryId: string): string => {
  const colors: Record<string, string> = {
    fuel: "#f97316",
    food: "#84cc16",
    wash: "#0ea5e9",
    maintenance: "#8b5cf6",
    other: "#64748b"
  };
  
  return colors[categoryId] || "#888888";
};

export default StatsSummary;
