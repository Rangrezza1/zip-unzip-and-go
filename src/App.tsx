import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useCartSync } from "@/hooks/useCartSync";
import { useThemeCSS } from "@/hooks/useThemeCSS";
import Index from "./pages/Index";
import ProductPage from "./pages/ProductPage";
import CollectionPage from "./pages/CollectionPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import RecentSalesPopup from "./components/widgets/RecentSalesPopup";

const queryClient = new QueryClient();

const AppContent = () => {
  useCartSync();
  useThemeCSS();
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
