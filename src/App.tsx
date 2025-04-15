
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VotingProvider } from "@/context/VotingContext";
import Index from "./pages/Index";
import CreateVote from "./pages/CreateVote";
import NotFound from "./pages/NotFound";
import VotesList from "./pages/VotesList";
import VoteDetails from "./pages/VoteDetails";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <VotingProvider>
          <Toaster />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/votes" element={<VotesList />} />
            <Route path="/votes/:id" element={<VoteDetails />} /> 
            <Route path="/create" element={<CreateVote />} /> 
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </VotingProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
