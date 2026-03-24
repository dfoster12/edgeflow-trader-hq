import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "./pages/Dashboard";
import Trades from "./pages/Trades";
import Journal from "./pages/Journal";
import Analytics from "./pages/Analytics";
import RiskManager from "./pages/RiskManager";
import AIAssistant from "./pages/AIAssistant";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/trades" element={<AppLayout><Trades /></AppLayout>} />
          <Route path="/journal" element={<AppLayout><Journal /></AppLayout>} />
          <Route path="/analytics" element={<AppLayout><Analytics /></AppLayout>} />
          <Route path="/risk" element={<AppLayout><RiskManager /></AppLayout>} />
          <Route path="/ai" element={<AppLayout><AIAssistant /></AppLayout>} />
          <Route path="/settings" element={<AppLayout><SettingsPage /></AppLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
