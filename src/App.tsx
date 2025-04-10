
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VotingProvider } from "@/context/VotingContext";
import Index from "./pages/Index";
import CreateVote from "./pages/CreateVote";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <VotingProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/votes" element={<Index />} /> {/* Placeholder, will be updated in future */}
            <Route path="/votes/:id" element={<Index />} /> {/* Placeholder, will be updated in future */}
            <Route path="/create" element={<CreateVote />} /> 
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </VotingProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
