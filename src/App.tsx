import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useCartSync } from "@/hooks/useCartSync";
import { useThemeCSS } from "@/hooks/useThemeCSS";
import { useCloudTheme } from "@/hooks/useCloudTheme";
import Index from "./pages/Index";
import ProductPage from "./pages/ProductPage";
import CollectionPage from "./pages/CollectionPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import RecentSalesPopup from "./components/widgets/RecentSalesPopup";
import WhatsAppWidget from "./components/WhatsAppWidget";

const queryClient = new QueryClient();

const AppContent = () => {
  useCartSync();
  useThemeCSS();
  useCloudTheme();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/product/:handle" element={<ProductPage />} />
        <Route path="/collections" element={<CollectionPage />} />
        <Route path="/collections/:collection" element={<CollectionPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <RecentSalesPopup />
      <WhatsAppWidget />
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
