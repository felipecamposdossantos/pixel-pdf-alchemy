
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ImagesToPdf from "./pages/ImagesToPdf";
import PdfToWord from "./pages/PdfToWord";
import MergePdf from "./pages/MergePdf";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/images-to-pdf" element={<ImagesToPdf />} />
          <Route path="/pdf-to-word" element={<PdfToWord />} />
          <Route path="/merge-pdf" element={<MergePdf />} />
          {/* Placeholder routes for other tools */}
          <Route path="/split-pdf" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Dividir PDF - Em breve!</h1></div>} />
          <Route path="/translate-pdf" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Traduzir PDF - Em breve!</h1></div>} />
          <Route path="/compress-pdf" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Comprimir PDF - Em breve!</h1></div>} />
          <Route path="/rotate-pdf" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Girar PDF - Em breve!</h1></div>} />
          <Route path="/protect-pdf" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Proteger PDF - Em breve!</h1></div>} />
          <Route path="/unlock-pdf" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Desbloquear PDF - Em breve!</h1></div>} />
          <Route path="/validate-pdf" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Validar PDF - Em breve!</h1></div>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
