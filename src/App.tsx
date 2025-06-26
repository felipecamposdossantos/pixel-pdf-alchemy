
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ImagesToPdf from "./pages/ImagesToPdf";
import PdfToWord from "./pages/PdfToWord";
import MergePdf from "./pages/MergePdf";
import SplitPdf from "./pages/SplitPdf";
import TranslatePdf from "./pages/TranslatePdf";
import CompressPdf from "./pages/CompressPdf";
import RotatePdf from "./pages/RotatePdf";
import ProtectPdf from "./pages/ProtectPdf";
import UnlockPdf from "./pages/UnlockPdf";
import ValidatePdf from "./pages/ValidatePdf";
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
          <Route path="/split-pdf" element={<SplitPdf />} />
          <Route path="/translate-pdf" element={<TranslatePdf />} />
          <Route path="/compress-pdf" element={<CompressPdf />} />
          <Route path="/rotate-pdf" element={<RotatePdf />} />
          <Route path="/protect-pdf" element={<ProtectPdf />} />
          <Route path="/unlock-pdf" element={<UnlockPdf />} />
          <Route path="/validate-pdf" element={<ValidatePdf />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
