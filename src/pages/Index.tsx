
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
import { Button } from "@/components/ui/button";
import { StopCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const Index: React.FC = () => {
  return (
    <AppProvider>
      <IndexContent />
    </AppProvider>
  );
};

// Protected route component for routes that require an active day
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
  const location = useLocation();
  
  if (!hasCompletedSetup) {
    return <OnboardingFlow />;
  }
  
  // Don't show end day button on the day-end page
  const showEndDayButton = activeDay && location.pathname !== '/day-end';
  
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={
          activeDay ? <Dashboard /> : <Navigate to="/day-start" replace />
        } />
        <Route path="/day-start" element={<DayStart />} />
        <Route path="/day-end" element={<DayEnd />} />
        
        {/* Protected routes - Only accessible with active day */}
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
        
        {/* Statistics is now accessible without an active day */}
        <Route path="/stats" element={<StatsSummary />} />
        
        {/* Settings is always accessible */}
        <Route path="/settings" element={<Settings />} />
        
        {/* Redirect to appropriate page if route not found */}
        <Route path="*" element={
          activeDay ? <Navigate to="/" replace /> : <Navigate to="/day-start" replace />
        } />
      </Routes>
      
      {/* Floating End Day Button */}
      {showEndDayButton && (
        <Button 
          variant="secondary"
          className="floating-button"
          onClick={() => window.location.href = '/day-end'}
        >
          <StopCircle className="mr-2 h-5 w-5" />
          Finalizar Jornada
        </Button>
      )}
    </AppLayout>
  );
};

export default Index;
