import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Clock,
  Activity,
  CreditCard,
  BanknoteIcon,
  QrCode,
  Ticket,
  Calendar,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/utils/format";
import { getDays } from "@/utils/storage";
import { Day } from "@/types";

// Importa xlsx para exportar datos
import * as XLSX from "xlsx";

const StatsSummary: React.FC = () => {
  const { activeDay, userConfig } = useAppContext();
  const navigate = useNavigate();

  // Datos históricos
  const [allDays, setAllDays] = useState<Day[]>([]);
  const [filteredDays, setFilteredDays] = useState<Day[]>([]);
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);

  // Estadísticas
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [mostUsedPlatform, setMostUsedPlatform] = useState("");
  const [highestCount, setHighestCount] = useState(0);
  const [timeWorked, setTimeWorked] = useState({ hours: 0, minutes: 0 });

  // Selector de fechas
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Moneda segura por defecto
  const currency = userConfig?.currency ?? { code: "COP", symbol: "$" };

  // Cargar todos los días al iniciar
  useEffect(() => {
    const savedDays = getDays();
    setAllDays(savedDays);

    if (activeDay) {
      setSelectedDay(activeDay);
    } else if (savedDays.length > 0) {
      const sortedDays = [...savedDays].sort((a, b) => {
        const dateA = new Date(a.start.date).getTime();
        const dateB = new Date(b.start.date).getTime();
        return dateB - dateA;
      });
      setSelectedDay(sortedDays[0]);
    }
  }, [activeDay]);

  // Filtrar días según las fechas seleccionadas
  useEffect(() => {
    let filtered = [...allDays];
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filtered = allDays.filter(day => {
        const dayDate = new Date(day.start.date);
        return dayDate >= start && dayDate <= end;
      });
    }
    setFilteredDays(filtered);
  }, [startDate, endDate, allDays]);

  // Calcular estadísticas del primer día si no hay filtro
  useEffect(() => {
    if (!startDate && !endDate && allDays.length > 0) {
      setSelectedDay(allDays[0]);
    }
  }, [allDays, startDate, endDate]);

  // Calcular estadísticas globales de los días filtrados
  useEffect(() => {
    if (filteredDays.length === 0) return;

    let incomeSum = 0;
    let expenseSum = 0;
    let counts: Record<string, number> = {};
    let totalHours = 0;
    let totalMinutes = 0;

    filteredDays.forEach((day) => {
      incomeSum += day.incomes.reduce((sum, income) => sum + income.amount, 0);
      expenseSum += day.expenses.reduce((sum, expense) => sum + expense.amount, 0);

      // Contar servicios por plataforma
      day.incomes.forEach(income => {
        counts[income.platform] = (counts[income.platform] || 0) + 1;
      });

      // Tiempo trabajado
      const dayTime = calculateTimeWorked(day);
      totalHours += dayTime.hours;
      totalMinutes += dayTime.minutes;

      while (totalMinutes >= 60) {
        totalHours++;
        totalMinutes -= 60;
      }
    });

    setTotalIncome(incomeSum);
    setTotalExpenses(expenseSum);
    setMostUsedPlatform(
      Object.entries(counts).reduce((a, b) => (b[1] > a[1] ? b : a), ["", 0])[0]
    );
    setHighestCount(counts[mostUsedPlatform] || 0);
    setTimeWorked({ hours: totalHours, minutes: totalMinutes });
  }, [filteredDays]);

  // Función para calcular tiempo trabajado
  const calculateTimeWorked = (day: Day) => {
    if (day.end) {
      const [startHours, startMinutes] = day.start.startTime.split(":").map(Number);
      const [endHours, endMinutes] = day.end.endTime.split(":").map(Number);
      let diffMinutes =
        endHours * 60 + endMinutes - (startHours * 60 + startMinutes);
      if (diffMinutes < 0) diffMinutes += 24 * 60;

      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return { hours, minutes };
    } else {
      const [startHours, startMinutes] = day.start.startTime.split(":").map(Number);
      const startDate = new Date();
      startDate.setHours(startHours, startMinutes, 0, 0);
      const now = new Date();
      const diffMinutes = Math.floor(
        (now.getTime() - startDate.getTime()) / (1000 * 60)
      );
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return { hours, minutes };
    }
  };

  // Datos para gráficos
  const barData = filteredDays.map(day => {
    const income = day.incomes.reduce((sum, i) => sum + i.amount, 0);
    const expense = day.expenses.reduce((sum, e) => sum + e.amount, 0);
    const profit = income - expense;
    return {
      Fecha: day.start.date,
      Ingresos: income,
      Egresos: expense,
      Ganancia: profit,
    };
  });

  const pieData = Object.entries(
    filteredDays.reduce((acc: Record<string, number>, day) => {
      day.expenses.forEach(expense => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      });
      return acc;
    }, {})
  ).map(([category, value]) => ({
    name: getCategoryName(category),
    value,
  }));

  const netProfit = totalIncome - totalExpenses;

  // Función para exportar a Excel
  const exportToExcel = () => {
    const worksheetData = filteredDays.map(day => {
      const income = day.incomes.reduce((sum, income) => sum + income.amount, 0);
      const expense = day.expenses.reduce((sum, expense) => sum + expense.amount, 0);
      const profit = income - expense;
      return {
        Fecha: day.start.date,
        Ingresos: `${currency.symbol}${income}`,
        Egresos: `${currency.symbol}${expense}`,
        Ganancia: `${currency.symbol}${profit}`,
        Servicios: day.incomes.length,
        "Tiempo trabajado": `${calculateTimeWorked(day).hours}h ${calculateTimeWorked(day).minutes}m`
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jornadas");

    // Descargar el archivo
    XLSX.writeFile(workbook, "RutaPro_Export.xlsx");
  };

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6">
      {/* Título y botones */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold">Estadísticas</h1>

        <div className="flex flex-col sm:flex-row gap-4">
          {!selectedDay || selectedDay !== activeDay ? (
            <button
              className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start"
              onClick={() => navigate("/historical")}
            >
              <Calendar className="h-4 w-4 mr-1" /> Ver datos históricos
            </button>
          ) : null}

          <button
            className="w-full sm:w-auto text-sm bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center justify-center"
            onClick={exportToExcel}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar a Excel
          </button>
        </div>
      </div>

      {/* Filtro de fechas */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Filtrar por rango de fechas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="start-date">Fecha inicial</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="end-date">Fecha final</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen general */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Resumen general</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-primary/10 p-4 rounded-lg text-center">
              <TrendingUp className="h-5 w-5 mx-auto mb-1 text-green-500" />
              <p className="text-sm text-muted-foreground">Ingresos Totales</p>
              <p className="text-xl font-bold">{formatCurrency(totalIncome, currency)}</p>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg text-center">
              <TrendingDown className="h-5 w-5 mx-auto mb-1 text-red-500" />
              <p className="text-sm text-muted-foreground">Egresos Totales</p>
              <p className="text-xl font-bold">{formatCurrency(totalExpenses, currency)}</p>
            </div>
            <div className="bg-green-500/10 p-4 rounded-lg text-center">
              <ArrowRight className="h-5 w-5 mx-auto mb-1 text-emerald-500" />
              <p className="text-sm text-muted-foreground">Ganancia Neta</p>
              <p className="text-xl font-bold">{formatCurrency(netProfit, currency)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Servicios */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Servicios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-primary/10 p-4 rounded-lg">
              <Activity className="h-6 w-6 mb-2 text-blue-500" />
              <div className="text-sm text-muted-foreground">Total servicios</div>
              <div className="text-xl font-bold">
                {filteredDays.reduce((acc, day) => acc + day.incomes.length, 0)}
              </div>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg">
              <Clock className="h-6 w-6 mb-2 text-amber-500" />
              <div className="text-sm text-muted-foreground">Tiempo trabajado</div>
              <div className="text-xl font-bold">
                {timeWorked.hours}h {timeWorked.minutes}m
              </div>
            </div>
          </div>

          {Object.keys(filteredDays).length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Servicios por plataforma</h3>
              <div className="space-y-2">
                {Object.entries(
                  filteredDays.reduce((acc: Record<string, number>, day) => {
                    day.incomes.forEach(income => {
                      acc[income.platform] = (acc[income.platform] || 0) + 1;
                    });
                    return acc;
                  }, {})
                )
                  .sort((a, b) => b[1] - a[1])
                  .map(([platform, count]) => (
                    <div key={platform} className="flex justify-between items-center">
                      <div className={`platform-badge platform-badge-${platform}`}>
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </div>
                      <div className="font-medium">
                        {count} {count === 1 ? "servicio" : "servicios"}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <Separator />

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Distribución de gastos</h3>
            {Object.entries(
              filteredDays.reduce((acc: Record<string, number>, day) => {
                day.expenses.forEach((expense) => {
                  acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
                });
                return acc;
              }, {})
            ).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(
                  filteredDays.reduce((acc: Record<string, number>, day) => {
                    day.expenses.forEach((expense) => {
                      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
                    });
                    return acc;
                  }, {})
                ).map(([category, amount]) => {
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
                        <span className="text-muted-foreground mr-2">
                          {formatCurrency(amount, currency)}
                        </span>
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

      {/* Gráfico de barras */}
      <Card>
        <CardHeader>
          <CardTitle>Ingresos vs Egresos</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Fecha" />
              <YAxis tickFormatter={(value) => `${currency.symbol}${value.toLocaleString()}`} />
              <RechartsTooltip formatter={(value) => [value.toLocaleString(), "Valor"]} />
              <Legend />
              <Bar dataKey="Ingresos" fill="#10b981" />
              <Bar dataKey="Egresos" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de torta */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución de gastos</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name)} />
                ))}
              </Pie>
              <RechartsTooltip
                formatter={(value, name) => [`${currency.symbol}${value}`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Lista de jornadas */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Jornadas registradas</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredDays.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay jornadas en este período.</p>
          ) : (
            <div className="space-y-3">
              {filteredDays.map((day, index) => {
                const dayIncome = day.incomes.reduce((sum, income) => sum + income.amount, 0);
                const dayExpenses = day.expenses.reduce((sum, expense) => sum + expense.amount, 0);
                const dayProfit = dayIncome - dayExpenses;
                return (
                  <div key={index} className="border rounded-lg p-3 text-sm shadow-sm">
                    <div className="font-medium">{day.start.date}</div>
                    <div>Ingresos: {formatCurrency(dayIncome, currency)}</div>
                    <div>Egresos: {formatCurrency(dayExpenses, currency)}</div>
                    <div>Ganancia: {formatCurrency(dayProfit, currency)}</div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
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
    other: "Otro",
  };
  return categories[categoryId] || categoryId;
};

const getCategoryColor = (categoryId: string): string => {
  const colors: Record<string, string> = {
    fuel: "#f97316",
    food: "#84cc16",
    wash: "#0ea5e9",
    maintenance: "#8b5cf6",
    other: "#64748b",
  };
  return colors[categoryId] || "#888888";
};

export default StatsSummary;