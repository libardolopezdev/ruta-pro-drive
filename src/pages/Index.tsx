
import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import AppLayout from "../components/Layout/AppLayout";
import OnboardingFlow from "../components/onboarding/OnboardingFlow";
import Dashboard from "../components/dashboard/Dashboard";
import DayStart from "../components/tracking/DayStart";
import DayEnd from "../components/tracking/DayEnd";
import IncomeEntry from "../components/tracking/IncomeEntry";
import ExpenseEntry from "../components/tracking/ExpenseEntry";
import StatsSummary from "../components/statistics/StatsSummary";
import TestDataGenerator from "../components/testing/TestDataGenerator";
import { AppProvider } from "../context/AppContext";
import { Navigate } from "react-router-dom";

const Index: React.FC = () => {
  return (
    <AppProvider>
      <IndexContent />
    </AppProvider>
  );
};

const IndexContent: React.FC = () => {
  const { hasCompletedSetup, userConfig } = useAppContext();
  
  if (!hasCompletedSetup) {
    return <OnboardingFlow />;
  }
  
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/day-start" element={<DayStart />} />
        <Route path="/day-end" element={<DayEnd />} />
        <Route path="/income" element={<IncomeEntry />} />
        <Route path="/expenses" element={<ExpenseEntry />} />
        <Route path="/stats" element={<StatsSummary />} />
        <Route path="/test-data" element={<TestDataGenerator />} />
        <Route path="/settings" element={<Navigate to="/stats" replace />} />
        {/* If no route matches, show Dashboard */}
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </AppLayout>
  );
};

export default Index;
