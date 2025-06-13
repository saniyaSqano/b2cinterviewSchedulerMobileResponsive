
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import Homepage from "./components/Homepage";
import WelcomeScreen from "./components/WelcomeScreen";
import FreeAssessment from "./components/FreeAssessment";
import LevelsContent from "./components/LevelsContent";
import MCQTestPage from "./components/MCQTestPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/user" replace />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/user" element={<WelcomeScreen />} />
            <Route path="/freeassessment" element={<FreeAssessment />} />
            <Route path="/mcq-test" element={<MCQTestPage />} />
            <Route path="/levels" element={<LevelsContent />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
