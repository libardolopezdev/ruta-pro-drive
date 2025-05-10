
import React, { useEffect } from "react";
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

const IndexContent: React.FC = () => {
  const { hasCompletedSetup, userConfig, activeDay } = useAppContext();
  const location = useLocation();
  
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
        <Route path="/day-end" element={
          activeDay ? <DayEnd /> : <Navigate to="/day-start" replace />
        } />
        <Route path="/income" element={
          activeDay ? <IncomeEntry /> : <Navigate to="/day-start" replace />
        } />
        <Route path="/expenses" element={
          activeDay ? <ExpenseEntry /> : <Navigate to="/day-start" replace />
        } />
        <Route path="/stats" element={
          activeDay ? <StatsSummary /> : <Navigate to="/day-start" replace />
        } />
        <Route path="/settings" element={<Settings />} />
        {/* If no route matches, redirect based on active day */}
        <Route path="*" element={
          activeDay ? <Dashboard /> : <Navigate to="/day-start" replace />
        } />
      </Routes>
    </AppLayout>
  );
};

export default Index;
