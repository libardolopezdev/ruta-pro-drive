
import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import AppLayout from "../components/Layout/AppLayout";
import OnboardingFlow from "../components/onboarding/OnboardingFlow";
import Dashboard from "../components/dashboard/Dashboard";
import DayStart from "../components/tracking/DayStart";
import IncomeEntry from "../components/tracking/IncomeEntry";
import ExpenseEntry from "../components/tracking/ExpenseEntry";
import StatsSummary from "../components/statistics/StatsSummary";
import { AppProvider } from "../context/AppContext";

const Index: React.FC = () => {
  return (
    <AppProvider>
      <IndexContent />
    </AppProvider>
  );
};

const IndexContent: React.FC = () => {
  const { hasCompletedSetup } = useAppContext();
  
  if (!hasCompletedSetup) {
    return <OnboardingFlow />;
  }
  
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/day-start" element={<DayStart />} />
        <Route path="/income" element={<IncomeEntry />} />
        <Route path="/expenses" element={<ExpenseEntry />} />
        <Route path="/stats" element={<StatsSummary />} />
        {/* Additional routes will be added as needed */}
      </Routes>
    </AppLayout>
  );
};

export default Index;
