
import React, { useMemo, useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { ArrowRight, TrendingUp, TrendingDown, Clock, Activity, CreditCard, BanknoteIcon, QrCode, Ticket, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/utils/format";
import { getDays } from "@/utils/storage";
import { Day } from "@/types";

const StatsSummary: React.FC = () => {
  const { activeDay, userConfig } = useAppContext();
  const navigate = useNavigate();
  const [allDays, setAllDays] = useState<Day[]>([]);
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);
  
  // Load all days from storage
  useEffect(() => {
    const savedDays = getDays();
    setAllDays(savedDays);
    
    // Use active day if available, otherwise use the most recent completed day
    if (activeDay) {
      setSelectedDay(activeDay);
    } else if (savedDays.length > 0) {
      // Find the most recent completed day
      const sortedDays = [...savedDays].sort((a, b) => {
        const dateA = new Date(a.start.date).getTime();
        const dateB = new Date(b.start.date).getTime();
        return dateB - dateA; // Sort in descending order (newest first)
      });
      
      setSelectedDay(sortedDays[0]);
    }
  }, [activeDay]);
  
  // If there's no data at all
  if (!selectedDay && allDays.length === 0) {
    return (
      <div className="text-center py-10 space-y-4">
        <h2 className="text-xl font-medium">No hay datos para mostrar</h2>
        <p className="text-muted-foreground">
          Inicia una jornada para generar estadísticas
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
  
  // Use the selected day for statistics
  const dayToDisplay = selectedDay;
  
  if (!dayToDisplay) {
    return <div>Cargando estadísticas...</div>;
  }
  
  // Calculate statistics
  const totalIncome = dayToDisplay.incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = dayToDisplay.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netProfit = totalIncome - totalExpenses;
  
  // Count services by platform
  const platformCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    
    dayToDisplay.incomes.forEach(income => {
      counts[income.platform] = (counts[income.platform] || 0) + 1;
    });
    
    return counts;
  }, [dayToDisplay]);
  
  // Find most used platform
  let mostUsedPlatform = "";
  let highestCount = 0;
  
  Object.entries(platformCounts).forEach(([platform, count]) => {
    if (count > highestCount) {
      mostUsedPlatform = platform;
      highestCount = count;
    }
  });
  
  // Income by payment method
  const incomeByPaymentMethod = useMemo(() => {
    const summary: Record<string, number> = {
      cash: 0,
      card: 0,
      voucher: 0,
      qr: 0
    };
    
    dayToDisplay.incomes.forEach(income => {
      summary[income.paymentMethod] += income.amount;
    });
    
    return summary;
  }, [dayToDisplay]);
  
  // Count expenses by category
  const expensesByCategory = useMemo(() => {
    const expenses: Record<string, number> = {};
    
    dayToDisplay.expenses.forEach(expense => {
      expenses[expense.category] = (expenses[expense.category] || 0) + expense.amount;
    });
    
    return expenses;
  }, [dayToDisplay]);
  
  // Calculate time worked
  const calculateTimeWorked = () => {
    if (dayToDisplay.end) {
      // If day has ended, calculate from start time to end time
      const [startHours, startMinutes] = dayToDisplay.start.startTime.split(':').map(Number);
      const [endHours, endMinutes] = dayToDisplay.end.endTime.split(':').map(Number);
      
      let diffMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
      if (diffMinutes < 0) diffMinutes += 24 * 60; // Handle cases crossing midnight
      
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      
      return { hours, minutes };
    } else {
      // If active day, calculate from start time to now
      const [startHours, startMinutes] = dayToDisplay.start.startTime.split(':').map(Number);
      const startDate = new Date();
      startDate.setHours(startHours, startMinutes, 0, 0);
      
      const now = new Date();
      const diffMinutes = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60));
      
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      
      return { hours, minutes };
    }
  };
  
  const timeWorked = calculateTimeWorked();
  const isActiveDay = dayToDisplay === activeDay;
  
  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Estadísticas</h1>
        {!isActiveDay && (
          <div className="text-sm text-muted-foreground flex items-center">
            <Calendar className="h-4 w-4 mr-1" /> 
            Datos históricos
          </div>
        )}
      </div>
      
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
              <div className="text-xl font-bold">{dayToDisplay.incomes.length}</div>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg">
              <Clock className="h-6 w-6 mb-2 text-amber-500" />
              <div className="text-sm text-muted-foreground">Tiempo trabajado</div>
              <div className="text-xl font-bold">{timeWorked.hours}h {timeWorked.minutes}m</div>
            </div>
          </div>
          
          {Object.keys(platformCounts).length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Servicios por plataforma</h3>
              <div className="space-y-2">
                {Object.entries(platformCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([platform, count]) => (
                    <div key={platform} className="flex justify-between items-center">
                      <div className={`platform-badge platform-badge-${platform}`}>
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </div>
                      <div className="font-medium">{count} {count === 1 ? 'servicio' : 'servicios'}</div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
          
          {dayToDisplay.incomes.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Promedio por servicio</h3>
              <div className="font-medium">
                {formatCurrency(totalIncome / dayToDisplay.incomes.length)}
              </div>
            </div>
          )}
          
          <Separator />
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Ingresos por método de pago</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <BanknoteIcon className="h-5 w-5 text-green-600 mr-2" />
                  <span>Efectivo</span>
                </div>
                <span className="font-medium">{formatCurrency(incomeByPaymentMethod.cash)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
                  <span>Tarjeta</span>
                </div>
                <span className="font-medium">{formatCurrency(incomeByPaymentMethod.card)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Ticket className="h-5 w-5 text-purple-600 mr-2" />
                  <span>Vale</span>
                </div>
                <span className="font-medium">{formatCurrency(incomeByPaymentMethod.voucher)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <QrCode className="h-5 w-5 text-indigo-600 mr-2" />
                  <span>QR</span>
                </div>
                <span className="font-medium">{formatCurrency(incomeByPaymentMethod.qr)}</span>
              </div>
            </div>
          </div>
          
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
