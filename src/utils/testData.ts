
import { Day, DayStart, Income, Expense } from "../types";
import { saveDay, generateId, DEFAULT_PLATFORMS, DEFAULT_EXPENSE_CATEGORIES } from "./storage";

// Función para generar una fecha aleatoria dentro de un rango
const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Función para formatear fecha como YYYY-MM-DD
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Función para formatear hora como HH:MM
const formatTime = (date: Date): string => {
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

// Función para generar un número aleatorio entre min y max
const randomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Función para generar un elemento aleatorio de un array
const randomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Función para generar una jornada de prueba con servicios aleatorios
export const generateTestDay = (): Day => {
  // Generar fecha aleatoria en los últimos 30 días
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);
  
  const dayDate = randomDate(thirtyDaysAgo, today);
  const dayId = generateId();
  
  // Hora de inicio entre 5:00 y 8:00
  const startHour = randomNumber(5, 8);
  const startMinute = randomNumber(0, 59);
  dayDate.setHours(startHour, startMinute);
  
  // Datos iniciales de la jornada
  const dayStart: DayStart = {
    id: dayId,
    date: formatDate(dayDate),
    startTime: formatTime(dayDate),
    initialMileage: randomNumber(10000, 100000),
    initialCash: randomNumber(5000, 50000),
    notes: "Jornada generada automáticamente para pruebas",
    isActive: false
  };
  
  // Número de servicios entre 5 y 15 para esta jornada
  const numberOfServices = randomNumber(5, 15);
  const incomes: Income[] = [];
  
  // Plataformas seleccionadas para generar datos
  const selectedPlatforms = DEFAULT_PLATFORMS.filter(p => p.selected).map(p => p.id);
  if (selectedPlatforms.length === 0) selectedPlatforms.push("uber");
  
  // Métodos de pago disponibles
  const paymentMethods: Array<"cash" | "card" | "voucher" | "qr"> = ["cash", "card", "voucher", "qr"];
  
  // Generar servicios aleatorios
  for (let i = 0; i < numberOfServices; i++) {
    // Tiempo del servicio (entre inicio y 12 horas después)
    const serviceDate = new Date(dayDate);
    serviceDate.setMinutes(serviceDate.getMinutes() + randomNumber(10, 720));
    
    // Crear servicio
    incomes.push({
      id: generateId(),
      dayId: dayId,
      timestamp: formatTime(serviceDate),
      platform: randomItem(selectedPlatforms),
      amount: randomNumber(5000, 25000),
      paymentMethod: randomItem(paymentMethods),
      tollIncluded: Math.random() > 0.8,  // 20% de probabilidad de tener peaje
      ...(Math.random() > 0.8 ? { tollAmount: randomNumber(2000, 8000) } : {}),
      ...(Math.random() > 0.7 ? { notes: "Nota generada automáticamente" } : {})
    });
  }
  
  // Ordenar servicios por hora
  incomes.sort((a, b) => {
    const timeA = a.timestamp.split(':').map(Number);
    const timeB = b.timestamp.split(':').map(Number);
    return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
  });
  
  // Número de gastos entre 1 y 5 para esta jornada
  const numberOfExpenses = randomNumber(1, 5);
  const expenses: Expense[] = [];
  
  // Categorías de gastos disponibles
  const expenseCategories = DEFAULT_EXPENSE_CATEGORIES.map(cat => cat.id);
  
  // Generar gastos aleatorios
  for (let i = 0; i < numberOfExpenses; i++) {
    // Tiempo del gasto (entre inicio y final del último servicio)
    const expenseDate = new Date(dayDate);
    expenseDate.setMinutes(expenseDate.getMinutes() + randomNumber(10, 720));
    
    // Crear gasto
    expenses.push({
      id: generateId(),
      dayId: dayId,
      timestamp: formatTime(expenseDate),
      category: randomItem(expenseCategories),
      amount: randomNumber(2000, 50000),
      ...(Math.random() > 0.5 ? { description: "Descripción generada automáticamente" } : {})
    });
  }
  
  // Ordenar gastos por hora
  expenses.sort((a, b) => {
    const timeA = a.timestamp.split(':').map(Number);
    const timeB = b.timestamp.split(':').map(Number);
    return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
  });
  
  // Generar pausas aleatorias (0 a 3)
  const numberOfPauses = randomNumber(0, 3);
  const pauses = [];
  
  for (let i = 0; i < numberOfPauses; i++) {
    const pauseStartDate = new Date(dayDate);
    pauseStartDate.setMinutes(pauseStartDate.getMinutes() + randomNumber(60, 480));
    
    const pauseEndDate = new Date(pauseStartDate);
    pauseEndDate.setMinutes(pauseEndDate.getMinutes() + randomNumber(15, 60));
    
    pauses.push({
      start: formatTime(pauseStartDate),
      end: formatTime(pauseEndDate)
    });
  }
  
  // Hora de fin (entre la última actividad y 2 horas después)
  const lastActivityTime = [...incomes, ...expenses].reduce((latest, current) => {
    const currentTime = current.timestamp.split(':').map(Number);
    const currentMinutes = currentTime[0] * 60 + currentTime[1];
    return Math.max(latest, currentMinutes);
  }, 0);
  
  const endTimeMinutes = lastActivityTime + randomNumber(30, 120);
  const endHour = Math.floor(endTimeMinutes / 60);
  const endMinute = endTimeMinutes % 60;
  
  // Crear y devolver la jornada completa
  return {
    start: dayStart,
    incomes,
    expenses,
    pauses,
    end: {
      endTime: `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`,
      finalMileage: dayStart.initialMileage + randomNumber(50, 200),
      notes: Math.random() > 0.5 ? "Notas finales generadas automáticamente" : undefined
    }
  };
};

// Función para generar múltiples jornadas de prueba
export const generateTestData = (numberOfDays: number): Day[] => {
  const testDays: Day[] = [];
  
  for (let i = 0; i < numberOfDays; i++) {
    testDays.push(generateTestDay());
  }
  
  return testDays;
};

// Función para guardar los datos de prueba en el almacenamiento local
export const saveTestData = (days: Day[]): void => {
  days.forEach(day => saveDay(day));
};
