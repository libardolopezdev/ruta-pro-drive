
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAppContext, AppProvider } from "../context/AppContext";
import AppLayout from "../components/Layout/AppLayout";
import OnboardingFlow from "../components/onboarding/OnboardingFlow";
import Dashboard from "../components/dashboard/Dashboard";
import DayStart from "../components/tracking/DayStart";
import DayEnd from "../components/tracking/DayEnd";
import IncomeEntry from "../components/tracking/IncomeEntry";
import ExpenseEntry from "../components/tracking/ExpenseEntry";
import StatsSummary from "../components/statistics/StatsSummary";
import Settings from "../components/settings/Settings";
import { toast } from "@/components/ui/use-toast";

const Index: React.FC = () => {
  return (
    <AppProvider>
      <IndexContent />
    </AppProvider>
  );
};

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { activeDay } = useAppContext();
  
  if (!activeDay) {
    toast({
      title: "Jornada no iniciada",
      description: "Debes iniciar una jornada para acceder a esta página",
      variant: "destructive",
    });
    return <Navigate to="/day-start" replace />;
  }
  
  return <>{children}</>;
};

const IndexContent: React.FC = () => {
  const { hasCompletedSetup, userConfig, activeDay } = useAppContext();
  
  if (!hasCompletedSetup) {
    return <OnboardingFlow />;
  }
  
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={
          activeDay ? <Dashboard /> : <Navigate to="/day-start" replace />
        } />
        <Route path="/day-start" element={<DayStart />} />
        
        {/* Protected routes - Only accessible with active day */}
        <Route path="/day-end" element={
          <ProtectedRoute>
            <DayEnd />
          </ProtectedRoute>
        } />
        <Route path="/income" element={
          <ProtectedRoute>
            <IncomeEntry />
          </ProtectedRoute>
        } />
        <Route path="/expenses" element={
          <ProtectedRoute>
            <ExpenseEntry />
          </ProtectedRoute>
        } />
        <Route path="/stats" element={
          <ProtectedRoute>
            <StatsSummary />
          </ProtectedRoute>
        } />
        
        {/* Settings is always accessible */}
        <Route path="/settings" element={<Settings />} />
        
        {/* Redirect to appropriate page if route not found */}
        <Route path="*" element={
          activeDay ? <Navigate to="/" replace /> : <Navigate to="/day-start" replace />
        } />
      </Routes>
    </AppLayout>
  );
};

export default Index;
