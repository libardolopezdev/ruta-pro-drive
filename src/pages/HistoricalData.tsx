import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext"; // ✅ Importamos contexto global
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { getDays } from "@/utils/storage";
import { Day } from "@/types";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const HistoricalData: React.FC = () => {
  const navigate = useNavigate();
  const [allDays, setAllDays] = useState<Day[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [netProfit, setNetProfit] = useState(0);

  // ✅ Obtén la configuración del usuario y define una moneda segura
  const { userConfig } = useAppContext();
  const currency = userConfig?.currency ?? { code: "COP", symbol: "$" };

  // Cargar todas las jornadas guardadas
  useEffect(() => {
    const savedDays = getDays();
    setAllDays(savedDays);

    let incomeSum = 0;
    let expenseSum = 0;

    savedDays.forEach((day) => {
      incomeSum += day.incomes.reduce((sum, income) => sum + income.amount, 0);
      expenseSum += day.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    });

    setTotalIncome(incomeSum);
    setTotalExpenses(expenseSum);
    setNetProfit(incomeSum - expenseSum);
  }, []);

  return (
    <div className="space-y-6 pb-24">
      {/* Botón de retroceso */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="text-sm text-muted-foreground flex items-center"
        >
          <ArrowLeft className="h-5 w-5 mr-2" /> Volver al inicio
        </button>
        <h1 className="text-2xl font-bold">Datos Históricos</h1>
      </div>

      {/* Estadísticas generales */}
      <Card>
        <CardHeader>
          <CardTitle>Estadísticas Generales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-primary/10 p-4 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Ingresos Totales</p>
              <p className="text-xl font-bold">{formatCurrency(totalIncome, currency)}</p>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Egresos Totales</p>
              <p className="text-xl font-bold">{formatCurrency(totalExpenses, currency)}</p>
            </div>
            <div className="bg-green-500/10 p-4 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Ganancia Neta</p>
              <p className="text-xl font-bold">{formatCurrency(netProfit, currency)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de jornadas */}
      <Card>
        <CardHeader>
          <CardTitle>Todas tus Jornadas</CardTitle>
        </CardHeader>
        <CardContent>
          {allDays.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay jornadas registradas.</p>
          ) : (
            <div className="space-y-2">
              {allDays.map((day, index) => {
                const dayIncome = day.incomes.reduce(
                  (sum, income) => sum + income.amount,
                  0
                );
                const dayExpenses = day.expenses.reduce(
                  (sum, expense) => sum + expense.amount,
                  0
                );
                const dayProfit = dayIncome - dayExpenses;

                return (
                  <div key={index} className="border rounded-lg p-3 text-sm">
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

export default HistoricalData;